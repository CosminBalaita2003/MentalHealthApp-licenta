import re
import json

input_file = "script.sql"
output_file = "fixed.sql"

# Expresie regulată care capturează valoarea StepsJson
steps_pattern = re.compile(r'VALUES\s*\(([^;]*?)(".*?StepsJson.*?")\s*=\s*\'(.*?)\'', re.DOTALL)
insert_pattern = re.compile(r'(INSERT INTO "Exercises".*?VALUES\s*\(.*?\);)', re.DOTALL)

def fix_steps_json(line):
    if not line.strip().startswith("INSERT INTO"):
        return line

    try:
        # Extrage toți parametrii din VALUES
        before_values, values_part = line.split("VALUES", 1)
        open_paren = values_part.index("(")
        close_paren = values_part.rindex(")")
        values = values_part[open_paren + 1:close_paren]

        # Sparge valorile individuale (atenție la virgulele din câmpuri text)
        parts = []
        current = ""
        inside_quote = False
        for c in values:
            if c == "'" and not inside_quote:
                inside_quote = True
                current += c
            elif c == "'" and inside_quote:
                inside_quote = False
                current += c
            elif c == "," and not inside_quote:
                parts.append(current.strip())
                current = ""
            else:
                current += c
        parts.append(current.strip())  # ultima

        # StepsJson e ultimul câmp — îl reparăm
        steps_raw = parts[-1]
        if steps_raw.startswith("''") or steps_raw == "NULL":
            return line  # nimic de schimbat

        # Eliminăm ghilimelele externe și transformăm în listă JSON
        steps_content = steps_raw.strip("'").strip('"')
        step_list = [s.strip().strip('"') for s in steps_content.split(",")]
        json_steps = json.dumps(step_list)

        parts[-1] = f"'{json_steps}'"

        # Reconstruim linia
        new_values = ", ".join(parts)
        return f"{before_values}VALUES ({new_values});\n"

    except Exception as e:
        print(f"⚠️  Eroare la linie:\n{line}\n{e}")
        return line

with open(input_file, "r", encoding="utf-16") as infile, open(output_file, "w", encoding="utf-8") as outfile:
    for line in infile:
        if line.startswith("INSERT INTO \"Exercises\""):
            fixed = fix_steps_json(line)
            outfile.write(fixed)
        else:
            outfile.write(line)

print(f"✅ Fișierul reparat a fost salvat ca: {output_file}")
