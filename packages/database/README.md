# Database

This package is used to manage the database connection and migrations across the project.

## Installation

This package is installed in all apps that need to use the database at `apps/*/package.json` as a dependency.

## Usage

To use the database package, just include the `@a4pm-receitas/database` package in your app's `package.json` file.

## Configuration

The database connections will be automatically inferred from the `.env` file in your app.
In case of local development and migrations, edit the `.env` file located in the database package root.

## Migrations

To create a new migration, run the following command:

```bash
pnpm db:migrate
```

This will create a new migration file in the `prisma/migrations` directory.
