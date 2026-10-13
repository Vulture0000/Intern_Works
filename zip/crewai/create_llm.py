import os
from dotenv import load_dotenv
from crewai import LLM

llm = LLM(
        model = "gemini/gemini-2.5-flash-lite",
        api_key = os.getenv("GEMINI_API_KEY")
    )
def llm_creater():
    load_dotenv()

    os.environ["GEMINI_API_KEY"] = os.getenv("GEMINI_API_KEY")

    from crewai import Agent

    content_creator_assistant = Agent(
        role="Content Creator",
        goal="Create engaging content",
        backstory="You are an expert content creator.",
        llm=llm
    )
