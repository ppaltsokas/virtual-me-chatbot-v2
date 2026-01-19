import os
import faiss
import pickle
from sentence_transformers import SentenceTransformer
from typing import List, Tuple

class QARetriever:
    def __init__(self, qa_data: List[Tuple[str, str]], top_k: int = 1):
        self.top_k = top_k
        self.model = SentenceTransformer("all-mpnet-base-v2")
        self.qa_data = qa_data
        self.embeddings = self.model.encode([q for q, _ in qa_data], convert_to_numpy=True)
        self.index = faiss.IndexFlatL2(self.embeddings.shape[1])
        self.index.add(self.embeddings)

    def retrieve(self, query: str) -> List[str]:
        query_embedding = self.model.encode([query], convert_to_numpy=True)
        distances, indices = self.index.search(query_embedding, self.top_k)
        return [f"Q: {self.qa_data[i][0]}\nA: {self.qa_data[i][1]}" for i in indices[0]]
