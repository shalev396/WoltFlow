# escape=`
FROM mcr.microsoft.com/windows/servercore:ltsc2019
LABEL maintainer="shalev396@gmail.com"

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop';"]

WORKDIR C:\app

# Install Python (embeddable + pip) – assume this is already working
RUN Invoke-WebRequest `
      -UseBasicParsing `
      -Uri "https://www.python.org/ftp/python/3.11.4/python-3.11.4-embed-amd64.zip" `
      -OutFile python.zip; `
    Expand-Archive python.zip -DestinationPath C:\Python; `
    Remove-Item python.zip; `
    Rename-Item C:\Python\python311._pth python311.pth; `
    New-Item -ItemType Directory -Path C:\Python\DLLs; `
    Invoke-WebRequest `
      -UseBasicParsing `
      -Uri "https://bootstrap.pypa.io/get-pip.py" `
      -OutFile C:\Python\get-pip.py; `
    C:\Python\python.exe C:\Python\get-pip.py; `
    Remove-Item C:\Python\get-pip.py

# Add Python to PATH
ENV PATH C:\Python;C:\Python\Scripts;%PATH%

# Install Chrome silently
RUN Invoke-WebRequest `
      -UseBasicParsing `
      -Uri "https://dl.google.com/chrome/install/latest/chrome_installer.exe" `
      -OutFile chrome_installer.exe; `
    Start-Process chrome_installer.exe -ArgumentList "/silent","/install" -NoNewWindow -Wait; `
    Remove-Item chrome_installer.exe

# Copy application files
COPY . .

# Install Python dependencies
RUN ["C:\\Python\\python.exe", "-m", "pip", "install", "--no-cache-dir", "-r", "requirements.txt"]

# Ensure crash dumps directory exists and is writable
RUN New-Item -ItemType Directory -Path C:\tmp\Crashpad

# Expose DevTools port
EXPOSE 9222

CMD ["C:\\Python\\python.exe", "index.py"]
