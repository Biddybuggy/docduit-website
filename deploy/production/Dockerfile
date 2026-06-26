FROM node:20-alpine as dependencies
WORKDIR /app
COPY package.json ./
RUN yarn install

FROM node:20-alpine as builder
ENV NEXT_PUBLIC_ENV=production
# Public build-time variables only. Never prefix secrets with NEXT_PUBLIC_.
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID
ARG NEXTAUTH_URL

ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${NEXT_PUBLIC_GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=${NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm run build --verbose

FROM node:20-alpine as deploy
WORKDIR /app
ENV NODE_ENV production
ENV TZ Asia/Jakarta
# Server-only secrets must be injected at runtime (not baked into client bundle).
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG OPENAI_API_KEY
ARG AI_CHAT_URL
ARG CHAT_DEMO_CF_WORKER_URL

ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}
ENV AI_CHAT_URL=${AI_CHAT_URL}
ENV CHAT_DEMO_CF_WORKER_URL=${CHAT_DEMO_CF_WORKER_URL}
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/package.json ./package.json

EXPOSE 4000
ENV PORT 4000

CMD ["node", "server.js"]
