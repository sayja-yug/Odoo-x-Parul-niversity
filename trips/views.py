from django.contrib.auth import authenticate, get_user_model, login, logout
from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Activity, Budget, Note, PackingItem, Stop, Trip, TripShare
from .serializers import (
    ActivitySerializer,
    BudgetSerializer,
    NoteSerializer,
    PackingItemSerializer,
    SignupSerializer,
    StopSerializer,
    TripSerializer,
    TripShareSerializer,
    UserSerializer,
)

User = get_user_model()


def _trip_queryset(user):
    return Trip.objects.filter(user=user).select_related("user").prefetch_related("stops", "budgets", "packing_items", "notes")


def _is_owner(user, trip):
    return user.is_authenticated and trip.user_id == user.id


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def signup_view(request):
    serializer = SignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")
    user = authenticate(request, username=username, password=password)
    if user is None:
        return Response({"detail": "Invalid credentials."}, status=status.HTTP_400_BAD_REQUEST)
    login(request, user)
    return Response(UserSerializer(user).data)


@api_view(["POST"])
def logout_view(request):
    logout(request)
    return Response({"detail": "Logged out."})


@api_view(["GET", "PUT"])
def profile_view(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    if request.method == "GET":
        return Response(UserSerializer(request.user).data)

    serializer = UserSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    password = request.data.get("password")
    if password:
        request.user.set_password(password)
        request.user.save(update_fields=["password"])
    return Response(UserSerializer(request.user).data)


@api_view(["GET", "POST"])
def trip_list_create(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    if request.method == "GET":
        trips = _trip_queryset(request.user)
        return Response(TripSerializer(trips, many=True).data)

    serializer = TripSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    trip = serializer.save(user=request.user)
    return Response(TripSerializer(trip).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
def trip_detail(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id)
    if not _is_owner(request.user, trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        return Response(TripSerializer(trip).data)
    if request.method == "PUT":
        serializer = TripSerializer(trip, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    trip.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def add_stop(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id)
    if not _is_owner(request.user, trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    serializer = StopSerializer(data={**request.data, "trip": trip.id})
    serializer.is_valid(raise_exception=True)
    stop = serializer.save(trip=trip)
    return Response(StopSerializer(stop).data, status=status.HTTP_201_CREATED)


@api_view(["GET", "PUT", "DELETE"])
def stop_detail(request, stop_id):
    stop = get_object_or_404(Stop, pk=stop_id)
    if not _is_owner(request.user, stop.trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        return Response(StopSerializer(stop).data)
    if request.method == "PUT":
        serializer = StopSerializer(stop, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    stop.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def add_activity(request, stop_id):
    stop = get_object_or_404(Stop, pk=stop_id)
    if not _is_owner(request.user, stop.trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    serializer = ActivitySerializer(data={**request.data, "stop": stop.id})
    serializer.is_valid(raise_exception=True)
    activity = serializer.save(stop=stop)
    return Response(ActivitySerializer(activity).data, status=status.HTTP_201_CREATED)


@api_view(["PUT", "DELETE"])
def activity_detail(request, activity_id):
    activity = get_object_or_404(Activity, pk=activity_id)
    if not _is_owner(request.user, activity.stop.trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        serializer = ActivitySerializer(activity, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    activity.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def trip_budget(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id)
    if not _is_owner(request.user, trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        budgets = trip.budgets.all()
        data = BudgetSerializer(budgets, many=True).data
        totals = budgets.aggregate(estimated=Sum("estimated_cost"), actual=Sum("actual_cost"))
        return Response({"items": data, "totals": totals})

    serializer = BudgetSerializer(data={**request.data, "trip": trip.id})
    serializer.is_valid(raise_exception=True)
    budget = serializer.save(trip=trip)
    return Response(BudgetSerializer(budget).data, status=status.HTTP_201_CREATED)


@api_view(["PUT"])
def budget_detail(request, budget_id):
    budget = get_object_or_404(Budget, pk=budget_id)
    if not _is_owner(request.user, budget.trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    serializer = BudgetSerializer(budget, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["GET", "POST"])
def trip_packing(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id)
    if not _is_owner(request.user, trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        items = trip.packing_items.all()
        return Response(PackingItemSerializer(items, many=True).data)

    serializer = PackingItemSerializer(data={**request.data, "trip": trip.id})
    serializer.is_valid(raise_exception=True)
    item = serializer.save(trip=trip)
    return Response(PackingItemSerializer(item).data, status=status.HTTP_201_CREATED)


@api_view(["PUT", "DELETE"])
def packing_detail(request, item_id):
    item = get_object_or_404(PackingItem, pk=item_id)
    if not _is_owner(request.user, item.trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        serializer = PackingItemSerializer(item, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def trip_notes(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id)
    if not _is_owner(request.user, trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        notes = trip.notes.select_related("stop").order_by("-timestamp")
        return Response(NoteSerializer(notes, many=True).data)

    serializer = NoteSerializer(data={**request.data, "trip": trip.id})
    serializer.is_valid(raise_exception=True)
    note = serializer.save(trip=trip)
    return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)


@api_view(["PUT", "DELETE"])
def note_detail(request, note_id):
    note = get_object_or_404(Note, pk=note_id)
    if not _is_owner(request.user, note.trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "PUT":
        serializer = NoteSerializer(note, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    note.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def search_cities(request):
    query = request.query_params.get("q", "").strip()
    cities = [
        {"city_name": "Paris", "country": "France", "cost_index": "high", "rating": 4.8},
        {"city_name": "Tokyo", "country": "Japan", "cost_index": "high", "rating": 4.9},
        {"city_name": "Lisbon", "country": "Portugal", "cost_index": "medium", "rating": 4.7},
        {"city_name": "Jaipur", "country": "India", "cost_index": "low", "rating": 4.6},
        {"city_name": "Barcelona", "country": "Spain", "cost_index": "medium", "rating": 4.8},
    ]
    results = [city for city in cities if not query or query.lower() in city["city_name"].lower() or query.lower() in city["country"].lower()]
    return Response(results)


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def search_activities(request):
    stop_id = request.query_params.get("stop")
    category = request.query_params.get("category")
    queryset = Activity.objects.all().select_related("stop")
    if stop_id:
        queryset = queryset.filter(stop_id=stop_id)
    if category:
        queryset = queryset.filter(category__icontains=category)
    return Response(ActivitySerializer(queryset, many=True).data)


@api_view(["POST"])
def share_trip(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id)
    if not _is_owner(request.user, trip):
        return Response({"detail": "Not allowed."}, status=status.HTTP_403_FORBIDDEN)

    share = TripShare.objects.create(
        trip=trip,
        shared_with_user_id=request.data.get("shared_with_user") or None,
        is_public=bool(request.data.get("is_public", False)),
    )
    return Response(TripShareSerializer(share).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def shared_itinerary(request, share_token):
    share = get_object_or_404(TripShare, share_token=share_token)
    trip = share.trip
    payload = {
        "trip": TripSerializer(trip).data,
        "stops": StopSerializer(trip.stops.all(), many=True).data,
        "activities": ActivitySerializer(Activity.objects.filter(stop__trip=trip).select_related("stop"), many=True).data,
        "is_public": share.is_public or trip.is_public,
    }
    return Response(payload)


@api_view(["POST"])
def copy_shared_trip(request, trip_id):
    trip = get_object_or_404(Trip, pk=trip_id)
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

    copied = Trip.objects.create(
        user=request.user,
        title=f"Copy of {trip.title}",
        description=trip.description,
        start_date=trip.start_date,
        end_date=trip.end_date,
        total_budget=trip.total_budget,
        is_public=False,
    )
    for stop in trip.stops.all():
        new_stop = Stop.objects.create(
            trip=copied,
            city_name=stop.city_name,
            country=stop.country,
            arrival_date=stop.arrival_date,
            departure_date=stop.departure_date,
            duration_days=stop.duration_days,
            cost_index=stop.cost_index,
            description=stop.description,
            order=stop.order,
        )
        for activity in stop.activities.all():
            Activity.objects.create(
                stop=new_stop,
                title=activity.title,
                description=activity.description,
                category=activity.category,
                cost=activity.cost,
                duration_hours=activity.duration_hours,
                image_url=activity.image_url,
                time_scheduled=activity.time_scheduled,
            )
    return Response(TripSerializer(copied).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def admin_dashboard(request):
    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({"detail": "Admin only."}, status=status.HTTP_403_FORBIDDEN)

    stats = {
        "total_users": User.objects.count(),
        "total_trips": Trip.objects.count(),
        "top_cities": list(Stop.objects.values("city_name").annotate(total=Count("id")).order_by("-total")[:10]),
        "top_activities": list(Activity.objects.values("category").annotate(total=Count("id")).order_by("-total")[:10]),
    }
    return Response(stats)


@api_view(["GET"])
def admin_users(request):
    if not request.user.is_authenticated or not request.user.is_staff:
        return Response({"detail": "Admin only."}, status=status.HTTP_403_FORBIDDEN)

    users = User.objects.annotate(trips_count=Count("trips")).order_by("username")
    data = [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "is_active": user.is_active,
            "is_staff": user.is_staff,
            "trips_count": user.trips_count,
        }
        for user in users
    ]
    return Response(data)
