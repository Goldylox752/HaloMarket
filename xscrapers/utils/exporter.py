import json
import os


def save_json(data, filename):

    os.makedirs("data", exist_ok=True)

    path = f"data/{filename}"

    with open(
        path,
        "w",
        encoding="utf-8"
    ) as file:

        json.dump(
            data,
            file,
            indent=4,
            ensure_ascii=False
        )

    print(f"Saved: {path}")
