import pandas as pd

class TableTool:
    def __init__(self):
        pass

    def extract_insights(self, filepath: str, question: str) -> str:
        try:
            if filepath.endswith(".csv"):
                df = pd.read_csv(filepath)
            elif filepath.endswith((".xls", ".xlsx")):
                df = pd.read_excel(filepath)
            else:
                return "Unsupported file type for table processing."

            # Prepare a compact string representation of the dataframe
            table_preview = df.head(10).to_string(index=False)

            # Construct prompt for GPT
            return f"""You are an expert at interpreting tabular data.
Below is a preview of a table:

{table_preview}

Question: {question}
Answer:"""

        except Exception as e:
            return f"Failed to load table: {e}"
