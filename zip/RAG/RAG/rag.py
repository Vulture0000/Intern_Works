import json
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI
)
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

import truststore
truststore.inject_into_ssl()

class Rag:

    def __init__(self, json_file):

        self.json_file = json_file

        self.documents = []
        self.chunks = []
        self.vectorstore = None

        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/gemini-embedding-001"
        )

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-3.6-flash",
        )

    # ------------------------------------------------
    # 1. Load JSON
    # ------------------------------------------------
    def load_json(self):

        with open(self.json_file, "r", encoding="utf-8") as file:
            data = json.load(file)

        for item in data:
            document = Document(
                page_content=item["text"],
                metadata={
                    "id": item["id"],
                    "category": item["category"]
                }
            )

            self.documents.append(document)

        # print("Loaded documents:", len(self.documents))

        return self.documents
    # ------------------------------------------------
    # 2. Split documents
    # ------------------------------------------------
    def text_splitter(self):

        self.chunks = self.documents

        # print("Chunks:", len(self.chunks))

        return self.chunks

    # ------------------------------------------------
    # 3. Create vector database
    # ------------------------------------------------
    def vectorizer(self):

        if not self.chunks:
            raise ValueError("No documents available for vectorization.")

        self.vectorstore = FAISS.from_documents(
            documents=self.chunks,
            embedding=self.embeddings
        )

        # print("FAISS vector store created.")

        return self.vectorstore
    # ------------------------------------------------
    # 4. Retrieve relevant documents
    # ------------------------------------------------
    def retrieve(self, question, k=5):

        results = self.vectorstore.similarity_search_with_score(
            question,
            k=k
        )

        for document, score in results:
            print(
                f"Score: {score:.4f} | "
                f"Category: {document.metadata['category']} | "
                f"Text: {document.page_content}"
            )

        return results

    def check_relevance(self, results):

        THRESHOLD = 0.8

        relevant_results = []

        for document, score in results:

            print("Score:", score)
            # print("Document:", document.page_content)

            if score <= THRESHOLD:
                relevant_results.append(
                    (document, score)
                )

        return relevant_results

    # ------------------------------------------------
    # 5. Generate answer
    # ------------------------------------------------
    def ask(self, question):

        results = self.retrieve(question, k=5)

        if not results:
            return {
                "output": "",
                "got_output": False
            }

        THRESHOLD = 0.5

        relevant_results = []

        for document, score in results:

            if score <= THRESHOLD:
                relevant_results.append(
                    (document, score)
                )

        if not relevant_results:
            return {
                "output": "",
                "got_output": False
            }

        context = "\n\n".join(
            document.page_content
            for document, score in relevant_results
        )

        prompt = f"""
    You are a knowledge-base question answering system.

    Answer the question ONLY using the information
    provided in the knowledge base.

    Do not make up information.

    If the knowledge base does not contain enough
    information to answer the question, say that the
    knowledge base does not contain sufficient information.

    Knowledge Base:
    ----------------
    {context}
    ----------------

    Question:
    {question}

    Answer:
    """

        response = self.llm.invoke(prompt)

        output_text = response.content[0]["text"]

        return {
            "output": output_text,
            "got_output": True
        }