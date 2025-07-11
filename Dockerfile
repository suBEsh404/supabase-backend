# Use Node.js LTS version
FROM node:18

# Create app directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app
COPY . .

# Expose your backend port
EXPOSE 5000

# Start the app
CMD ["node", "index.js"]


