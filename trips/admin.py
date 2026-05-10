from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Activity, Budget, Note, PackingItem, Stop, Trip, TripShare, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Traveloop", {"fields": ("profile_picture", "bio", "language_preference")}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("Traveloop", {"fields": ("email", "first_name", "last_name")}),)
    list_display = ("username", "email", "first_name", "last_name", "role", "is_staff")
    filter_horizontal = ("groups", "user_permissions")


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "start_date", "end_date", "is_public")
    list_filter = ("is_public", "start_date")


@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ("city_name", "country", "trip", "order")
    list_filter = ("country",)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ("title", "stop", "category", "cost")


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ("trip", "category", "estimated_cost", "actual_cost")


@admin.register(PackingItem)
class PackingItemAdmin(admin.ModelAdmin):
    list_display = ("item_name", "trip", "category", "is_packed")


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("trip", "stop", "timestamp")


@admin.register(TripShare)
class TripShareAdmin(admin.ModelAdmin):
    list_display = ("trip", "shared_with_user", "is_public", "share_token")