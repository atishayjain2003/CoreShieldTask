# Use Python as base image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Copy all files into the container
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port Django runs on
EXPOSE 8000

# Run the Django server
CMD ["python", "mapping/manage.py", "runserver", "0.0.0.0:8000"]
