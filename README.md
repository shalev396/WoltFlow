# WoltFlow

WoltFlow is a full-stack solution for automating Wolt gift card purchases and managing user workflows. It comprises:

- **Client**: React + TypeScript frontend with Vite, Tailwind CSS, and shadcn/ui components.
- **Server**: Serverless Node.js backend powered by AWS Lambda, PostgreSQL, and Google OAuth2.
- **Script**: Python-based local runner for on-prem workflows and scheduled tasks.

## Tech Stack

- Frontend: React, TypeScript, Vite, Redux Toolkit, React Query, Axios, Shadcn/UI, Tailwind CSS
- Backend: Node.js, TypeScript, Serverless Framework, AWS Lambda, AWS S3, CloudFront, PostgreSQL (Sequelize), Google OAuth2
- Local Runner: Python 3, Selenium, Chrome, JSON local DB

## Repository Structure

```
.
├── Client/    # Frontend application (React + TS)
├── Server/    # Serverless backend (Node.js + AWS Lambda)
└── Script/    # Local Python automation runner
```

## Client (Frontend)

The Client is a Vite-powered React application with TypeScript. It uses Redux Toolkit for authentication state, React Query for data fetching, and shadcn/ui for reusable UI components.

- **Key Features**:
  - Google OAuth2 authentication
  - Protected routes and loading states
  - Dashboard, Runs, and Settings pages
  - Theme toggling (dark/light)
  - Responsive design

Link to detailed docs: [Client README](Client/README.md)

## Server (Backend)

The Server hosts AWS Lambda functions orchestrated by the Serverless Framework. It provides REST API endpoints for authentication, run management, settings, and automation tasks.

- **Key Features**:
  - OAuth2 flow (start & callback) and session cookies
  - JWT cookie-based authentication middleware
  - Sequelize models: User, Setting, Run, Code, Screenshot
  - Automation Lambdas: refreshTokens, woltBuyGift, woltApplyGift, startAllRuns
  - Gmail integration for daily code retrieval

Link to detailed docs: [Server README](Server/README.md)

## Script (Local Runner)

The Script folder contains a Python-based runner for local execution, suitable for development or on-premise automation. It uses Selenium and stealth utilities to automate Wolt interactions.

- **Key Features**:
  - JSON-based user configuration
  - Selenium-based Chrome automation with stealth utilities
  - Screenshots and logging
  - Windows Task Scheduler integration via provided XML

Link to detailed docs: [Script README](Script/README.md)

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/WoltFlow.git
   ```
2. **Client Setup**:
   ```bash
   cd Client
   npm install
   npm run dev
   ```
3. **Server Setup**:
   ```bash
   cd Server
   npm install
   npm run dev
   ```
4. **Script Setup**:
   ```bash
   cd Script
   python -m venv .env
   .env\Scripts\Activate.ps1   # PowerShell
   pip install -r requirements.txt
   python index.py --help
   ```

## Contributing

Please follow contribution guidelines in each subproject. Fork, branch, and submit pull requests for review.
