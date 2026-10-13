import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0
)

from neo4j_tool import query_graph

def graph_agent(state):

    question = state["question"]

    result = query_graph(question)

    state["graph_result"] = result

    return state

def answer_agent(state):

    question = state["question"]

    graph_data = state["graph_result"]

    prompt = f"""
    User Question:
    {question}

    Neo4j Result:
    {graph_data}

    Generate a concise answer.
    """

    response = llm.invoke(prompt)

    state["answer"] = response.content

    return state

def cypher_agent(state):
    print("STATE RECEIVED:", state)

    question = state.get("question")

    if not question:
        raise ValueError(
            f"question not found in state. State={state}"
        )

    prompt = f"""
    Convert the question into Neo4j Cypher.

    Return only Cypher.
    """

    response = llm.invoke(prompt)

    state["cypher"] = response.content

    return state