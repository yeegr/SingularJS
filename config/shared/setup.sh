# get base docker images
docker pull mongo:latest
docker pull nginx:latest
docker pull node:10.16.3

# build mongodb docker image from dockerfile
docker build - < ./config/${NODE_ENV}/mongo.dockerfile -t ${APP_TITLE}/mongo

# run mongodb image
docker run -d --expose ${DB_PORT} --name ${APP_TITLE}-db -v ${LOCAL_PATH}:${DB_PATH} ${APP_TITLE}/mongo

# wait
sleep 10s

# add mongodb user for database
docker exec -it ${APP_TITLE}-db mongo ${DB_NAME} --eval 'db.createUser({user: "'${USER_NAME}'", pwd: "'${USER_PASSWORD}'", roles: [{role: "readWrite", db: "'${DB_NAME}'"}]})'

# remove running docker process
docker rm -f ${APP_TITLE}-db

# pulls node image
docker pull node:10.16.3
