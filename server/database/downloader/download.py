import os
import requests
from bs4 import BeautifulSoup
import urllib.parse

# Output locations
AUDIO_DIR = "/audio"
DATA_SQL = "/docker-entrypoint-initdb.d/02-data.sql"
# Download parameter
BASE_URL = os.getenv('BASIC_AUTH_URL')
user = os.getenv('BASIC_AUTH_USER')
password = os.getenv('BASIC_AUTH_PASS')
AUTH = requests.auth.HTTPBasicAuth(user, password)
NUM_SONGS = 10

os.makedirs(AUDIO_DIR, exist_ok=True)

metadata_entries = [
    "(0, 'announcement', '', '', '', '')",
    "(1, 'song', 'Rolling in the Deep', 'Adele', '2010-11-29', 'Soul/Pop')",
    "(2, 'song', 'Mr. Saxobeat', 'Alexandra Stan', '2011-08-29', 'Dance-pop')",
    "(3, 'song', 'Nur In Meinem Kopf (Radio Edit)', 'Andreas Bourani', '2011-06-10', 'Pop')",
    "(4, 'song', 'Geronimo', 'Aura Dione', '2011-05-09', 'Pop')",
    "(5, 'song', 'Levels', 'Avicii', '2011-10-28', 'Progressive house')",
    "(6, 'song', 'Way Back Home', 'Bag Raiders', '2010-05-01', 'Electronic')",
    "(7, 'song', 'Grenade', 'Bruno Mars', '2010-09-28', 'Pop')",
    "(8, 'song', 'A Night Like This', 'Caro Emerald', '2010-03-15', 'Jazz/Pop')",
    "(9, 'song', 'Yeah 3x', 'Chris Brown', '2010-10-25', 'Dance-pop')",
    "(10, 'song', 'Coming Home (Album Version) (feat. Skylar Grey)', 'Diddy - Dirty Money', '2010-12-21', 'Hip hop/R&B')",
    "(11, 'song', 'Welcome To St. Tropez', 'DJ Antoine vs. Timati feat. Kalenna', '2011-07-01', 'Dance')",
    "(12, 'song', 'Changed The Way You Kiss Me', 'Example', '2011-05-22', 'Electro house')",
    "(13, 'song', 'Pumped Up Kicks', 'Foster The People', '2010-09-14', 'Indie pop')",
    "(14, 'song', 'Echt', 'Glasperlenspiel', '2011-05-13', 'Pop')",
    "(15, 'song', 'Stay', 'Hurts', '2010-06-14', 'Synthpop')",
    "(16, 'song', 'Over The Rainbow', 'Israel Kamakawiwo''ole', '1993-07-21', 'Hawaiian')",
    "(17, 'song', 'I Won´t Let You Go', 'James Morrison', '2011-06-27', 'Pop rock')",
    "(18, 'song', 'On The Floor', 'Jennifer Lopez Feat. Pitbull', '2011-02-08', 'Dance-pop')",
    "(19, 'song', 'Price Tag (Album Version) (feat. B.O.B.)', 'Jessie J', '2011-01-25', 'Pop')",
    "(20, 'song', 'Still', 'Jupiter Jones', '2011-10-14', 'Pop rock')",
    "(21, 'song', 'E.T.', 'Katy Perry', '2011-02-16', 'Electropop')",
    "(22, 'song', 'Mr. Know It All', 'Kelly Clarkson', '2011-09-22', 'Pop')",
    "(23, 'song', 'Born This Way', 'Lady Gaga', '2011-02-11', 'Pop')",
    "(24, 'song', 'Video Games (Radio Edit)', 'Lana Del Rey', '2011-10-10', 'Baroque pop')",
    "(25, 'song', 'Taken By A Stranger', 'Lena', '2010-03-12', 'Pop')",
    "(26, 'song', 'Party Rock Anthem', 'LMFAO Feat. Lauren Bennett & GoonRock', '2011-01-25', 'Electro house')",
    "(27, 'song', 'Hungry Eyes', 'Loona', '2002-08-12', 'Dance-pop')",
    "(28, 'song', 'Danza Kuduro', 'Lucenzo Feat. Don Omar', '2010-07-06', 'Reggaeton')",
    "(29, 'song', 'New Age', 'Marlon Roudette', '2011-06-24', 'Pop')",
    "(30, 'song', 'Moves Like Jagger', 'Maroon 5 Feat. Christina Aguilera', '2011-06-21', 'Pop rock')",
    "(31, 'song', 'You And Me (In My Pocket)', 'Milow', '2010-02-15', 'Acoustic pop')",
    "(32, 'song', 'Mirrors', 'Natalia Kills', '2010-08-02', 'Electropop')",
    "(33, 'song', 'When We Stand Together', 'Nickelback', '2011-09-26', 'Rock')",
    "(34, 'song', 'Call My Name', 'Pietro Lombardi', '2011-05-06', 'Pop')",
    "(35, 'song', 'Give Me Everything', 'Pitbull Feat. Ne-Yo, Afrojack & Nayer', '2011-03-18', 'Dance-pop')",
    "(36, 'song', 'Molotov', 'R.I.O.', '2011-06-01', 'Dance')",
    "(37, 'song', 'We Found Love', 'Rihanna Feat. Calvin Harris', '2011-09-22', 'Electropop')",
    "(38, 'song', 'Loca People (What The Fxxk!)', 'Sak Noel', '2011-04-11', 'Dance')",
    "(39, 'song', 'Sweat', 'Snoop Dogg vs. David Guetta', '2011-05-03', 'Dance')",
    "(40, 'song', 'Hollywood Hills', 'Sunrise Avenue', '2011-10-28', 'Pop rock')",
    "(41, 'song', 'Hangover', 'Taio Cruz Feat. Flo Rida', '2011-10-04', 'Electropop')",
    "(42, 'song', 'The Time (Dirty Bit)', 'The Black Eyed Peas', '2010-11-09', 'Dance-pop')",
    "(43, 'song', 'Nur Noch Kurz Die Welt Retten', 'Tim Bendzko', '2011-07-15', 'Pop')",
    "(44, 'song', 'More', 'Usher', '2010-02-23', 'R&B')",
    "(45, 'song', 'Too Close', 'Alex Clare', '2011-04-15', 'R&B/dubstep/alternative pop')",
    "(46, 'song', 'One Day / Reckoning Song (Wankelmut Remix)', 'Asaf Avidan', '2012-06-01', 'Electronic/house')",
    "(47, 'song', 'Friends', 'Aura Dione', '2012-01-23', 'Pop')",
    "(48, 'song', 'Levels', 'Avicii', '2011-10-28', 'Progressive house')",
    "(49, 'song', 'Forgive Forget', 'Caligola', '2015-01-09', 'Pop')",
    "(50, 'song', 'Call Me Maybe', 'Carly Rae Jepsen', '2011-09-20', 'Dance-pop')",
    "(51, 'song', 'Jar of Hearts', 'Christina Perri', '2010-06-22', 'Pop')",
    "(52, 'song', 'Easy', 'Cro', '2011-03-04', 'German rap/pop')",
    "(53, 'song', 'Von allein', 'Culcha Candela', '2011-08-26', 'German hip hop/pop')",
    "(54, 'song', 'Tage wie diese', 'Die Toten Hosen', '2012-01-13', 'German rock')",
    "(55, 'song', 'Ma Cherie', 'DJ Antoine', '2011-05-20', 'Electro house')",
    "(56, 'song', 'Whistle', 'Flo Rida', '2012-04-24', 'Pop/hip hop')",
    "(57, 'song', 'We Are Young', 'Fun ft. Janelle Monáe', '2011-09-20', 'Alternative rock')",
    "(58, 'song', 'Somebody That I Used to Know', 'Gotye ft. Kimbra', '2011-07-05', 'Indie pop')",
    "(59, 'song', 'Balada (Tchê Tcherere Tchê Tchê)', 'Gusttavo Lima', '2011-11-05', 'Sertanejo')",
    "(60, 'song', 'Do You Like What You See', 'Ivy Quainoo', '2012-02-03', 'Soul/Pop')",
    "(61, 'song', 'Breathing', 'Jason Derulo', '2011-09-27', 'Electropop')",
    "(62, 'song', 'Sonnentanz', 'Klangkarussell', '2012-06-25', 'Deep house')",
    "(63, 'song', 'Video Games', 'Lana Del Rey', '2011-10-10', 'Baroque pop')",
    "(64, 'song', 'Stardust', 'Lena', '2012-09-21', 'Pop')",
    "(65, 'song', 'Euphoria', 'Loreen', '2012-02-26', 'Dance-pop')",
    "(66, 'song', 'Don''t Think About Me', 'Luca Hänni', '2012-04-28', 'Pop')",
    "(67, 'song', 'I Follow Rivers (The Magician Remix)', 'Lykke Li', '2011-10-14', 'Indie pop/Electronic')",
    "(68, 'song', 'I Follow Rivers', 'Lykke Li', '2011-01-21', 'Indie pop')",
    "(69, 'song', 'Girl Gone Wild', 'Madonna', '2012-03-02', 'Electropop')",
    "(70, 'song', 'Anti Hero (Brave New World)', 'Marlon Roudette', '2012-08-17', 'Pop')",
    "(71, 'song', 'Payphone', 'Maroon 5 ft. Wiz Khalifa', '2012-04-16', 'Pop rock')",
    "(72, 'song', 'Wolke 7', 'Max Herre ft. Philipp Poisel', '2012-08-17', 'German hip hop/Soul')",
    "(73, 'song', 'Ai Se Eu Te Pego (Nossa, Nossa)', 'Michel Teló', '2011-07-01', 'Sertanejo/Pop')",
    "(74, 'song', '2012 (If The World Would End)', 'Mike Candys', '2012-04-01', 'Dance/Electronic')",
    "(75, 'song', 'Endless Summer', 'Oceana', '2012-05-04', 'Dance-pop')",
    "(76, 'song', 'Little Talks', 'Of Monsters and Men', '2011-12-20', 'Indie folk')",
    "(77, 'song', 'Heart Skips a Beat', 'Olly Murs ft. Rizzle Kicks', '2011-08-19', 'Pop')",
    "(78, 'song', 'Gangnam Style', 'PSY', '2012-07-15', 'K-pop')",
    "(79, 'song', 'Absolutely Right', 'Right Said Fred', '2011-05-06', 'Pop rock')",
    "(80, 'song', 'Where Have You Been', 'Rihanna', '2012-05-08', 'Electro house/Pop')",
    "(81, 'song', 'Candy', 'Robbie Williams', '2012-10-29', 'Pop')",
    "(82, 'song', 'Standing Still', 'Roman Lob', '2012-02-16', 'Pop rock')",
    "(83, 'song', 'She Doesn''t Mind', 'Sean Paul', '2011-09-29', 'Dancehall/Pop')",
    "(84, 'song', 'Tacata', 'Tacabro', '2011-03-20', 'Dance')",
    "(85, 'song', 'Hangover', 'Taio Cruz ft. Flo Rida', '2011-10-04', 'Electropop')",
    "(86, 'song', 'Drive By', 'Train', '2012-01-10', 'Pop rock')",
    "(87, 'song', 'So wie Du warst', 'Unheilig', '2012-03-16', 'German rock')",
    "(88, 'song', 'Schau nicht mehr zurück', 'Xavas', '2012-09-21', 'German hip hop/Soul')"    
][:NUM_SONGS]


