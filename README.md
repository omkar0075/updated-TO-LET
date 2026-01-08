
# TO-LET | Student Accommodation Marketplace

A robust, dual-role marketplace designed specifically for the Indian market, connecting property owners with students and young professionals.

## 🌟 Core Features

- **Dual-User Dashboards**: Tailored experiences for both Property Owners (Tenants) and Accommodation Seekers.
- **Interactive Map Search**: Radius-based search functionality using Leaflet.js to find rooms near specific colleges or landmarks.
- **Property Advertising**: Owners can list rooms (Single/Shared), PGs, or full apartments with descriptions, prices, and photo galleries.
- **Smart Filtering**: Filter by property type, budget, and distance.
- **Wishlist System**: Seekers can save favorites with real-time badge updates.
- **Direct Enquiries**: Integrated messaging system for seekers to contact owners directly.
- **Profile Management**: Indian-market specific validation (10-digit phone, age verification, address tracking).

## 🛠 Tech Stack

- **Frontend**: React (Modern ESM approach via `esm.sh`)
- **Styling**: Tailwind CSS & Font Awesome 6
- **Maps**: Leaflet.js (OpenStreetMap)
- **Data Persistence**: LocalStorage (Simulated REST API)
- **Deployment**: Optimized for Vercel

## 🚀 Local Development

Since this project uses a no-build ESM architecture, you don't need a heavy build tool like Webpack or Vite to get started.

1. **Clone the repo**:
   ```bash
   git clone <your-repo-url>
   cd to-let-marketplace
   ```

2. **Start a local server**:
   You can use any static file server. For example:
   ```bash
   npx serve .
   ```

3. **Open the App**:
   Navigate to `http://localhost:3000` in your browser.

## 📦 Deployment to Vercel

The project includes a `vercel.json` configured for SPA routing.

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Connect your repository to [Vercel](https://vercel.com).
3. Set the **Output Directory** to `.` (the root).
4. Click **Deploy**.

## 🛡 Security Note

This demo uses `localStorage` to simulate a database. For a production environment, it is recommended to replace the `services/api.ts` logic with a real REST API (Node.js/Flask) and a secure database (PostgreSQL/MongoDB).

---
Built with ❤️ for students in India.
