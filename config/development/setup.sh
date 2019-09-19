#!/bin/bash

MODE="development"

# set environmental variables
. ./config/shared/app.env
. ./config/$MODE/db.env

# pull and create docker images
# run docker containers
# setup database
. ./config/shared/setup.sh