def get_all_hrefs(url):
    response = requests.get(url, auth=AUTH)
    soup = BeautifulSoup(response.text, 'html.parser')
    ul = soup.find('ul')
    links = ul.find_all('a')
    return [link.get('href') for link in links if link.get('href')]

def fetch_mp3_urls(url = BASE_URL):
    # get collections
    collections = list(map(lambda s: url + s, get_all_hrefs(url)))
    # get mp3 urls per collection
    mp3_urls = []
    for collection in collections:
        songs = list(map(lambda s: collection + s, get_all_hrefs(collection)))
        mp3_urls = mp3_urls + songs
    
    return mp3_urls

def download_file(url, dest_dir):
    filename = urllib.parse.unquote(url.split('/')[-1]).replace("'", "''")

    path = os.path.join(dest_dir, filename)
    r = requests.get(url, stream=True, auth=AUTH)
    if r.status_code == 200:
        with open(path, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return filename
    print(f"Error during download: {url}")
    return None

def main():
    urls = fetch_mp3_urls()
    existing_files = set(os.listdir(AUDIO_DIR))
    audio_entries = ["('0', 'greeting_announcement.mp3')"]
    song_id = 1
    
    for url in urls[:NUM_SONGS]:
        try:
            filename = urllib.parse.unquote(url.split('/')[-1]).replace("'", "''")
            if filename in existing_files:
                print(f"Skipping \"{filename}\" (already present)", flush=True)
                continue            
            # download song
            download_file(url, AUDIO_DIR)
            audio_entries.append(f"({song_id}, '{filename}')")
            song_id += 1
            print(f"Finished download \"{filename}\"", flush=True)
        except Exception as e:
            print(f"Error processing {url}: {e}")

    print("Finished all downloads")

    # Write data
    with open(DATA_SQL, "w") as f:
        if audio_entries:
            f.write("INSERT INTO audio_files (id, filename)\nVALUES\n")
            f.write(",\n".join(audio_entries) + ";\n\n")
        if metadata_entries:
            f.write("INSERT IGNORE INTO meta_data (id, type, title, artist, release_date, genre)\nVALUES\n")
            f.write(",\n".join(metadata_entries) + ";\n")

if __name__ == "__main__":
    main()