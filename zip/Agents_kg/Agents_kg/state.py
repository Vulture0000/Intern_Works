from typing import TypedDict, Optional

class AgentState(TypedDict):
    question: str
    cypher: Optional[str]
    graph_result: Optional[str]
    answer: Optional[str]