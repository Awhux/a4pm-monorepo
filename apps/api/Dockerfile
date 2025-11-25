FROM node:24-alpine

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @a4pm-receitas/database build
RUN pnpm --filter @a4pm-receitas/api build

WORKDIR /app/apps/api

EXPOSE 8000

CMD ["node", "dist/main"]
