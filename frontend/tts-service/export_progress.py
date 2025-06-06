import os
import pandas as pd

# 1. Încarcă TSV-ul brut
df = pd.read_csv(
    "raw_progress.tsv",
    sep="\t",
    header=None,
    names=["id", "exerciseId", "userId", "date"],
    dtype={"exerciseId": "float", "userId": "string"},
    na_values=["NULL", ""]
)

# 2. Elimină rândurile incomplete
df = df.dropna(subset=["exerciseId", "userId"])

# 3. Păstrează doar userId și exerciseId
df = df[["userId", "exerciseId"]].astype({"exerciseId": "int"})

# 4. Scrie CSV-ul final
os.makedirs("data", exist_ok=True)
df.to_csv("data/progress.csv", index=False)

print(f"Am exportat {len(df)} rânduri în data/progress.csv")
