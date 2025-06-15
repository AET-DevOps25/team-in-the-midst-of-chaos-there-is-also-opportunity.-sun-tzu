CREATE TABLE IF NOT EXISTS audio_files (
  id INT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS meta_data (
  id INT PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  artist VARCHAR(255),
  release_date VARCHAR(255),
  genre VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS playlists (
  session INT PRIMARY KEY,
  head INT NULL,
  tail INT
);

CREATE TABLE IF NOT EXISTS playlist_q (
  session INT,
  audio_id INT,
  queue_pos INT,
  PRIMARY KEY (session, queue_pos)
);
