#!/bin/bash

# Start Nginx
#service nginx start

# Start the Node.js server
node /usr/src/app/server.js &  # Adjust the path to your Node.js entry file

# Wait for all background processes to finish
wait
