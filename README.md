

## 📦 Installation

### Prerequisites

 Node.js 18+ or 20+
 npm or yarn or pnpm

### Steps

1. Clone the repository

```bash
git clone <your-repo-url>
cd kanban-dashboard
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create environment file

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/tasks
```

---

## 🗂️ Running the JSON Server

### Option 1 — Using the built-in script

Start `json-server` from the project:

```bash
npm run api
```

This runs the server on port 4000 and watches changes in `db.json`.

---

### Option 2 — Run your own JSON data manually

If you want to run your own JSON file (e.g., `app/db.json`) on a custom port:

```bash
npx json-server --watch app/db.json --port 3001
```

This will:

 Watch your `db.json` for live changes
 Run the API on port 3001 (avoiding conflicts with Next.js on 3000)
 Auto-generate REST endpoints such as:

```
GET    http://localhost:3001/tasks
GET    http://localhost:3001/tasks/:id
POST   http://localhost:3001/tasks
PUT    http://localhost:3001/tasks/:id
DELETE http://localhost:3001/tasks/:id
```

You can keep it running in the background during development.

---

## 🚀 Start the development server

4. Start Next.js dev server

```bash
npm run dev
```

5. Or run both (Next.js + json-server) together

```bash
npm run dev:full
```

6. Open your browser

```
http://localhost:3000
```

---

## 🏗️ Build for Production

```bash
npm run build
npm run start
```

---

