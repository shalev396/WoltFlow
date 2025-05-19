FROM python:3.9-slim

# Install dependencies for Chrome
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    xvfb \
    libglib2.0-0 \
    libnss3 \
    libgconf-2-4 \
    libfontconfig1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxi6 \
    libxtst6 \
    libxrandr2 \
    libxss1 \
    libxkbcommon0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libcups2 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libasound2 \
    dbus \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Install Chrome for Linux
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

# Set up a non-root user for Chrome to run more safely
RUN groupadd -r woltuser && useradd -r -g woltuser -G audio,video woltuser \
    && mkdir -p /home/woltuser/Downloads \
    && chown -R woltuser:woltuser /home/woltuser

# Create working directory
WORKDIR /app

# First copy and install requirements to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p /app/screenshots /app/chrome_profiles \
    && chmod -R 755 /app/screenshots /app/chrome_profiles \
    && chown -R woltuser:woltuser /app

# Create a wrapper script to run with xvfb
RUN echo '#!/bin/bash\nxvfb-run --server-args="-screen 0 1920x1080x24" python "$@"' > /app/run_with_xvfb.sh \
    && chmod +x /app/run_with_xvfb.sh

# Switch to non-root user
USER woltuser

# Expose port for remote debugging
EXPOSE 9222

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run with xvfb to provide a virtual display for Chrome
CMD ["/app/run_with_xvfb.sh", "wolt_login.py"] 