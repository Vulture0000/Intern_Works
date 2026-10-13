from google import genai
from langsmith import wrappers
import truststore
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

# print(api_key)

truststore.inject_into_ssl()

def main():
    # genai.Client() reads GOOGLE_API_KEY / GEMINI_API_KEY from the environment

    gemini_client = genai.Client()

    # Wrap the Gemini client to enable LangSmith tracing
    client = wrappers.wrap_gemini(
        gemini_client,
        tracing_extra={
            "tags": ["gemini", "python"],
            "metadata": {
                "integration": "google-genai",
            },
        },
    )

    # Make a traced Gemini call
    response = client.models.generate_content(
        model="gemini-3.5-flash",
        contents="Explain quantum computing in simple terms.",
    )

    print(response.text)


if __name__ == "__main__":
    main()