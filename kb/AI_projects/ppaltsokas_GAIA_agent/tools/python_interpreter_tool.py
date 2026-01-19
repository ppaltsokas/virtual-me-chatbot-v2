"""
Python interpreter tool that allows the agent to write and execute Python code dynamically.
This is a key capability from the reference agent that we're missing.
"""
import io
import sys
import traceback
from contextlib import redirect_stdout, redirect_stderr
from typing import Any


class PythonInterpreterTool:
    """
    Executes Python code dynamically with persistent state between executions.
    This allows the agent to write code on the fly to solve problems.
    """

    def __init__(self):
        self.namespace: dict[str, Any] = {}
        # Pre-import common libraries
        self.namespace.update({
            'pandas': __import__('pandas'),
            'pd': __import__('pandas'),
            'numpy': __import__('numpy'),
            'np': __import__('numpy'),
            're': __import__('re'),
            'json': __import__('json'),
            'math': __import__('math'),
            'datetime': __import__('datetime'),
            'collections': __import__('collections'),
            'itertools': __import__('itertools'),
            'requests': __import__('requests'),
        })

    def execute_code(self, code: str) -> str:
        """
        Execute Python code and return stdout/stderr.
        State persists between calls (variables remain in namespace).
        """
        # Clean up code - remove markdown code blocks if present
        code = code.strip()
        if code.startswith('```python'):
            code = code[9:]
        if code.startswith('```'):
            code = code[3:]
        if code.endswith('```'):
            code = code[:-3]
        code = code.strip()

        if not code:
            return "No code provided."

        # Capture stdout and stderr
        stdout_capture = io.StringIO()
        stderr_capture = io.StringIO()

        try:
            with redirect_stdout(stdout_capture), redirect_stderr(stderr_capture):
                # Execute in the persistent namespace
                exec(code, self.namespace)
            
            stdout = stdout_capture.getvalue()
            stderr = stderr_capture.getvalue()
            
            if stderr:
                return f"Error: {stderr}\nOutput: {stdout}" if stdout else f"Error: {stderr}"
            return stdout if stdout else "Code executed successfully (no output)."
            
        except Exception as e:
            error_msg = ''.join(traceback.format_exception(type(e), e, e.__traceback__))
            return f"Execution error: {error_msg}"

    def get_variable(self, var_name: str) -> str:
        """Get the value of a variable from the namespace."""
        if var_name in self.namespace:
            value = self.namespace[var_name]
            return str(value)
        return f"Variable '{var_name}' not found in namespace."

