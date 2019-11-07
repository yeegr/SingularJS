#!/bin/bash

MODE="development"

. ./config/_shared/app.env
. ./config/$MODE/db.env
. ./config/$MODE/api.env

export NODE_ENV=$NODE_ENV
export APP_TITLE=$APP_TITLE
export MAINTAINER=$MAINTAINER
export EMAIL=$EMAIL

export DB_NAME=$DB_NAME
export LOCAL_PATH=$LOCAL_PATH
export DB_PATH=$DB_PATH
export DB_PORT=$DB_PORT
export USER_NAME=$USER_NAME
export USER_PASSWORD=$USER_PASSWORD

export API_PORT=$API_PORT
export CONSUMER_WEBAPP_PORT="8080"

. ./config/_shared/colors.sh
. ./config/_shared/timestamp.sh
echo "${GREEN}APP: ${YELLOW}${APP_TITLE}"
echo "${GREEN}MODE: ${YELLOW}${NODE_ENV}${RESET}"
