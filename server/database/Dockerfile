FROM mysql:8

# Copy SQL initialization
COPY 01-schema.sql /docker-entrypoint-initdb.d/
COPY 02-data.sql /docker-entrypoint-initdb.d/

# Copy audio files to shared volume
COPY audio/ /audio/
CMD ["sh", "-c", "cp -r /audio/* /shared/ && exec docker-entrypoint.sh mysqld"]
