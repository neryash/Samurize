import requests
import sys
r = requests.post(
    "https://api.deepai.org/api/summarization",
    data={
        'text': sys.argv[1],
    },
    headers={'api-key': '367af7d3-1624-4e8d-8c98-4ee42523fc61'}
)
print(r.json())
