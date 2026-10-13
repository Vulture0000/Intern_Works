from crewai import Task

from agents import defining_agent

task = Task(
    description=(
        "Explain what Artificial Intelligence (AI) is. "
        "Describe the different categories of AI. "
        "Explain the history of AI."
    ),
    expected_output="""
    Output a JSON object following the schema below:

    {
      "title": "<clear and searchable title>",
      "description": "<concise explanation of Artificial Intelligence>",
      "types": [
        "<AI category 1>",
        "<AI category 2>",
        "<AI category 3>"
      ],
      "example": "<real-world example of AI>",
      "history": "<brief history and evolution of Artificial Intelligence>"
    }

    Ensure the response:
    - Is valid JSON.
    - Includes all required fields.
    - Provides at least 3 AI categories in the "types" array.
    - Uses concise, informative descriptions.
    """,
    agent=defining_agent
)

print("the task was created successfully")