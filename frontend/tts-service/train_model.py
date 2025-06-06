#!/usr/bin/env python3
# train_recommender.py

import os
import numpy as np
import pandas as pd
from tensorflow import keras
from tensorflow.keras import layers

# ——— CONFIGURARE ———
DATA_PATH    = "data/progress.csv"   # CSV cu coloane: userId,exerciseId
MODELS_DIR   = "models"
EPOCHS       = 20
BATCH_SIZE   = 32
LATENT_DIM   = 50   # dimensiunea stratului ascuns

# 1) Încarcă datele de progres
df = pd.read_csv(DATA_PATH)  
# Asigură-te că 'userId' și 'exerciseId' sunt int-uri

df['exerciseId'] = df['exerciseId'].astype(int)

# 2) Creează mapările user↔index și item↔index
user_ids = df['userId'].unique()
item_ids = df['exerciseId'].unique()

user_index_map = {uid: idx for idx, uid in enumerate(user_ids)}
item_index_map = {iid: idx for idx, iid in enumerate(item_ids)}

num_users = len(user_ids)
num_items = len(item_ids)

print(f"Users: {num_users}, Items: {num_items}")

# 3) Construiește matricea user×item
matrix = np.zeros((num_users, num_items), dtype=np.float32)
for _, row in df.iterrows():
    u = user_index_map[row['userId']]
    i = item_index_map[row['exerciseId']]
    matrix[u, i] = 1.0

# 4) Definește modelul autoencoder
inputs  = keras.Input(shape=(num_items,))
x       = layers.Dense(LATENT_DIM,    activation='relu')(inputs)
x       = layers.Dense(LATENT_DIM//2, activation='relu')(x)
x       = layers.Dense(LATENT_DIM,    activation='relu')(x)
outputs = layers.Dense(num_items,     activation='sigmoid')(x)

autoencoder = keras.Model(inputs, outputs)
autoencoder.compile(optimizer='adam', loss='binary_crossentropy')
autoencoder.summary()

# 5) Antrenează modelul
autoencoder.fit(
    matrix, matrix,
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    validation_split=0.1,
    shuffle=True
)

# 6) Salvează modelul și artefactele
os.makedirs(MODELS_DIR, exist_ok=True)
model_path = os.path.join(MODELS_DIR, "recommender_model.h5")
autoencoder.save(model_path)
print(f"Model salvat în {model_path}")

# Salvează matricea și mapările pentru inferență
np.save(os.path.join(MODELS_DIR, "user_item_matrix.npy"), matrix)
np.save(os.path.join(MODELS_DIR, "item_ids.npy"), item_ids)
np.save(os.path.join(MODELS_DIR, "user_index_map.npy"), user_index_map)

print("Artefacte salvate în folderul 'models'")
