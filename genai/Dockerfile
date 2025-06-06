# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the application source code into the container
COPY ./src /app/src

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application using uvicorn
# It will look for the `app` object in the file `src/main.py`
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]