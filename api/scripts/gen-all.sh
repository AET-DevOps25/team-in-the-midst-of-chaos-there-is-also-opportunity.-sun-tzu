#!/usr/bin/env bash
set -euo pipefail

echo "Running OpenAPI code generation for all services..."

# 1. Generate Java server stubs (interfaces and models) for Spring Boot microservices
echo "Generating Java code for Spring Boot microservices..."
server/gradlew -p server :AnnouncementService:openApiGenerate \
                           :PlaylistService:openApiGenerate \
                           :StreamService:openApiGenerate

# 2. Generate Python Pydantic models/client for GenAI service
echo "Skipping Generating Python code for GenAI service..."
#openapi-python-client generate --path api/openapi.yaml --output genai/generated_api

# 3. Generate TypeScript types for Angular client
echo "Skipping Generating TypeScript types for Angular client..."
#npx openapi-typescript api/openapi.yaml --output client/src/app/api.d.ts

echo "All OpenAPI code generation tasks completed."