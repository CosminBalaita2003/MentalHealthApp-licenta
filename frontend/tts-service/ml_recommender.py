# ml_recommender.py
import os
import numpy as np
from tensorflow import keras

# —————————————————————————————
# Încarcă modelul şi artefactele pentru recomandări
# —————————————————————————————

# Calea către acest fișier
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Modelul auto-encoder salvat de train_model.py
MODEL_PATH = os.path.join(BASE_DIR, "models", "recommender_model.h5")
model = keras.models.load_model(MODEL_PATH)

# Matricea user×item şi listele de id-uri
user_item_matrix = np.load(os.path.join(BASE_DIR, "models", "user_item_matrix.npy"))
item_ids          = np.load(os.path.join(BASE_DIR, "models", "item_ids.npy"))
user_index_map    = np.load(os.path.join(BASE_DIR, "models", "user_index_map.npy"),
                           allow_pickle=True).item()

# —————————————————————————————
# Funcţia principală de recomandare
# —————————————————————————————
def recommend_for_user(user_id, k=1):
    """
    Returnează o listă de (exercise_id, score) de dimensiune k.
    Dacă user_id nu este în index, returnează cele mai populare exerciții (fallback).
    """
    if user_id not in user_index_map:
        print(f"[INFO] User '{user_id}' nu are date în progres. Returnăm fallback.")
        return recommend_popular_exercises(k)

    # 1) Găsește indexul în matrice
    uidx = user_index_map[user_id]

    # 2) Extrage vectorul şi rulează predict
    user_vector = user_item_matrix[uidx].reshape(1, -1)
    scores = model.predict(user_vector, verbose=0)[0]

    # 3) Filtrează doar exercițiile nevizitate
    unseen = user_item_matrix[uidx] == 0
    candidates = [(item_ids[i], float(scores[i])) for i in np.where(unseen)[0]]

    # 4) Sortează și returnează
    candidates.sort(key=lambda x: x[1], reverse=True)
    return candidates[:k]



def recommend_popular_exercises(k):
    """
    Returnează primii k item_ids cei mai frecvenți în matrice.
    """
    popularity = np.sum(user_item_matrix, axis=0)
    top_indices = np.argsort(-popularity)[:k]
    return [(item_ids[i], float(popularity[i])) for i in top_indices]
