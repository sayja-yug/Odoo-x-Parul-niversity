from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Activity, Budget, Note, PackingItem, Stop, Trip, TripShare

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "profile_picture",
            "bio",
            "language_preference",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["username", "email", "password", "first_name", "last_name"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
        )
        return user


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = [
            "id",
            "trip",
            "city_name",
            "country",
            "arrival_date",
            "departure_date",
            "duration_days",
            "cost_index",
            "description",
            "order",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class TripSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    stops_count = serializers.SerializerMethodField()
    stops = StopSerializer(many=True, read_only=True)

    def get_stops_count(self, obj):
        return obj.stops.count()

    class Meta:
        model = Trip
        fields = [
            "id",
            "user",
            "title",
            "description",
            "start_date",
            "end_date",
            "cover_photo",
            "total_budget",
            "is_public",
            "stops",
            "stops_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at", "stops_count"]


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = [
            "id",
            "stop",
            "title",
            "description",
            "category",
            "cost",
            "duration_hours",
            "image_url",
            "time_scheduled",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = [
            "id",
            "trip",
            "category",
            "estimated_cost",
            "actual_cost",
            "notes",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class PackingItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackingItem
        fields = [
            "id",
            "trip",
            "item_name",
            "category",
            "is_packed",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [
            "id",
            "trip",
            "stop",
            "content",
            "timestamp",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "timestamp", "created_at", "updated_at"]


class TripShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripShare
        fields = ["id", "trip", "shared_with_user", "is_public", "share_token", "created_at", "updated_at"]
        read_only_fields = ["id", "share_token", "created_at", "updated_at"]
