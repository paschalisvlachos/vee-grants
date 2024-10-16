# Stage 1: Build the NestJS application
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Test (optional) - Run e2e tests
FROM builder AS tester

# Install development dependencies for testing
RUN npm install --only=development

# Copy test-specific files, if any
COPY ./test ./test

# Run the e2e tests
RUN npm run test:e2e

# Stage 3: Run the NestJS application
FROM node:18-alpine

WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Expose the port your NestJS app runs on (default: 3000)
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start:prod"]


