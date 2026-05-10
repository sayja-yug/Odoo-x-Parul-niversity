#!/usr/bin/env python
import os
import django
import string
import secrets

os.environ.setdefault('DATABASE_ENGINE', 'django.db.backends.sqlite3')
os.environ.setdefault('DJANGO_DEBUG', 'true')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'traveloop.settings')

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Generate a secure password
def generate_password(length=16):
    alphabet = string.ascii_letters + string.digits + string.punctuation.replace("'", "").replace('"', '')
    password = ''.join(secrets.choice(alphabet) for i in range(length))
    return password

# Generate unique username
base_username = 'admin'
counter = 1
username = base_username
while User.objects.filter(username=username).exists():
    username = f"{base_username}{counter}"
    counter += 1

password = generate_password()

# Create superuser (admin)
admin = User.objects.create_superuser(
    username=username,
    email=f'{username}@traveloop.local',
    password=password
)

print("=" * 50)
print("✓ NEW ADMIN USER CREATED")
print("=" * 50)
print(f"Admin ID: {admin.id}")
print(f"Password: {password}")
print("=" * 50)
