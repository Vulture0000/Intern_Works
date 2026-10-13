import truststore
truststore.inject_into_ssl()

from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)

response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="Hello"
)

print(response.text)