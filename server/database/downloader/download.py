import os
import requests
import random
import tempfile
from mutagen import File
import shutil

# Output locations
AUDIO_DIR = "/audio"
DATA_SQL = "/docker-entrypoint-initdb.d/02-data.sql"

os.makedirs(AUDIO_DIR, exist_ok=True)

ARCHIVE_API_URL = "https://archive.org/advancedsearch.php"
MAX_ITEMS = 20
MAX_DURATION_SECONDS = 6 * 60
PARTIAL_BYTES = 2 * 1024 * 1024

def fetch_items():
    params = {
        "q": "subject:(classical) AND mediatype:(audio)",
        "fl[]": "identifier,title,creator,year,genre",
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

def get_audio_duration(path):
    try:
        audio = File(path)
        return audio.info.length if audio and audio.info else None
    except Exception:
        return None

def download_file(url, dest_dir):
    filename = url.split('/')[-1]
    path = os.path.join(dest_dir, filename)

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp_path = tmp.name
        r = requests.get(url, stream=True)
        if r.status_code == 200:
            for chunk in r.iter_content(8192):
                tmp.write(chunk)
        else:
            return None

    # Check duration
    duration = get_audio_duration(tmp_path)
    if duration is not None and duration <= MAX_DURATION_SECONDS:
        shutil.move(tmp_path, path)
        return filename
    else:
        print("Removed download due to size")
        os.remove(tmp_path)
        return None

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
        if isinstance(artist, list):
            artist = artist[0]
        release_date = item.get('year', 'Unknown release year')
        genre = item.get('genre', 'Classical')
        if isinstance(genre, list):
            genre = random.sample(genre, 1)[0]
        print(str(item))
        try:
            urls = get_mp3_links(identifier)
            if len(urls) > 1:
                urls = random.sample(urls, 2) # take only two out of collection
            for url in urls:
                filename = url.split('/')[-1]
                if filename in existing_files:
                    print(f"Skipping \"{filename}\" (already present)", flush=True)
                    continue

                filename = download_file(url, AUDIO_DIR)
                if not filename:
                    continue
                audio_entries.append(f"('{song_id}', '{filename}')")
                metadata_entries.append(f"('{song_id}', 'song', '{title}', '{artist}', '{release_date}', '{genre}')")
                song_id += 1
                print(f"Downloaded \"{filename}\"", flush=True)
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
