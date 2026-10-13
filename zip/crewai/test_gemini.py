from google import genai
import os
from dotenv import load_dotenv

import certifi
print(certifi.where())

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

response = client.models.generate_content(
    model="gemini-2.5-flash-lite",
    contents="Hello"
)

print(response.text)

#
# import httpx
#
# response = httpx.get("https://generativelanguage.googleapis.com")
# print(response.status_code)
