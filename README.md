
# TO-LET | Student Accommodation Marketplace

A dual-role marketplace connecting property owners with students and young professionals seeking accommodation.

## 🚀 Deploy to Vercel

Since this project is built using a modern ESM-based React structure, it is incredibly easy to deploy as a static site.

### Steps to Deploy:

1.  **Prepare your Repository**: Ensure all files are in the root directory of your GitHub repository.
2.  **Connect to Vercel**:
    *   Go to [vercel.com](https://vercel.com) and log in.
    *   Click **"Add New"** > **"Project"**.
    *   Import your GitHub repository.
3.  **Configure Build Settings**:
    *   **Framework Preset**: Select `Other` or `Vite` (if using a build step). For this current setup, `Other` is fine as it serves static files.
    *   **Output Directory**: `.` (root directory).
4.  **Environment Variables**:
    *   If you decide to add a real backend later, add your `API_KEY` in the Project Settings -> Environment Variables.
5.  **Click Deploy**: Vercel will automatically detect the `vercel.json` and handle the routing.

## 🛠 Features

- **Dual Roles**: Separate dashboards for Property Owners and Seekers.
- **Interactive Maps**: Search for rooms within a specific radius using OpenStreetMap/Leaflet.
- **Property Management**: Owners can list rooms, hostels, or apartments with multiple images.
- **Wishlist & Enquiries**: Seekers can save favorites and send messages directly to owners.
- **Profile Completion**: Mandatory profile details including Indian phone validation and address management.

## 💻 Technical Stack

- **Frontend**: React (ESM via esm.sh)
- **Styling**: Tailwind CSS, Font Awesome 6
- **Maps**: Leaflet.js
- **State Management**: React Hooks
- **Data Persistence**: LocalStorage (Mock API)

## 📞 Support

For any enquiries regarding the platform, contact support@tolet.com.
