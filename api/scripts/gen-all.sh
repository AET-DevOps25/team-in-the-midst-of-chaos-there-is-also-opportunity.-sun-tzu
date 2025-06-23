#!/usr/bin/env bash
set -euo pipefail

echo "Running OpenAPI code generation for all services..."

# 1. Generate Java server stubs (interfaces and models) for Spring Boot microservices
# This assumes openApiGenerate task is configured in each service's build.gradle
echo "Generating Java code for Spring Boot microservices..."
# This command will trigger the openApiGenerate task in each specified Gradle module.
# Ensure you are running this from the project root where 'gradlew' is located.
./gradlew :AnnouncementService:openApiGenerate \
          :PlaylistService:openApiGenerate \
          :StreamService:openApiGenerate

# 2. Generate Python Pydantic models/client for GenAI service
echo "Generating Python code for GenAI service..."
# This uses 'openapi-python-client' to generate models based on your spec.
# The output directory 'genai/generated_api' will be created if it doesn't exist.
# Make sure 'openapi-python-client' is installed (e.g., via pip install openapi-python-client).
openapi-python-client generate --path api/openapi.yaml --output genai/generated_api

# 3. Generate TypeScript types for Angular client
echo "Generating TypeScript types for Angular client..."
# This uses 'openapi-typescript' to generate type definitions from your spec.
# Make sure 'openapi-typescript' is installed (e.g., via npm install -D openapi-typescript).
npx openapi-typescript api/openapi.yaml --output client/src/app/api.d.ts

echo "All OpenAPI code generation tasks completed."