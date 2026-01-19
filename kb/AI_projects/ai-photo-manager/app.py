import os
import json
from pathlib import Path
from io import BytesIO
import base64
from urllib.parse import quote, unquote
import streamlit as st
from PIL import Image
from send2trash import send2trash
from dotenv import load_dotenv

from core.db import init_db, get_conn
from core.indexer import index_folder
from core.search import search
from core.db_delete import mark_deleted
from utils.paths import safe_exists
from utils.clipboard import cut_files_to_clipboard

load_dotenv(dotenv_path=Path(__file__).resolve().parent / ".env", override=True)

st.set_page_config(page_title="AI Photo Gallery Manager", layout="wide")

HISTORY_PATH = Path(__file__).resolve().parent / ".index_history.json"
THUMB_PX = 220
PREVIEW_PX = 900

def _img_to_data_uri(img: Image.Image) -> str:
    buf = BytesIO()
    img.save(buf, format="JPEG", quality=85)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/jpeg;base64,{b64}"

def _make_thumb_and_preview(path: str):
    img = Image.open(path).convert("RGB")
    thumb = img.copy()
    thumb.thumbnail((THUMB_PX, THUMB_PX))
    preview = img.copy()
    preview.thumbnail((PREVIEW_PX, PREVIEW_PX))
    return thumb, preview

