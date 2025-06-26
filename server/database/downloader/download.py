import os
import requests
from datetime import datetime

# Output locations
AUDIO_DIR = "/audio"
DATA_SQL = "/docker-entrypoint-initdb.d/02-data.sql"

os.makedirs(AUDIO_DIR, exist_ok=True)

ARCHIVE_API_URL = "https://archive.org/advancedsearch.php"
MAX_ITEMS = 2

def fetch_items():
    params = {
        "q": "subject:classical AND mediatype:audio",
        "fl[]": "identifier,title,creator,date",
        "rows": MAX_ITEMS,
        "output": "json"
    }
    r = requests.get(ARCHIVE_API_URL, params=params)
    r.raise_for_status()
    return r.json()['response']['docs']

def get_mp3_links(identifier):
    url = f"https://archive.org/metadata/{identifier}"
    r = requests.get(url)
    r.raise_for_status()
    files = r.json().get('files', [])
    return [f"https://archive.org/download/{identifier}/{f['name']}" for f in files if f['name'].endswith(".mp3")]

def download_file(url, dest_dir):
    filename = url.split('/')[-1]
    path = os.path.join(dest_dir, filename)
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        with open(path, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return filename
    return None

def format_date(archive_date):
    try:
        return datetime.strptime(archive_date, "%Y-%m-%d").strftime("%d-%m-%Y")
    except:
        return "01-01-1900"

def main():
    items = fetch_items()
    existing_files = set(os.listdir(AUDIO_DIR))
    audio_entries = []
    metadata_entries = []

    song_id = 1
    for item in items:
        identifier = item['identifier']
        title = item.get('title', f"Title {song_id}")
        artist = item.get('creator', "Unknown Artist")
        release_date = format_date(item.get('date', '1900-01-01'))
        genre = "Classical"

        try:
            urls = get_mp3_links(identifier)
            for url in urls:
                filename = url.split('/')[-1]
                if filename in existing_files:
                    print(f"Skipping download for file \"{filename}\"", flush=True)
                    continue

                filename = download_file(url, AUDIO_DIR)
                if not filename:
                    continue
                audio_entries.append(f"('{song_id}', '{filename}')")
                metadata_entries.append(f"('{song_id}', 'song', '{title}', '{artist}', '{release_date}', '{genre}')")
                song_id += 1
                print(f"Downloaded file \"{filename}\"", flush=True)
        except Exception as e:
            print(f"Error processing {identifier}: {e}")

    # Write data
    with open(DATA_SQL, "w") as f:
        if audio_entries:
            f.write("INSERT INTO audio_files (id, filename)\nVALUES\n")
            f.write(",\n".join(audio_entries) + ";\n\n")
        if metadata_entries:
            f.write("INSERT INTO meta_data (id, type, title, artist, release_date, genre)\nVALUES\n")
            f.write(",\n".join(metadata_entries) + ";\n")

if __name__ == "__main__":
    main()
