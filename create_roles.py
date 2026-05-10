#!/usr/bin/env python
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'traveloop.settings')
# ensure DB engine/debug set from env if needed
os.environ.setdefault('DATABASE_ENGINE', 'django.db.backends.sqlite3')
os.environ.setdefault('DJANGO_DEBUG', 'true')

django.setup()

from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model

User = get_user_model()

roles = ["Admin", "User", "Guest"]
for r in roles:
    g, created = Group.objects.get_or_create(name=r)
    print(f"Group: {g.name} (created={created})")

# Assign roles to known accounts
admin = User.objects.filter(username='admin').first()
if admin:
    admin.groups.clear()
    admin_group = Group.objects.get(name='Admin')
    admin.groups.add(admin_group)
    admin.save()
    print(f"Assigned Admin role to: {admin.username}")

user = User.objects.filter(username='testuser').first()
if user:
    user.groups.clear()
    user_group = Group.objects.get(name='User')
    user.groups.add(user_group)
    user.save()
    print(f"Assigned User role to: {user.username}")

print('\nDone. Roles created and assigned.\n')