def _load_history():
    try:
        if HISTORY_PATH.exists():
            with HISTORY_PATH.open("r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list):
                    return [str(x) for x in data]
    except Exception:
        pass
    return []

def _save_history(items):
    try:
        with HISTORY_PATH.open("w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=True, indent=2)
    except Exception:
        pass

def main():
    init_db()

    st.title("AI Photo Gallery Manager")

    st.markdown(
        """
        <style>
        div[data-testid="stStatusWidget"] { display: none; }
        div[data-testid="stSpinner"] { display: none; }
        </style>
        """,
        unsafe_allow_html=True,
    )

    params = st.query_params
    view_param = params.get("view")
    if view_param:
        st.subheader("Image preview")
        path = unquote(view_param)
        if not safe_exists(path):
            st.error("File does not exist.")
            st.text(path)
            return
        try:
            img = Image.open(path)
            st.image(img, use_container_width=True)
        except Exception as e:
            st.error("Cannot render image preview.")
            st.code(str(e))
        st.markdown("[Back to search](./)")
        return

    with st.sidebar:
        st.header("Indexing")
        history = _load_history()
        if "folder_input" not in st.session_state:
            st.session_state["folder_input"] = history[0] if history else r"E:\Photos"

        selected_history = st.selectbox(
            "Recent folders",
            options=["(none)"] + history,
            index=0,
        )
        if selected_history != "(none)" and selected_history != st.session_state["folder_input"]:
            st.session_state["folder_input"] = selected_history

        folder = st.text_input("Photo folder to index", key="folder_input")
        rescan_deleted_only = st.checkbox("Rescan deleted only", value=False)
        rescan_tags_only = st.checkbox("Rescan tags only (no embeddings)", value=False)
        if st.button("Index folder"):
            if not os.path.isdir(folder):
                st.error("Folder does not exist.")
            else:
                with st.spinner("Indexing..."):
                    index_folder(
                        folder,
                        rescan_deleted_only=rescan_deleted_only,
                        rescan_tags_only=rescan_tags_only,
                    )
                st.success("Index completed.")
                if folder:
                    new_history = [folder] + [p for p in history if p != folder]
                    _save_history(new_history[:20])
        try:
            conn = get_conn()
            total = conn.execute("SELECT COUNT(*) FROM images WHERE deleted=0").fetchone()[0]
            conn.close()
            st.caption(f"Indexed items: {total}")
        except Exception:
            pass

        st.divider()
        st.header("Provider")
        st.write(f"AI_PROVIDER = {os.getenv('AI_PROVIDER','openai')}")
        missing_in_sidebar = st.session_state.get("missing_files", [])
        if missing_in_sidebar:
            st.subheader("Missing files")
            for p in missing_in_sidebar:
                st.write(Path(p).name)

    st.header("Search")
    query = st.text_input("What image are you looking for?")

    if query:
        with st.expander("Filters"):
            st.caption("Filters use indexed tags. Re-index to populate tags on older items.")
            exclude_people = st.checkbox("Exclude people", value=False)
            exclude_faces = st.checkbox("Exclude faces", value=False)
            exclude_text = st.checkbox("Exclude text", value=False)
            only_documents = st.checkbox("Only documents", value=False)
            only_screenshots = st.checkbox("Only screenshots", value=False)
            environment = st.radio("Environment", ["Any", "Indoor", "Outdoor"], horizontal=True)

        filters = {
            "exclude_people": exclude_people,
            "exclude_faces": exclude_faces,
            "exclude_text": exclude_text,
            "only_documents": only_documents,
            "only_screenshots": only_screenshots,
            "environment": environment,
        }

        css = """
            <style>
            div[data-testid="stColumn"] {{
                overflow: visible;
            }}
            .thumb-wrap {{
                position: relative;
                width: {thumb_px}px;
                height: {thumb_px}px;
                margin-bottom: 8px;
            }}
            .thumb-link {{
                display: inline-block;
                width: {thumb_px}px;
                height: {thumb_px}px;
            }}
            .thumb-img {{
                width: {thumb_px}px;
                height: {thumb_px}px;
                object-fit: cover;
                border-radius: 6px;
                border: 1px solid #ddd;
                cursor: zoom-in;
            }}
            </style>
            """.format(
            thumb_px=THUMB_PX,
        )
        st.markdown(css, unsafe_allow_html=True)

        results = search(query=query, limit=60, filters=filters)
        sort_mode = st.radio("Sort by", options=["Relevance", "Filename"], horizontal=True)
        if sort_mode == "Filename":
            results = sorted(results, key=lambda r: Path(r["path"]).name.lower())
        st.caption(f"{len(results)} results")

        selected_paths = []
        missing_files = []
        with st.form("results_form"):
            cols = st.columns(4)

            for i, r in enumerate(results):
                col = cols[i % 4]
                with col:
                    path = r["path"]

                    if not safe_exists(path):
                        missing_files.append(path)
                        continue

                    try:
                        thumb, _preview = _make_thumb_and_preview(path)
                        thumb_uri = _img_to_data_uri(thumb)
                        view_href = f"?view={quote(path)}"
                        st.markdown(
                            f"""
                            <div class="thumb-wrap">
                              <a class="thumb-link" href="{view_href}" target="_blank" rel="noopener">
                                <img class="thumb-img" src="{thumb_uri}" />
                              </a>
                            </div>
                            """,
                            unsafe_allow_html=True,
                        )
                    except Exception:
                        st.warning("Cannot render image preview")
                        st.text(path)

                    tick = st.checkbox("Select", key=f"sel_{r['id']}")
                    if tick:
                        selected_paths.append(path)

            st.divider()
            st.subheader("Actions")

            mark_after_cut = st.checkbox("Mark as deleted after cut", value=True)
            do_cut = st.form_submit_button("Cut selected to Clipboard")
            do_delete = st.form_submit_button("Send selected to Recycle Bin")

        if do_cut:
            if not selected_paths:
                st.info("No images selected.")
            else:
                try:
                    cut_files_to_clipboard(selected_paths)
                    if mark_after_cut:
                        mark_deleted(selected_paths)
                    st.success(f"Cut {len(selected_paths)} images to the clipboard.")
                except Exception as e:
                    st.error("Cut to clipboard failed.")
                    st.code(str(e))

        if do_delete:
            if not selected_paths:
                st.info("No images selected.")
            else:
                failed = []
                for p in selected_paths:
                    try:
                        send2trash(p)
                    except Exception as e:
                        failed.append((p, str(e)))

                mark_deleted(selected_paths)

                if failed:
                    st.error("Some deletions failed:")
                    for p, err in failed:
                        st.write(p)
                        st.code(err)
                else:
                    st.success(f"Sent {len(selected_paths)} images to Recycle Bin.")

        st.session_state["missing_files"] = missing_files

if __name__ == "__main__":
    main()
