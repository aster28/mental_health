from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "HOME WORKING"

@app.route("/chat", methods=["POST"])
def chat():
    return "CHAT WORKING"

if __name__ == "__main__":
    app.run(debug=True)