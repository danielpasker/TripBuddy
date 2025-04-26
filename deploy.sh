#!/bin/bash

START_DIR=$(pwd)
git pull

cd TripBuddy-Client
npm i
npm run prod

cd ../TripBuddy-Server 
npm i
npm run prod

cd "$START_DIR"