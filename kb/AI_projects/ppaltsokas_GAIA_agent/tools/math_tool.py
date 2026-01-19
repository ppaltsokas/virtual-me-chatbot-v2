import re
import sympy as sp


class MathTool:
    def evaluate_expression(self, question: str) -> str:
        """
        Evaluates arithmetic expressions safely using sympy.
        Supports integers, floats, and common operators.
        """
        try:
            cleaned = question.strip()
            if not cleaned:
                return "No expression provided."

            # Reject obviously dangerous strings.
            if re.search(r"[^0-9\.\+\-\*\/\^\(\)\s x]", cleaned):
                return "Unsupported characters in expression."

            expr = sp.sympify(cleaned, evaluate=True)
            result = expr.evalf() if expr.free_symbols else expr
            return str(result)
        except Exception as e:
            return f"Expression evaluation failed: {e}"

    def solve_equation(self, equation: str) -> str:
        """
        Solves a single‑variable equation like '2*x + 3 = 7'.
        Gracefully handles malformed input.
        """
        try:
            # Ensure there is exactly one `=`
            if equation.count('=') != 1:
                return "Expected a single '=' in the equation."

            lhs, rhs = map(str.strip, equation.split('='))
            if not lhs or not rhs:
                return "Left‑hand side or right‑hand side is empty."

            x = sp.symbols('x')
            solution = sp.solve(sp.sympify(lhs) - sp.sympify(rhs), x)

            if not solution:
                return "No solution found."
            return f"Solution: x = {solution}"
        except Exception as e:
            return f"Equation solving failed: {e}"
