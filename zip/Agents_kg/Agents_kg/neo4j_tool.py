from neo4j import GraphDatabase
import os
from dotenv import load_dotenv
import truststore
truststore.inject_into_ssl()

from neo4j import GraphDatabase
from dotenv import load_dotenv
import os

load_dotenv()

driver = GraphDatabase.driver(
    os.getenv("NEO4J_URI"),
    auth=(
        os.getenv("NEO4J_USER"),
        os.getenv("NEO4J_PASSWORD")
    )
)

def create_data():
    with driver.session() as session:

        session.run("""
        MERGE (r:Person {name:'Ramprasath'})
        MERGE (p:Project {name:'Project X'})
        MERGE (r)-[:WORKS_ON]->(p)
        """)

create_data()


def query_graph(question: str):

    query = """
    MATCH (p:Person)-[:WORKS_ON]->(pr:Project)
    RETURN p.name as person,
           pr.name as project
    """

    with driver.session() as session:

        result = session.run(query)

        rows = []

        for row in result:
            rows.append(
                {
                    "person": row["person"],
                    "project": row["project"]
                }
            )

    return str(rows)
