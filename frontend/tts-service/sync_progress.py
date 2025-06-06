#!/usr/bin/env python3
import os
import requests
import pandas as pd
from dotenv import load_dotenv

# 1) Încarcă .env și URL-ul corect
load_dotenv()
API_URL = os.getenv("API_URL")  # recomandări din baza de date
if not API_URL:
    raise RuntimeError("API_URL nu e setat în .env")

CSV_PATH = "data/progress.csv"
TOKEN = os.getenv("TOKEN")      # dacă ai nevoie de autentificare

# 2) Fetch progres din API-ul .NET
headers = {}
if TOKEN:
    headers["Authorization"] = f"Bearer {TOKEN}"

resp = requests.get(f"{API_URL}/api/Progress", headers=headers)
resp.raise_for_status()
raw = resp.json()  # listă de { id, exerciseId, userId, date }

# 3) Construiește DataFrame doar cu coloanele necesare
df_new = pd.DataFrame(raw)[["userId", "exerciseId"]]

# 4) Încarcă CSV-ul vechi (sau creează-l gol)
if os.path.exists(CSV_PATH):
    df_old = pd.read_csv(CSV_PATH, dtype={"userId": str, "exerciseId": int})
else:
    df_old = pd.DataFrame(columns=["userId", "exerciseId"])

# 5) Îmbină și elimină duplicatele
df = pd.concat([df_old, df_new], ignore_index=True)
df = df.drop_duplicates(subset=["userId", "exerciseId"])
df = df.sort_values(["userId", "exerciseId"]).reset_index(drop=True)

# 6) Scrie înapoi CSV-ul
os.makedirs(os.path.dirname(CSV_PATH), exist_ok=True)
df.to_csv(CSV_PATH, index=False)

print(f" Sincronizare completă: {len(df_new)} intrări adăugate, total {len(df)} rânduri în {CSV_PATH}")
