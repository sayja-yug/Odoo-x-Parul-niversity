from rest_framework.permissions import BasePermission


class IsAdminGroup(BasePermission):
    """Allow access only to users in the 'Admin' group."""

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.groups.filter(name="Admin").exists())

    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)
