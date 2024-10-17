# Use the official Node.js image as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --force

# Copy project files
COPY . .

# Build the Angular application
RUN npm run build --prod

# Expose the port that the Angular app runs on
EXPOSE 4200

# Start the Angular application
CMD ["npx", "ng", "serve", "--host", "0.0.0.0"]
