from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


def default_due_date():
    return timezone.now().date() + timedelta(days=14)


class Book(models.Model):
    STATUS_AVAILABLE = 'available'
    STATUS_BORROWED = 'borrowed'
    STATUS_CHOICES = [
        (STATUS_AVAILABLE, 'Available'),
        (STATUS_BORROWED, 'Borrowed'),
    ]

    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_AVAILABLE)

    def __str__(self):
        return self.title


class BorrowRecord(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='borrow_records')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='borrow_records')
    borrowed_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateField(default=default_due_date)
    returned_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ['-borrowed_at']

    def __str__(self):
        return f'{self.user.username} - {self.book.title}'

    @property
    def is_active(self):
        return self.returned_at is None
