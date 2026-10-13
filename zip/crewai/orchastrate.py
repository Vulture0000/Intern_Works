# Create the content planning crew
from crewai import Crew
from agents import defining_agent
from tasks import task
from create_llm import llm_creater,llm

llm_creater()
import os
print(os.getenv("GEMINI_API_KEY"))
print(llm.model)

crew = Crew(
    agents=[defining_agent],
    tasks=[task]
)

print("✓ Content planning crew created")
print("\n🚀 Starting content planning...\n")

# Execute the crew's task
result = crew.kickoff()

print("\n✓ Content planning complete!")
