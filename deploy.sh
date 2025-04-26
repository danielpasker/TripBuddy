#!/bin/bash

START_DIR=$(pwd)
echo "pulling from git"
git pull

cd TripBuddy-Client
echo "installing client dependencies..."
npm i
echo "building client..."
npm run prod

cd ../TripBuddy-Server 
echo "installing server dependencies..."
npm i
echo "building server..."
npm run prod

cd "$START_DIR"