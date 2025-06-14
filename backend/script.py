import psycopg2

# Conexiune la baza ta de date
conn = psycopg2.connect(
 
    dbname="mentalhealth",
    user="postgres",
    password="parola",  # înlocuiește cu parola reală
    host="localhost",
    port="5432"  # portul implicit pentru PostgreSQL
)
cur = conn.cursor()

# Citește fișierul .sql
with open("mentalhealth_pg.sql", "r", encoding="utf-8") as f:
    for line in f:
        if line.strip().startswith("INSERT INTO"):
            try:
                cur.execute(line)
            except Exception as e:
                print("Eroare:", e)
                print("Comanda ratată:", line)

conn.commit()
cur.close()
conn.close()
print("Import finalizat.")
