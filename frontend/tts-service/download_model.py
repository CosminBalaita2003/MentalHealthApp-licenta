from transformers import AutoModelForSequenceClassification, AutoTokenizer

model_name = "j-hartmann/emotion-english-distilroberta-base"
save_path = "./models/emotion-model"

# Descarcă modelul
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Salvează local
model.save_pretrained(save_path)
tokenizer.save_pretrained(save_path)

print(f"✅ Model saved locally to: {save_path}")
