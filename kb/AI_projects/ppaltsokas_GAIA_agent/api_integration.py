import requests
from typing import List, Dict, Any

class GAIAApiClient:
    def __init__(self, api_url="https://agents-course-unit4-scoring.hf.space"):
        self.api_url = api_url
        self.questions_url = f"{api_url}/questions"
        self.submit_url = f"{api_url}/submit"
        self.files_url = f"{api_url}/files"

    def get_questions(self) -> List[Dict[str, Any]]:
        response = requests.get(self.questions_url)
        response.raise_for_status()
        return response.json()

    def get_file(self, task_id: str) -> bytes:
        response = requests.get(f"{self.files_url}/{task_id}")
        response.raise_for_status()
        return response.content

    def submit_answers(self, username: str, agent_code: str, answers: List[Dict[str, Any]]) -> Dict[str, Any]:
        data = {
            "username": username,
            "agent_code": agent_code,
            "answers": answers
        }
        response = requests.post(self.submit_url, json=data)
        response.raise_for_status()
        return response.json()
