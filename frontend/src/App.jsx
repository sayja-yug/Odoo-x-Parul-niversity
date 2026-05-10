import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Trips from './pages/Trips.jsx'
import TripDetail from './pages/TripDetail.jsx'
import Itinerary from './pages/Itinerary.jsx'
import Budget from './pages/Budget.jsx'
import Packing from './pages/Packing.jsx'
import Notes from './pages/Notes.jsx'
import Profile from './pages/Profile.jsx'
import SharedItinerary from './pages/SharedItinerary.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/trips" element={<Trips />} />
        <Route path="/trips/:tripId" element={<TripDetail />} />
        <Route path="/trips/:tripId/itinerary" element={<Itinerary />} />
        <Route path="/trips/:tripId/budget" element={<Budget />} />
        <Route path="/trips/:tripId/packing" element={<Packing />} />
        <Route path="/trips/:tripId/notes" element={<Notes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/shared/:shareToken" element={<SharedItinerary />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
