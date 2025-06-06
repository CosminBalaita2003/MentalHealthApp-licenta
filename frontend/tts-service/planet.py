# import os
# import json
# from dotenv import load_dotenv
# from openai import OpenAI

# load_dotenv()
# api_key = os.getenv("OPENAI_API_KEY")

# client = OpenAI(api_key=api_key)

# planets = [
#     "Sun", "Moon", "Mercury", "Venus", "Mars",
#     "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"
# ]

# signs = [
#     "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
#     "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
# ]

# output = {}

# for planet in planets:
#     output[planet] = {}
#     for sign in signs:
#         print(f"🔮 Generating explanation for {planet} in {sign}...")

#         try:
#             response = client.chat.completions.create(
#                 model="gpt-3.5-turbo",
#                 messages=[
#                     {"role": "system", "content": "You are an expert astrologer."},
#                     {"role": "user", "content":
#                         f"""Explain in detail what it means if {planet} is in {sign} in someone's birth chart. 
#                         Discuss their personality traits, strengths, weaknesses, and how this placement can influence their life journey."""}
#                 ],
#                 temperature=0.7
#             )

#             explanation = response.choices[0].message.content.strip()
#             output[planet][sign] = explanation

#         except Exception as e:
#             print(f"❌ Error for {planet} in {sign}: {e}")
#             output[planet][sign] = f"Error: {str(e)}"

# # Save to JSON
# with open("planet_explanations.json", "w", encoding="utf-8") as f:
#     json.dump(output, f, ensure_ascii=False, indent=2)

# print("✅ All explanations saved to planet_explanations.json")
import openai
import json
import os
from time import sleep
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

zodiac_signs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

# Include all planets, asteroids, and key points
astro_bodies = [
    "Ascendant", "Descendant", "MC", "IC",
    "Chiron", "Lilith", "True Node", "Mean Node",
    "Ceres", "Vesta", "Pallas", "Juno"
]

result = {}

for body in astro_bodies:
    result[body] = {}
    for sign in zodiac_signs:
        prompt = (
            f"What does it mean if {body} is in {sign} in a birth chart? "
            "Describe the personality traits, strengths, and challenges associated with this placement "
            "in a detailed and clear explanation. In a few phrases"
        )
        print(f"🔮 Generating for {body} in {sign}...")

        try:
            response = openai.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            explanation = response.choices[0].message.content.strip()
            result[body][sign] = explanation
            sleep(1.5)  # to avoid rate limits
        except Exception as e:
            print(f"❌ Error for {body} in {sign}: {str(e)}")
            result[body][sign] = f"Error: {str(e)}"

# Save the result
with open("planet_explanations_extended.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print("✅ All explanations generated and saved.")
