# Full Stack Recipe App

## Prerequisites
- Node.js (v20+)
- Docker (for MySQL)
- pnpm

## Setup

1. **Install dependencies:**
   ```sh
   pnpm install
   ```

2. **Start Database:**
   ```sh
   docker compose up -d

   # or

   pnpm dev:up
   ```

3. **Setup Database (Migrations & Seeds):**
   ```sh
   pnpm db:migrate
   pnpm db:seed
   ```

4. **Start Backend:**
   ```sh
   pnpm dev:api
   ```
   - API URL: http://localhost:8000
   - Swagger Docs: http://localhost:8000/docs

5. **Start Frontend:**
   ```sh
   pnpm dev:app
   ```
   - App URL: http://localhost:5173

- Backend: NestJS, Modular DDD-style, Prisma.
- Frontend: Vue 3, Pinia, Tailwind, Feature-based structure.

## Testing
- **E2E Tests**:
  ```sh
  pnpm test:e2e
  ```

- **Unit Tests**:
  ```sh
  pnpm test
  ```


## Docker run

```sh
pnpm up:production # To run the production environment
pnpm down:production # To stop the production environment
```

## Docker compose run

```sh
pnpm dev:up # To run the development environment
pnpm dev:down # To stop the development environment
```
