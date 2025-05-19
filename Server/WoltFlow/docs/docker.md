# Docker Deployment

This document explains how to run WoltFlow in a Docker container for consistent and portable execution.

## Docker Setup

WoltFlow uses Docker to package the application with all its dependencies into a self-contained environment that can run consistently on any system.

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/install/) (typically bundled with Docker Desktop)
- Database credentials (PostgreSQL or local db.json file)

## Dockerfile Overview

The `Dockerfile` defines how the WoltFlow container is built:

```dockerfile
FROM python:3.9-slim

# Install dependencies for Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    xvfb \
    libglib2.0-0 \
    libnss3 \
    # ... other dependencies ... \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome for Linux
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Create working directory and install Python packages
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create directories with proper permissions
RUN mkdir -p /app/screenshots /app/chrome_profiles \
    && chmod -R 755 /app/screenshots /app/chrome_profiles

# Create virtual display wrapper script
RUN echo '#!/bin/bash\nxvfb-run --server-args="-screen 0 1920x1080x24" python "$@"' > /app/run_with_xvfb.sh \
    && chmod +x /app/run_with_xvfb.sh

# Run with xvfb for headless operation
CMD ["/app/run_with_xvfb.sh", "index.py"]
```

Key components:

1. Base Python 3.9 image
2. Chrome dependencies and installation
3. Virtual display setup with Xvfb
4. Application code and permissions
5. Entry point with virtual framebuffer

## Docker Compose Configuration

The `docker-compose.yml` file simplifies running the container:

```yaml
services:
  woltflow:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        BUILDKIT_INLINE_CACHE: 1
    container_name: woltflow
    volumes:
      - ./screenshots:/app/screenshots
      - ./db.json:/app/db.json # For JSON-based configuration
      - ./chrome_profiles:/app/chrome_profiles
    ports:
      - "9222:9222" # Chrome debugging port
    environment:
      - PYTHONUNBUFFERED=1
      - DEBUG_CHROME=1
      # Database configuration
      - DATABASE_URL=postgresql://user:password@db_host/woltflow
    cap_add:
      - SYS_ADMIN # Required for Chrome
    shm_size: 2gb # Shared memory for Chrome
```

## Running with Docker

### Local Mode with JSON File

If you want to use a local db.json file:

```bash
# Windows PowerShell
.\run-local.ps1

# Linux/macOS
docker-compose up --build
```

### PostgreSQL Mode

To use with a PostgreSQL database:

1. Configure the database connection in docker-compose.yml:

   ```yaml
   environment:
     - DATABASE_URL=postgresql://user:password@db_host/woltflow
   ```

2. Run the container:
   ```bash
   docker-compose up --build
   ```

## Volume Mappings

The Docker container uses several volume mappings:

- `./screenshots:/app/screenshots`: Persists screenshots of login attempts
- `./db.json:/app/db.json`: Maps the local db.json file into the container (if using JSON)
- `./chrome_profiles:/app/chrome_profiles`: Persists Chrome profiles between runs

## Technical Details

### Headless Operation

WoltFlow runs Chrome in headless mode using Xvfb (X Virtual Framebuffer):

```bash
xvfb-run --server-args="-screen 0 1920x1080x24" python script.py
```

This creates a virtual display that Chrome can use without requiring a physical monitor.

### Chrome Installation

The Docker image includes Google Chrome for Linux, installed from Google's official repository:

```dockerfile
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable
```

### Security Considerations

The Docker container includes several security enhancements:

- Non-root user operation
- Minimal base image (python:3.9-slim)
- Only necessary system packages
- Proper permission settings
- Isolated Chrome profile

## Troubleshooting

### Common Issues

1. **Container exits immediately**: Check the logs for errors using `docker logs woltflow`

2. **Chrome crashes**: Increase shared memory allocation in docker-compose.yml:

   ```yaml
   shm_size: 4gb # Increase from 2gb
   ```

3. **Permission errors**: Make sure the mounted volumes have proper permissions:

   ```bash
   # Linux/macOS
   chmod -R 755 screenshots chrome_profiles
   ```

4. **Database connection issues**: Verify the DATABASE_URL is correct and the database is accessible from the container

5. **DBus errors in logs**: These are normal in containerized environments and can be ignored

### Debugging

For advanced debugging:

1. Enable Chrome debugging logs:

   ```yaml
   environment:
     - DEBUG_CHROME=1
   ```

2. Connect to Chrome's remote debugging interface:

   ```
   http://localhost:9222
   ```

3. Inspect container logs:
   ```bash
   docker logs -f woltflow
   ```
