#!/bin/bash

MODE="development"

. ./config/$MODE/init.env

export NODE_ENV=$NODE_ENV
export APP_TITLE=$APP_TITLE
export PORT=$PORT
export DB_PATH=$DB_PATH
export DB_NAME=$DB_NAME
export USER_NAME=$USER_NAME
export USER_PASSWORD=$USER_PASSWORD

# Reset
RESET='\033[0m'           # Text Reset

# Regular Colors
BLACK='\033[0;30m'        # Black
RED='\033[0;31m'          # Red
GREEN='\033[0;32m'        # Green
YELLOW='\033[0;33m'       # Yellow
BLUE='\033[0;34m'         # Blue
PURPLE='\033[0;35m'       # Purple
CYAN='\033[0;36m'         # Cyan
WHITE='\033[0;37m'        # White

echo -e "${GREEN}APP:${YELLOW} ${APP_TITLE} \n${GREEN}MODE:${YELLOW} ${NODE_ENV}${RESET}"
