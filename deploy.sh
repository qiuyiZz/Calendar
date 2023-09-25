#!/bin/bash

cd /server

# Pull the latest code from GitHub
git pull origin main

# Install or update dependencies
npm install

# Restart the app
pm2 restart server.js
