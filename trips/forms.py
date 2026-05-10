from django import forms
from django.contrib.auth import get_user_model

from .models import Activity, Budget, Note, PackingItem, Stop, Trip

User = get_user_model()


class SignupForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name", "password"]


class TripForm(forms.ModelForm):
    class Meta:
        model = Trip
        fields = ["title", "description", "start_date", "end_date", "cover_photo", "total_budget", "is_public"]


class StopForm(forms.ModelForm):
    class Meta:
        model = Stop
        fields = ["city_name", "country", "arrival_date", "departure_date", "duration_days", "cost_index", "description", "order"]


class ActivityForm(forms.ModelForm):
    class Meta:
        model = Activity
        fields = ["title", "description", "category", "cost", "duration_hours", "image_url", "time_scheduled"]


class BudgetForm(forms.ModelForm):
    class Meta:
        model = Budget
        fields = ["category", "estimated_cost", "actual_cost", "notes"]


class PackingItemForm(forms.ModelForm):
    class Meta:
        model = PackingItem
        fields = ["item_name", "category", "is_packed"]


class NoteForm(forms.ModelForm):
    class Meta:
        model = Note
        fields = ["stop", "content"]
