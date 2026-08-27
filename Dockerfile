# ---- build ----
# devDependencies gerekiyor: build betigi "tsc -b && vite build" calistiriyor.
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- runtime ----
# Express hem dist/ statiklerini hem /api rotalarini ayni porttan serve ediyor,
# bu yuzden tek container yeterli (frontend relative /api kullaniyor -> CORS yok).
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY server ./server
# NeDB dosyasi volume'a baglanir; bos dizin sadece mount noktasi.
RUN mkdir -p server/data
EXPOSE 8080
CMD ["node", "server/index.js"]
