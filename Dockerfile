# ---------- Base image ----------
  FROM node:18-alpine AS base
  ENV TZ=Asia/Phnom_Penh
  RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
  WORKDIR /app
  
  # ---------- Install dependencies ----------
  FROM base AS deps
  RUN apk add --no-cache libc6-compat
  COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
  RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm install --frozen-lockfile; \
    else echo "No lockfile found" && exit 1; \
    fi
  
  # ---------- Build project ----------
  FROM base AS builder
  ENV NODE_OPTIONS="--max-old-space-size=2048"
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  
  # Disable Next.js telemetry for production builds
  ENV NEXT_TELEMETRY_DISABLED=1
  
  RUN npm run build
  
  # ---------- Final runtime image ----------
  FROM node:18-alpine AS runner
  ENV NODE_ENV=production
  ENV PORT=3000
  ENV HOSTNAME=0.0.0.0
  WORKDIR /app
  
  # Create user for better security
  RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
  
  # Copy only necessary files for standalone output
  COPY --from=builder /app/public ./public
  COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
  COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
  
  USER nextjs
  EXPOSE 3000
  CMD ["node", "server.js"]
  