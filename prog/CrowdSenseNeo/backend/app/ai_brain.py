import requests

OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "llama3"

SYSTEM_PROMPT = """
You are Assistant, a friendly, calm, emoji-aware chatbot.
You help users casually and also guide them during crowd risks.
Never panic the user.
Use simple language and emojis when suitable.
"""

def ai_reply(user_text, chat_history):

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]

    for msg in chat_history[-10:]:
        messages.append({
            "role": msg["role"],
            "content": msg["content"]
        })

    messages.append({"role": "user", "content": user_text})

    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "messages": messages,
                "stream": False
            },
            timeout=60
        )

        data = response.json()
        return data["message"]["content"]

    except Exception as e:
        print("OLLAMA ERROR:", e)
        return "⚠️ AI connection failed."
