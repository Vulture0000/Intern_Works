# Create the content planning crew
from crewai import Crew
from agents import defining_agent
from tasks import task
from create_llm import llm_creater,llm
import sys

sys.stdout.reconfigure(encoding='utf-8')
sys.stderr.reconfigure(encoding='utf-8')
llm_creater()
# import os
# print(os.getenv("GEMINI_API_KEY"))
# print(llm.model)

crew = Crew(
    agents=[defining_agent],
    tasks=[task]
)

print("orchastration is done successfully")

# Execute the crew's task
result = crew.kickoff()
print(result)

