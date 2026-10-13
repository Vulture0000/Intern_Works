import os
from dotenv import load_dotenv
from crewai import LLM
import truststore

truststore.inject_into_ssl()

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
llm = LLM(
        model = "gemini/gemini-3.5-flash",
        api_key = api_key
    )

def llm_creater():

    #os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY")

    from crewai import Agent

    content_creator_assistant = Agent(
        role="Content Creator",
        goal="Create engaging content",
        backstory="You are an expert content creator.",
        llm=llm
    )
    return content_creator_assistant
