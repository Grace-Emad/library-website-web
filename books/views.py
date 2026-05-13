from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render, redirect
from .models import Book

# Create your views here.
def home(request):
    return render(request, 'index.html')

def search_books(request):
    return render(request, 'search_books.html')

def book_details_view(request, pk):
    return render(request, 'book_details.html')

@login_required
def user_borrowed(request):
    return render(request, 'user_borrowed.html')

@staff_member_required(login_url='login')
def admin_books(request):
    books = Book.objects.all().order_by('title')
    return render(request, 'admin_books.html', {'books': books})
# Add Book
@staff_member_required(login_url='login')
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
@staff_member_required(login_url='login')
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
