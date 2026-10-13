import os
from google import genai
from dotenv import load_dotenv

import truststore

from create_llm import api_key

truststore.inject_into_ssl()

load_dotenv()

client = genai.Client(api_key=api_key)

response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="Hello"
)

print(response.text)

#
# import httpx
#
# response = httpx.get("https://generativelanguage.googleapis.com")
# print(response.status_code)
