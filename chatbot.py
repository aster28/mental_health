import json

# Load JSON file
with open("data1.json", "r") as file:
    data = json.load(file)

def chatbot(user_input):
    for item in data:
        if user_input.lower() in item["question"].lower():
            return item["answer"]
    return "Sorry, I don't understand."

# Chat loop
while True:
    user_input = input("You: ")
    if user_input.lower() == "exit":
        break
    print("Bot:", chatbot(user_input))