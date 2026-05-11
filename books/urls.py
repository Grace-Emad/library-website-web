from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('search/', views.search_books, name='search'),
    path('book/<int:pk>/', views.book_details, name='book_detail'),
    path('borrowed_books/', views.user_borrowed, name='borrowed_books'),
    path('admin/books/', views.admin_books, name='admin_books'),
    path('admin/book/add/', views.add_book, name='add_book'),
    path('admin/book/<int:book_id>/edit/', views.edit_book, name='edit_book')

]
