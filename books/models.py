from django.db import models
class Book(models.Model):
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    category = models.CharField(max_length=50)
    description = models.TextField()
    status = models.CharField(max_length=20, default="available")

    def __str__(self):
        return self.title
