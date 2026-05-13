import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models
import books.models


class Migration(migrations.Migration):

    dependencies = [
        ('books', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='status',
            field=models.CharField(choices=[('available', 'Available'), ('borrowed', 'Borrowed')], default='available', max_length=20),
        ),
        migrations.CreateModel(
            name='BorrowRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('borrowed_at', models.DateTimeField(auto_now_add=True)),
                ('due_date', models.DateField(default=books.models.default_due_date)),
                ('returned_at', models.DateTimeField(blank=True, null=True)),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='borrow_records', to='books.book')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='borrow_records', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-borrowed_at'],
            },
        ),
    ]
