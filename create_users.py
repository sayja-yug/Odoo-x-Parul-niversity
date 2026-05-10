#!/usr/bin/env python
import os
import django

os.environ.setdefault('DATABASE_ENGINE', 'django.db.backends.sqlite3')
os.environ.setdefault('DJANGO_DEBUG', 'true')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'traveloop.settings')

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Delete existing test accounts
User.objects.filter(username__in=['testuser', 'admin']).delete()

# Create regular test user
user = User.objects.create_user(
    username='testuser',
    email='testuser@traveloop.local',
    password='Test@123456'
)
print("=" * 50)
print("✓ REGULAR USER CREATED")
print("=" * 50)
print(f"Username: {user.username}")
print(f"Password: Test@123456")
print(f"Email: {user.email}")
print(f"User ID: {user.id}")
print()

# Create superuser (admin)
admin = User.objects.create_superuser(
    username='admin',
    email='admin@traveloop.local',
    password='Admin@123456'
)
print("=" * 50)
print("✓ ADMIN USER CREATED")
print("=" * 50)
print(f"Username: {admin.username}")
print(f"Password: Admin@123456")
print(f"Email: {admin.email}")
print(f"Admin ID: {admin.id}")
print()
print("You can now login at:")
print("  http://127.0.0.1:5173/login")
