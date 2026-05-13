from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('search/', views.search_books, name='search'),
    path('book/<int:pk>/', views.book_details_view, name='book_detail'),
    path('book/<int:pk>/borrow/', views.borrow_book, name='borrow_book'),
    path('borrowed_books/', views.user_borrowed, name='borrowed_books'),
    path('borrowed_books/<int:borrow_id>/return/', views.return_book, name='return_book'),
    path('admin/books/', views.admin_books, name='admin_books'),
    path('add/', views.add_book, name='add_book'),
    path('edit/<int:id>/', views.edit_book, name='edit_book'),
    path('delete/<int:id>/', views.delete_book, name='delete_book'),
]
