# Use the official Playwright image
#FROM mcr.microsoft.com/playwright:v1.49.1-noble
FROM mcr.microsoft.com/playwright:v1.47.2-noble

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy the entire project into the container
COPY . .

# Expose a port for debugging, if needed (e.g., for connecting to the browser)
EXPOSE 9222
