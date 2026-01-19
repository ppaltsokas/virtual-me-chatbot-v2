import subprocess
import sys      # new

class CodeExecutionTool:
    def execute_python_file(self, file_path: str) -> str:
        try:
            result = subprocess.run(
                [sys.executable, file_path],   # guarantees same interpreter
                capture_output=True,
                text=True,
                timeout=10
            )
            if result.returncode != 0:
                return f"Error in code execution:\n{result.stderr.strip()}"
            return result.stdout.strip()
        except subprocess.TimeoutExpired:
            return "Code execution timed out."
        except Exception as e:
            return f"Execution failed: {e}"
