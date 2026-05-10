# ✈️ Traveloop - Premium Travel Planner

Traveloop is a state-of-the-art travel planning application designed to turn complex trip ideas into polished, actionable itineraries. Built with a robust **Django REST** backend and a high-performance **React** frontend, it offers a seamless experience for both travelers and platform administrators.

---

## ✨ Key Features

### 🌍 For Travelers
- **Interactive Itineraries**: Plan your trips with detailed stops, dates, and durations.
- **Visual Maps**: Integrated OpenStreetMap for geographical visualization of your journey.
- **Budget Management**: Track estimated vs. actual costs with beautiful data charts.
- **Collaborative Sharing**: Generate unique shareable links for your friends and family.
- **AI-Powered Suggestions**: Discover popular activities and hidden gems in any city.
- **Personalized Profile**: Manage your travel preferences, BIO, and profile settings.

### 🛡️ For Administrators
- **Executive Dashboard**: Comprehensive analytics on user growth and trip trends.
- **Regional Analytics**: Visualize global travel distribution through interactive charts.
- **User Management**: Monitor and manage platform activity from a secure interface.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django & Django REST Framework (DRF)
- **Database**: SQLite (Development) / PostgreSQL or MySQL (Production)
- **Authentication**: Session-based with CSRF protection

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS & Vanilla CSS (for custom premium aesthetics)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Maps**: React Leaflet & OpenStreetMap

---

## 🚀 Getting Started

### 1. Backend Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (Admin)
python manage.py createsuperuser

# Start the server
python manage.py runserver 8001
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Configure API URL (create .env)
echo "VITE_API_BASE_URL=http://localhost:8001/api" > .env

# Start development server
npm run dev
```

---

## 🔒 Environment Variables

### Backend (`.env`)
- `DJANGO_SECRET_KEY`: Your secure production key.
- `DJANGO_DEBUG`: Set to `False` in production.
- `DATABASE_URL`: Connection string for your database.

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL`: The URL where your Django API is hosted.

---

## 📸 Screenshots
*(Add your screenshots here to showcase the premium UI)*

---

## 📜 License
This project is licensed under the MIT License.
