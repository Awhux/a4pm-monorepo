# API

This application contains the backend API for the A4PM Receitas platform, built with NestJS.

## Getting Started

To start the API server, run the main development command from the root of the monorepo:

```bash
pnpm dev:api
```

The `dev` command will start the API along with all the other applications. The API will be available at `http://localhost:8000` by default.

## Configuration

All configurations for the API, such as database connections and external services, are managed through the root `.env` file. Ensure the environment variables are correctly set up before running the application.

