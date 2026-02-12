from flask import Flask, request, jsonify, render_template
import ollama

app = Flask(__name__)

# SYSTEM PROMPT (AI Constraint)
SYSTEM_PROMPT = """
You are an AI Music Entertainment Chatbot.

You ONLY answer questions related to:
- Music artists
- Songs
- Albums
- Music events
- Streaming platforms
- Music genres

If a user asks anything outside music entertainment,
reply strictly with:

"I am restricted to music entertainment topics only."
"""

# Keyword Filter Layer
MUSIC_KEYWORDS = [
    "music", "song", "artist", "album",
    "concert", "event", "stream",
    "spotify", "genre", "lyrics",
    "band", "rapper", "singer",
    "dj", "producer"
]

def is_music_related(message):
    return any(word in message.lower() for word in MUSIC_KEYWORDS)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()
    user_message = data.get("message")

    if not user_message:
        return jsonify({"reply": "Please enter a message."})

    # Context restriction layer
    if not is_music_related(user_message):
        return jsonify({
            "reply": "❌ This chatbot only handles music entertainment related queries."
        })

    try:
        response = ollama.chat(
            model="llama3:8b-instruct-q4_0",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message}
            ]
        )

        return jsonify({
            "reply": response["message"]["content"]
        })

    except Exception as e:
        return jsonify({
            "reply": f"Error: {str(e)}"
        })


if __name__ == "__main__":
    app.run(debug=True)
