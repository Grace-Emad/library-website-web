from django.db import models
from django.contrib.auth.models import User, AbstractUser


# Create your models here.
class CustomUser(AbstractUser):
    phone = models.CharField(max_length=15, blank=True,null=True)
    from django.db import models

