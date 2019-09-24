#!/bin/bash

echo "" > $(docker inspect -f={{.LogPath}} $APP_TITLE-$1)
