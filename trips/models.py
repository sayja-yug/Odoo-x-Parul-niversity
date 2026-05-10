import uuid

from django.contrib.auth.models import AbstractUser, Group
from django.db import models


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser, TimeStampedModel):
    profile_picture = models.ImageField(upload_to="profiles/", blank=True, null=True)
    bio = models.TextField(blank=True)
    language_preference = models.CharField(max_length=32, default="en")

    class Meta:
        # Ensure email is unique (override AbstractUser default)
        unique_together = []

    def __str__(self):
        return self.username

    @property
    def role(self):
        """Return the first group name for the user as a convenience role."""
        if self.is_superuser or self.is_staff:
            return "Admin"
        grp = self.groups.first()
        return grp.name if grp else "Guest"

    def set_role(self, role_name):
        """Assign the user to a single role (group), removing other groups."""
        group, _ = Group.objects.get_or_create(name=role_name)
        self.groups.set([group])
        self.save(update_fields=["last_login"])  


class Trip(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trips")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    cover_photo = models.ImageField(upload_to="trip_covers/", blank=True, null=True)
    total_budget = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    is_public = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class Stop(TimeStampedModel):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="stops")
    city_name = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    arrival_date = models.DateField()
    departure_date = models.DateField()
    duration_days = models.PositiveIntegerField(default=1)
    cost_index = models.CharField(max_length=32, default="medium")
    lat = models.FloatField(blank=True, null=True)
    lng = models.FloatField(blank=True, null=True)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "arrival_date"]

    def __str__(self):
        return f"{self.city_name}, {self.country}"


class Activity(TimeStampedModel):
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name="activities")
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=80)
    cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    duration_hours = models.DecimalField(max_digits=6, decimal_places=2, default=1)
    image_url = models.URLField(blank=True)
    date = models.DateField(blank=True, null=True)
    time_scheduled = models.TimeField(blank=True, null=True)

    def __str__(self):
        return self.title


class Budget(TimeStampedModel):
    class Category(models.TextChoices):
        TRANSPORT = "Transport", "Transport"
        ACCOMMODATION = "Accommodation", "Accommodation"
        ACTIVITIES = "Activities", "Activities"
        FOOD = "Food", "Food"
        OTHER = "Other", "Other"

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="budgets")
    category = models.CharField(max_length=40, choices=Category.choices)
    estimated_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    actual_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    notes = models.TextField(blank=True)


class PackingItem(TimeStampedModel):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="packing_items")
    item_name = models.CharField(max_length=200)
    category = models.CharField(max_length=80)
    is_packed = models.BooleanField(default=False)


class Note(TimeStampedModel):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="notes")
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE, related_name="notes", blank=True, null=True)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


class TripShare(TimeStampedModel):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="shares")
    shared_with_user = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="shared_trips")
    is_public = models.BooleanField(default=False)
    share_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)


class CommunityPost(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    content = models.TextField()
    trip = models.ForeignKey(Trip, on_delete=models.SET_NULL, blank=True, null=True)
    location_name = models.CharField(max_length=200, blank=True)
    likes_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["-created_at"]
