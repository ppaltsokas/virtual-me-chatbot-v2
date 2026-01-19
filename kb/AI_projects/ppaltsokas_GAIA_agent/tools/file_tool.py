import pandas as pd

class FileTool:
    def read_csv_or_excel(self, file_path: str) -> str:
        try:
            if file_path.endswith(".csv"):
                df = pd.read_csv(file_path)
            elif file_path.endswith((".xlsx", ".xls")):
                df = pd.read_excel(file_path)
            else:
                return "Unsupported file type."
            return df.head(10).to_markdown()
        except Exception as e:
            return f"Failed to read file: {e}"
