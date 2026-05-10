import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'traveloop.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

username = 'admin_user'
password = 'Password123!'
email = 'admin@traveloop.local'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"User {username} created successfully with password: {password}")
else:
    user = User.objects.get(username=username)
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()
    print(f"User {username} already exists. Password updated to: {password}")
