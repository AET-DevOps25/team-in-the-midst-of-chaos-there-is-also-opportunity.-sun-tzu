#!/usr/bin/env bash
set -euo pipefail

echo "Running OpenAPI code generation for all services..."

# 1. Generate Java server stubs (interfaces and models) for Spring Boot microservices
echo "Generating Java code for Spring Boot microservices..."
# Use -p server to tell gradlew that the Gradle project root is in the 'server' directory.
server/gradlew -p server :AnnouncementService:openApiGenerate \
                               :PlaylistService:openApiGenerate \
                               :StreamService:openApiGenerate

# 2. Generate Python Pydantic models/client for GenAI service
#echo "Generating Python code for GenAI service..."
# Assuming openapi-python-client is installed globally or in a local venv managed by CI
# Ensure genai/generated_api directory exists or is handled by the tool
# Path to api/openapi.yaml remains relative to the script's execution location (project root)
#openapi-python-client generate --path api/openapi.yaml --output genai/generated_api

# 3. Generate TypeScript types for Angular client
echo "Generating TypeScript types for Angular client..."
# Assuming npx is available and openapi-typescript is installed as a dev dependency in client/package.json
# Path to api/openapi.yaml remains relative to the script's execution location (project root)
npx openapi-typescript api/openapi.yaml --output client/src/app/api.d.ts

echo "All OpenAPI code generation tasks completed."