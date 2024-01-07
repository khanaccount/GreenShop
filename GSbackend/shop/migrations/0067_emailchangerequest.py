# Generated by Django 4.2.6 on 2024-01-07 09:28

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0066_transaction_transactionid_alter_customer_profileimg'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailChangeRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('newEmail', models.EmailField(max_length=254)),
                ('confirmationKey', models.CharField(max_length=40)),
                ('isConfirmed', models.BooleanField(default=False)),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
