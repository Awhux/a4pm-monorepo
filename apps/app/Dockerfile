FROM node:24-alpine AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @a4pm-receitas/app build

FROM nginx:stable-alpine
COPY --from=builder /app/apps/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
