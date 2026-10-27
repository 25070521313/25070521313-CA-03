# FLEXI — Student Task & Study Planner

FLEXI is a study planner with a React/Vite frontend, an Express API, MongoDB storage, and JWT-based accounts.

## Prerequisites

- Windows 10 or later
- Node.js 18 or later and npm
- MongoDB Community Server running locally, or a MongoDB Atlas database
- VS Code (optional)

## First-time setup

Open PowerShell in the project folder (the folder containing `client` and `server`).

### 1. Install dependencies

```powershell
cd server
npm install
cd ..\client
npm install
cd ..
```

### 2. Configure the backend

Create `server\.env` from the safe template if it does not already exist:

```powershell
if (-not (Test-Path server\.env)) { Copy-Item server\.env.example server\.env }
```

If `server\.env` already exists, keep it and check that it has `PORT`, `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL` instead of overwriting it.

Open `server\.env` and set `JWT_SECRET` to a private, locally generated value of at least 32 characters. To generate one with Node.js, run:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('base64url'))"
```

Copy the output directly into `server\.env`; do not share it or commit the `.env` file. The default local settings are:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/flexi
CLIENT_URL=http://localhost:5173
```

The client uses `http://localhost:5000/api` by default. To change it, copy `client\.env.example` to `client\.env.local` and set `VITE_API_URL`.

### 3. Start MongoDB

Start the MongoDB Windows service from Services, or start MongoDB Server using your installed setup. MongoDB Compass can connect to `mongodb://127.0.0.1:27017`; FLEXI stores its data in the `flexi` database.

### 4. Run the backend and frontend

Open **two PowerShell terminals** in the project folder.

In the first terminal:

```powershell
cd server
npm run dev
```

In the second terminal:

```powershell
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The API health check is [http://localhost:5000/api/health](http://localhost:5000/api/health).

## Verify the frontend build

```powershell
cd client
npm run build
```

## Troubleshooting

- **MongoDB connection failed:** Confirm MongoDB Server is running and `MONGODB_URI` in `server\.env` is correct.
- **JWT_SECRET error:** Set a private secret of at least 32 characters in `server\.env`, then restart the backend.
- **Port 5000 is already in use:** Stop the other process using that port or change `PORT` in `server\.env`; restart the backend after changing it.
- **Port 5173 is already in use:** Vite may offer another port. If so, update `CLIENT_URL` in `server\.env` to that exact frontend origin and restart the backend.
- **The frontend cannot reach the API:** Run the backend, check the API health URL, and confirm the client API URL and `CLIENT_URL` match your local ports.
- **`npm` cannot find a script or `package.json`:** Change into the correct folder first: `server` for the API, or `client` for the frontend.

## Data and GitHub safety

The backend `.env` file contains a private JWT secret and must stay local. `.env` files, dependencies, logs, and build output are excluded by `.gitignore`; the `.env.example` templates contain placeholders only. Do not put passwords, JWTs, or other credentials in source files or commits.
