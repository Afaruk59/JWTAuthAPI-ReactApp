# AuthServer.API + OrderViewApp

A production-ready JWT authentication API built with ASP.NET Core 8 and a React 19 + TypeScript client (Vite) for order/user management. This repository is organized as a backend API (`AuthServer.API` solution) and a frontend SPA (`OrderViewApp`).

## Overview

- Secure JWT-based authentication and authorization (access & refresh tokens)
- Role-based access control (e.g., Admin, Manager, User)
- Registration flow with email hand-off (SMTP-configurable)
- EF Core + SQL Server with code-first migrations
- React SPA with Ant Design UI and protected routes
- CORS configured for local development

## Tech Stack

- Backend: .NET 8, ASP.NET Core Web API, Entity Framework Core, Identity (UserManager)
- Database: SQL Server
- Frontend: React 19, TypeScript, Vite, Ant Design, Axios, React Router, (optionally) Redux Toolkit

## Repository Structure

```
AuthServer.API/
  AuthServer.API/                 # ASP.NET Core Web API (entry)
    Controllers/                 # Auth & User controllers
    Validations/                 # FluentValidation validators
    appsettings*.json            # Configuration (DB, JWT, SMTP)
    Program.cs                   # Composition root (DI, CORS, Swagger)
    Properties/launchSettings.json
  AuthServer.Core/               # Contracts (DTOs, interfaces, models)
  AuthServer.Service/            # Domain services (Authentication, Token, User)
  AuthService.Data/              # EF Core DbContext, Repositories, Migrations
  SharedLibrary/                 # Cross-cutting (JWT, responses, exceptions, SMTP)
  test.http                      # REST client requests (for local testing)

OrderViewApp/                    # React + TS app (Vite)
  src/
    pages/                       # Auth & user/order pages
    layout/                      # Protected layout & logout logic
    components/                  # Route guards etc.
    utils/                       # Auth helpers
  public/                        # Static assets
  vite.config.ts                 # Vite configuration
```

## Backend (AuthServer.API)

### Configuration

Edit `AuthServer.API/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "SqlServer": "Server=YOUR_SQL_SERVER;Database=JWT;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "TokenOption": {
    "Audience": ["www.authserver.com"],
    "Issuer": "www.authserver.com",
    "AccessTokenExpiration": 5,
    "RefreshTokenExpiration": 600,
    "SecurityKey": "REPLACE_WITH_LONG_RANDOM_SECRET"
  },
  "Smtp": {
    "Host": "smtp.example.com",
    "Port": 587,
    "EnableSsl": true,
    "UserName": "no-reply@example.com",
    "Password": "your-smtp-password",
    "From": "no-reply@example.com"
  }
}
```

- Set a strong `TokenOption.SecurityKey` (32+ chars). Never commit real secrets.
- Update `ConnectionStrings.SqlServer` to your environment.
- Optional: configure SMTP for registration emails.

CORS in `Program.cs` permits Vite dev origins by default:

- `http://localhost:5173`
- `https://localhost:5173`

### Run the API

```bash
# from repository root
cd AuthServer.API/AuthServer.API

# restore & run (Development)
dotnet restore
dotnet build
dotnet run
```

Default dev URLs (see `launchSettings.json`):

- HTTP: `http://localhost:5294`
- HTTPS: `https://localhost:7084`

### Database & Migrations

Migrations live in `AuthServer.API/AuthService.Data/Migrations` and the API is configured with
`MigrationsAssembly = "AuthService.Data"`.

Apply migrations:

```bash
# from repository root
# Option A: using dotnet-ef (if not installed: dotnet tool install -g dotnet-ef)

dotnet ef database update \
  --project AuthServer.API/AuthService.Data \
  --startup-project AuthServer.API/AuthServer.API
```

This will create/update the `JWT` database according to the migrations.

### Key Endpoints

Base route: `http://localhost:5294/api`

- AuthController
  - `POST /Auth/CreateToken` — email + password → access/refresh tokens
  - `POST /Auth/CreateTokenByRefreshToken` — refresh token → new tokens
  - `POST /Auth/RevokeRefreshToken` — revoke a refresh token
- UserController
  - `POST /User/CreateUser` — begin registration (email)
  - `POST /User/CompleteRegistration` — finalize password setup
  - `GET /User/GetUser` — get current user (requires Bearer)
  - `POST /User/CreateUserByAdmin` — create user with role (Admin only)
  - `POST /User/AssignRole/{userName}/{roleName}` — assign role (Admin only)
  - `GET /User/GetAllUsers` — list users (Admin, Manager)
  - `DELETE /User/DeleteUser/{userName}` — remove user (Admin only)

Example `http` requests are provided in `AuthServer.API/test.http`.

### JWT Details

- Claims include: `sub`/`nameidentifier`, `email`, `name`, `jti`, `role`, and `aud` (for each audience)
- Access token lifetime: `TokenOption.AccessTokenExpiration` minutes (default 5)
- Refresh token lifetime: `TokenOption.RefreshTokenExpiration` minutes (default 600)
- Server enforces zero clock skew and validates issuer/audience/signing key

## Frontend (OrderViewApp)

### Configuration

Create `.env` (or `.env.local`) in `OrderViewApp/`:

```env
VITE_API_BASE_URL=http://localhost:5294
```

The SPA reads `import.meta.env.VITE_API_BASE_URL` to call the API.
Tokens are stored in `localStorage` or `sessionStorage` based on the "Remember me" choice.

### Run the SPA

```bash
# from repository root
cd OrderViewApp
npm install
npm run dev
```

Vite dev server: `http://localhost:5173`

### Notable UI Flows

- Login: email + password → stores access/refresh tokens
- Registration: request invite → complete registration (set password)
- Protected routes: role-based access (e.g., Admin/Manager)
- Logout: revokes refresh token (if present) and clears storage

## Development Tips

- Ensure backend is running before the SPA to avoid CORS/network errors.
- If you change API ports/origins, update:
  - Backend CORS policy in `Program.cs`
  - Frontend `VITE_API_BASE_URL` in `.env`
- Use the `test.http` file with VS Code REST Client or JetBrains HTTP Client for quick testing.

## Troubleshooting

- 401/403 responses:
  - Verify `SecurityKey`, `Issuer`, `Audience` are set consistently.
  - Confirm Bearer token is attached and not expired.
- DB connection issues:
  - Check SQL Server instance and `SqlServer` connection string.
  - Run migrations from the repository root with correct `--project` pairs.
- CORS errors:
  - Keep SPA at `http(s)://localhost:5173` or update the CORS policy accordingly.

## License

This project does not currently declare a license. Add one if you plan to distribute.
