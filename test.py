import requests

API_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"
headers = {"Authorization": "Bearer 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"}

def query(filename):
    with open(filename, "rb") as f:
        data = f.read()
    response = requests.post(API_URL, headers=headers, data=data)
    return response.json()

output = query("test.mp3")
print(output)