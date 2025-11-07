## 📦 Installation

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn or pnpm

### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd kanban-dashboard
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/tasks
```

4. **Start json-server (in one terminal)**
```bash
npm run api
```

5. **Start Next.js dev server (in another terminal)**
```bash
npm run dev
```

6. **Or run both together**
```bash
npm run dev:full
```

7. **Open your browser**
```
http://localhost:3000
```

## 🏗️ Build for Production
```bash
npm run build
npm run start
```