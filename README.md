# 🌤️ Foggit

A modular **NestJS backend** that integrates **OpenWeather**, caches results, and enforces **workspace-scoped RBAC**.

## ✨ Features

* 🔐 **Authentication**: Email/OTP, password login, reset links, refresh tokens, OAuth
* 🛡️ **RBAC**: CASL abilities scoped per workspace member
* ☁️ **Weather**: OpenWeather client integration
* 💾 **Caching**: Redis
* 🧱 **Database**: PostgreSQL + Prisma

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Add environment variables
cp apps/backend/.env.example apps/backend/.env
# Fill in database, Redis, JWT, OAuth, mail, and OpenWeather keys

# Apply Prisma migrations
pnpm -F backend exec prisma migrate dev

# Run development server
pnpm dev
```

## 🔑 Auth Overview

Tokens are stored as **HttpOnly cookies** (`accessToken` & `refreshToken`).

* **Sign-in:**

  * **Email OTP** → `/auth/send-temporary-password` + `/auth/login-with-email`
  * **Google/Microsoft OAuth** → redirect → callback sets cookies
* **Onboarding:**

  * Requests flagged with `requiresOnboarding`
  * Complete `/onboarding` steps (`PROFILE` → `WORKSPACE`) to create a user & workspace
* **Workspace:**
  * Set `workspace=<workspace-uuid>` cookie

## 🛡️ RBAC

* CASL abilities scoped per workspace
* **Admin**: manage everything in the workspace
* **User**: read own data only
* Cross-workspace access is denied
