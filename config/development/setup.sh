#!/bin/bash

MODE="development"

# set environmental variables
. ./config/$MODE/init.env

# pull and create docker images
# run docker containers
# setup database
. ./config/common/setup.sh
