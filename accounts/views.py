from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render, redirect

from .forms import AdminCreationForm, ProfileForm
from .models import CustomUser

def login_view(request):
    context = {}
    if request.method == 'POST':
        username = request.POST.get('username', '').strip()
        password = request.POST.get('password')
        context['entered_username'] = username

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        messages.error(request, 'Invalid credentials')
    return render(request, 'login.html', context)


def signup_view(request):
    context = {'form_data': {}}
    if request.method == 'POST':
        data = request.POST
        username = data.get('username', '').strip()
        password = data.get('password', '')
        confirm = data.get('confirm_password', '')
        email = data.get('email', '').strip()
        phone = data.get('phone', '').strip()
        context['form_data'] = {
            'username': username,
            'email': email,
            'phone': phone,
        }

        if not all([username, email, password, confirm]):
            messages.error(request, "Please enter all fields")
            return render(request, 'signup.html', context)
        if password != confirm:
            messages.error(request, "Passwords do not match")
            return render(request, 'signup.html', context)
        if CustomUser.objects.filter(username=username).exists():
            messages.error(request, "Username already exists!")
            return render(request, 'signup.html', context)
        if CustomUser.objects.filter(email=email).exists():
            messages.error(request, "Email already exists!")
            return render(request, 'signup.html', context)
        if CustomUser.objects.filter(phone=phone).exists():
            messages.error(request, "Phone number already exists!")
            return render(request, 'signup.html', context)

        user = CustomUser.objects.create_user(
            username = username,
            email = email,
            password = password,
            phone = phone
        )
        login(request, user)
        return redirect('home')

    return render(request, 'signup.html', context)

def logout_view(request):
    logout(request)
    return redirect('home')

@login_required
def profile_view(request):
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully!')
            return redirect('profile')
    else:
        form = ProfileForm(instance=request.user)

    return render(request, 'profile.html', {'form': form})


@staff_member_required(login_url='login')
def add_admin_view(request):
    if request.method == 'POST':
        form = AdminCreationForm(request.POST)
        if form.is_valid():
            admin_user = form.save(commit=False)
            admin_user.is_staff = True
            admin_user.is_superuser = False
            admin_user.save()
            messages.success(request, f'Admin user "{admin_user.username}" created successfully!')
            return redirect('add_admin')
    else:
        form = AdminCreationForm()

    for field in form.fields.values():
        field.widget.attrs.setdefault('class', 'formInput')

    return render(request, 'add_admin.html', {'form': form})
