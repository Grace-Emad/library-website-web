from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser


# Create your views here.
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        messages.error(request, 'Invalid credentials')
    return render(request, 'login.html')


def signup_view(request):
    if request.method == 'POST':
        data = request.POST
        username = data.get('username', '').strip()
        password = data.get('password', '')
        confirm = data.get('confirm_password', '')
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()

        if not all([username, email, password, confirm]):
            messages.error(request, "Please enter all fields")
            return render(request, 'signup.html')
        if password != confirm:
            messages.error(request, "Passwords do not match")
            return render(request, 'signup.html')
        if CustomUser.objects.filter(username=username).exists():
            messages.error(request, "Username already exists!")
            return render(request, 'signup.html')
        if CustomUser.objects.filter(email=email).exists():
            messages.error(request, "Email already exists!")
            return render(request, 'signup.html')

        user = CustomUser.objects.create_user(
            username = username,
            email = email,
            password = password,
            phone = phone
        )
        login(request, user)
        return redirect('home')

    return render(request, 'signup.html')

def logout_view(request):
    logout(request)
    return redirect('home')


