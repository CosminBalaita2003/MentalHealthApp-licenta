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
    returnează o listă de (exercise_id, score) de dimensiune k
    user_id: UUID-ul utilizatorului, ca string
    k: numărul de recomandări
    """
    if user_id not in user_index_map:
        raise KeyError(f"User '{user_id}' nu există în mapping-ul nostru.")

    # 1) găsește indexul în matrice
    uidx = user_index_map[user_id]

    # 2) extrage vectorul şi rulează predict
    user_vector = user_item_matrix[uidx].reshape(1, -1)
    scores = model.predict(user_vector, verbose=0)[0]

    # 3) masca pentru exerciții noi (unde nu e progres salvat)
    unseen = user_item_matrix[uidx] == 0
    candidates = [(item_ids[i], float(scores[i])) for i in np.where(unseen)[0]]

    # 4) sortează după score descrescător şi returnează primele k
    candidates.sort(key=lambda x: x[1], reverse=True)
    return candidates[:k]
