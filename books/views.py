from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Q
from django.http import HttpResponseNotAllowed
from django.shortcuts import get_object_or_404, render, redirect
from django.utils import timezone

from .models import Book, BorrowRecord

# Create your views here.
def home(request):
    return render(request, 'index.html')

def search_books(request):
    query = request.GET.get('q', '').strip()
    books = Book.objects.all().order_by('title')

    if query:
        books = books.filter(
            Q(title__icontains=query) |
            Q(author__icontains=query) |
            Q(category__icontains=query)
        )

    context = {
        'books': books,
        'query': query,
    }
    return render(request, 'search_books.html', context)

def book_details_view(request, pk):
    book = get_object_or_404(Book, pk=pk)
    active_borrow = BorrowRecord.objects.filter(book=book, returned_at__isnull=True).select_related('user').first()
    current_user_record = None

    if request.user.is_authenticated:
        current_user_record = BorrowRecord.objects.filter(
            book=book,
            user=request.user,
            returned_at__isnull=True,
        ).first()

    context = {
        'book': book,
        'active_borrow': active_borrow,
        'current_user_record': current_user_record,
    }
    return render(request, 'book_details.html', context)

@login_required
def user_borrowed(request):
    borrow_records = BorrowRecord.objects.filter(
        user=request.user,
        returned_at__isnull=True,
    ).select_related('book')

    return render(request, 'user_borrowed.html', {'borrow_records': borrow_records})


@login_required
def borrow_book(request, pk):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    book = get_object_or_404(Book, pk=pk)
    active_borrow = BorrowRecord.objects.filter(book=book, returned_at__isnull=True).first()

    if active_borrow or book.status != Book.STATUS_AVAILABLE:
        messages.error(request, 'This book is currently not available.')
        return redirect('book_detail', pk=pk)

    existing_user_borrow = BorrowRecord.objects.filter(
        book=book,
        user=request.user,
        returned_at__isnull=True,
    ).exists()

    if existing_user_borrow:
        messages.error(request, 'You already borrowed this book.')
        return redirect('book_detail', pk=pk)

    BorrowRecord.objects.create(user=request.user, book=book)
    book.status = Book.STATUS_BORROWED
    book.save(update_fields=['status'])
    messages.success(request, f'You borrowed "{book.title}" successfully.')
    return redirect('borrowed_books')


@login_required
def return_book(request, borrow_id):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    borrow_record = get_object_or_404(
        BorrowRecord.objects.select_related('book'),
        id=borrow_id,
        user=request.user,
        returned_at__isnull=True,
    )

    borrow_record.returned_at = timezone.now()
    borrow_record.save(update_fields=['returned_at'])

    book = borrow_record.book
    has_active_borrow = BorrowRecord.objects.filter(book=book, returned_at__isnull=True).exists()
    if not has_active_borrow:
        book.status = Book.STATUS_AVAILABLE
        book.save(update_fields=['status'])

    messages.success(request, f'You returned "{book.title}" successfully.')
    return redirect('borrowed_books')

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

    book = get_object_or_404(Book, id=id)

    if request.method == "POST":

        book.title = request.POST.get("title")
        book.author = request.POST.get("author")
        book.category = request.POST.get("category")
        book.description = request.POST.get("description")

        book.save()

        return redirect("edit_book", id=id)

    return render(request, "edit_book.html", {"book": book})


@staff_member_required(login_url='login')
def delete_book(request, id):
    if request.method != 'POST':
        return HttpResponseNotAllowed(['POST'])

    book = get_object_or_404(Book, id=id)
    has_active_borrow = BorrowRecord.objects.filter(book=book, returned_at__isnull=True).exists()

    if has_active_borrow:
        messages.error(request, 'You cannot delete a book while it is currently borrowed.')
        return redirect('admin_books')

    book.delete()
    messages.success(request, 'Book deleted successfully.')
    return redirect('admin_books')
