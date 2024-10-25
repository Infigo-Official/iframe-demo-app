# Use Node.js as the base image
FROM node:14

# Set working directory for the backend
WORKDIR /app

# Copy both backend and frontend package.json files for dependencies
COPY backend/ ./backend/
COPY ui/ ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Install frontend dependencies and build Vue.js for production
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Move the built Vue.js files to the backend's public folder
RUN mkdir -p /app/backend/public && cp -r dist/* /app/backend/public

# Set the working directory back to the backend
WORKDIR /app/backend

# Copy backend source code
COPY backend/ .

# Expose the port on which your Node.js app will run
EXPOSE 3000

# Start the Node.js app
CMD ["node", "server.js"]
