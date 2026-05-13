from django import forms
from django.contrib.auth.forms import UserCreationForm

from .models import CustomUser


class ProfileForm(forms.ModelForm):
    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'phone']


class AdminCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phone = forms.CharField(max_length=15, required=False)

    class Meta(UserCreationForm.Meta):
        model = CustomUser
        fields = ['username', 'email', 'phone', 'password1', 'password2']
