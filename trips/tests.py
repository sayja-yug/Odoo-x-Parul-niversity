from django.contrib.auth import get_user_model
from django.test import TestCase

from .models import Trip

User = get_user_model()


class TripModelTests(TestCase):
    def test_trip_creates_for_user(self):
        user = User.objects.create_user(username="traveler", email="traveler@example.com", password="secret12345")
        trip = Trip.objects.create(
            user=user,
            title="Summer Escape",
            description="A quick test trip",
            start_date="2026-06-01",
            end_date="2026-06-10",
        )
        self.assertEqual(trip.user.username, "traveler")
