from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.shortcuts import render, redirect
from .models import Book

# Create your views here.
def home(request):
    return render(request, 'index.html')

def search_books(request):
    return render(request, 'search_books.html')

def book_details(request, pk):
    return render(request, 'book_details.html')

@login_required
def user_borrowed(request):
    return render(request, 'user_borrowed.html')

def admin_books(request):
    return render(request, 'admin_books.html')
# Add Book
def add_book(request):

    if request.method == "POST":

        title = request.POST.get("title")
        author = request.POST.get("author")
        category = request.POST.get("category")
        description = request.POST.get("description")

        Book.objects.create(
            title=title,
            author=author,
            category=category,
            description=description
        )

        return redirect("add_book")

    return render(request, "add_book.html")


# Edit Book
def edit_book(request, id):

    book = Book.objects.get(id=id)

    if request.method == "POST":

        book.title = request.POST.get("title")
        book.author = request.POST.get("author")
        book.category = request.POST.get("category")
        book.description = request.POST.get("description")

        book.save()

        return redirect("edit_book", id=id)

    return render(request, "edit_book.html", {"book": book})
    
from django.shortcuts import render
def book_details_view(request):
    return render(request, 'book_details.html')
