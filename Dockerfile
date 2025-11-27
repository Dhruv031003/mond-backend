# Use Node.js 20 base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy only package files first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy the rest of the source code
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
