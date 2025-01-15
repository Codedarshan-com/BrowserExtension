import requests
import json

url = "https://api.theb.ai/v1/chat/completions"
# url = "https://api.baizhi.ai/v1/chat/completions"

payload = json.dumps({
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Hello, World!"
    }
  ],
  "stream": False
})
headers = {
  'Authorization': 'Bearer sk-tJIA8Lcs1Y96rfydYZq4VGhlQi5BSQZRDgznsrxZ7rULihCr',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.json())