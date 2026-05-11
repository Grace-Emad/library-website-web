from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'index.html')

def search_books(request):
    return render(request, 'search_books.html')

def book_details(request):
    return render(request, 'book_details.html')

@login_required
def user_borrowed(request):
    return render(request, 'user_borrowed.html')

def admin_books(request):
    return render(request, 'admin_books.html')
@staff_member_required
def add_book(request):
    return render(request, 'add_book.html')

@staff_member_required
def edit_book(request, book_id):
    return render(request, 'edit_book.html')

