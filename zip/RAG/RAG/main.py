import truststore

truststore.inject_into_ssl()

from dotenv import load_dotenv

load_dotenv()

from rag import Rag


rag = Rag("KB/sample_kb_data.json")

rag.load_json()
rag.text_splitter()
rag.vectorizer()

result = rag.ask(
    "What discount does a Gold tier customer receive?"
)

print(result)