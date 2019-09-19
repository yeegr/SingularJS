# Set mongo base image
FROM mongo:latest

# Mount the MongoDB data directory 
VOLUME ["/data/db"]
WORKDIR /data/db

# Set /usr/bin/mongod as the dockerized entry-point application
ENTRYPOINT ["/usr/bin/mongod", "--bind_ip_all"]
