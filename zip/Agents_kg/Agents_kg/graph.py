from langgraph.graph import StateGraph, END

from state import AgentState
from agents import (
    cypher_agent,
    graph_agent,
    answer_agent
)

workflow = StateGraph(AgentState)

workflow.add_node("cypher_agent", cypher_agent)
workflow.add_node("graph_agent", graph_agent)
workflow.add_node("answer_agent", answer_agent)

workflow.set_entry_point("cypher_agent")

workflow.add_edge("cypher_agent", "graph_agent")
workflow.add_edge("graph_agent", "answer_agent")
workflow.add_edge("answer_agent", END)

app = workflow.compile()

while True:
    question = input("Ask: ")
    if question == "exit":
        print("Goodbye!")
        break
    result = app.invoke({
        "question": question
    })

    print(result["answer"])