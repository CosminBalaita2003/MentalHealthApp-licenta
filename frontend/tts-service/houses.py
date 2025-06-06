import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)

signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

houses = [f"House {i}" for i in range(1, 13)]

output = {}

for house in houses:
    output[house] = {}
    for sign in signs:
        print(f"🏠 Generating explanation for {house} in {sign}...")

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert astrologer."},
                    {"role": "user", "content":
                        f"""Explain in detail what it means when {house} is in {sign} in someone's birth chart. 
                        Describe the life areas influenced, the expression of that zodiac energy, and how it impacts the person's personality and choices.In a few phrases
                        """}
                ],
                temperature=0.7
            )

            explanation = response.choices[0].message.content.strip()
            output[house][sign] = explanation

        except Exception as e:
            print(f"❌ Error for {house} in {sign}: {e}")
            output[house][sign] = f"Error: {str(e)}"

# Save to JSON
with open("house_explanations.json", "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("✅ All explanations saved to house_explanations.json")
