Traveloop
=========

Traveloop is a travel planning scaffold with a Django REST backend and a React + Tailwind frontend. The backend models trips, stops, activities, budgets, packing items, notes, and public sharing. The frontend is a polished SPA with routing, animated cards, OpenStreetMap map UI, and chart components.

Project layout
--------------

- `manage.py` and `traveloop/` contain the Django project configuration.
- `trips/` contains the core models, serializers, views, tests, and admin registration.
- `frontend/` contains the React app built with Vite, Tailwind CSS, Framer Motion, Lucide React, Recharts, and React Leaflet.

Setup
-----

1. Create a virtual environment and install backend dependencies from `requirements.txt`.
2. Configure MySQL environment variables or set `DATABASE_ENGINE=django.db.backends.sqlite3` for local development.
3. Run Django migrations after creating the database.
4. Install frontend dependencies in `frontend/` and start the Vite dev server.

Backend environment variables
-----------------------------

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DATABASE_ENGINE`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_HOST`
- `MYSQL_PORT`

Frontend environment variables
-----------------------------

- `VITE_API_BASE_URL`

API surface
-----------

The Django app exposes auth, trip, stop, activity, budget, packing, notes, search, sharing, and admin endpoints under `/api/`.

Frontend notes
--------------

- Uses JSX only, with functional components and hooks.
- Uses `fetch()` through a small API helper.
- Uses OpenStreetMap tiles via React Leaflet.
- Uses charts from Recharts for budget visualizations.

