from django.urls import path

from . import views

urlpatterns = [
    path("auth/login/", views.login_view),
    path("auth/signup/", views.signup_view),
    path("auth/logout/", views.logout_view),
    path("auth/profile/", views.profile_view),
    path("trips/", views.trip_list_create),
    path("community/", views.community_list_create),
    path("trips/<int:trip_id>/", views.trip_detail),
    path("trips/<int:trip_id>/stops/", views.add_stop),
    path("stops/<int:stop_id>/", views.stop_detail),
    path("stops/<int:stop_id>/activities/", views.add_activity),
    path("activities/<int:activity_id>/", views.activity_detail),
    path("trips/<int:trip_id>/budget/", views.trip_budget),
    path("budget/<int:budget_id>/", views.budget_detail),
    path("trips/<int:trip_id>/packing/", views.trip_packing),
    path("packing/<int:item_id>/", views.packing_detail),
    path("trips/<int:trip_id>/notes/", views.trip_notes),
    path("notes/<int:note_id>/", views.note_detail),
    path("search/cities/", views.search_cities),
    path("search/activities/", views.search_activities),
    path("trips/<int:trip_id>/share/", views.share_trip),
    path("shared/<uuid:share_token>/", views.shared_itinerary),
    path("trips/<int:trip_id>/copy/", views.copy_shared_trip),
    path("admin/dashboard/", views.admin_dashboard),
    path("admin/users/", views.admin_users),
    path("ai/activities/", views.ai_activity_search),
]
