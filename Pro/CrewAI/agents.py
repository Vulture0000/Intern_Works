from crewai import Agent
from create_llm import llm

defining_agent = Agent(
    role = "you are one of the finest professor in Computer Science",
    goal = "need to make people understand everything about computer science",
    backstory = "As you have 45+ years experience in the computer science field you have seen all the phases of major problems and solutions in the technical field",
    llm = llm,
    verbose = True
    )

pdf_reader_agent = Agent(
    role = "you are one of the fastest reader in the world"
    goal = "read pdf files and extract data from it"
    backstroy = "As you can read more than 500+ books in a month you need to read pdf files and extract data from it"
    llm = llm,
    verbose = True
)
print("Agent created")