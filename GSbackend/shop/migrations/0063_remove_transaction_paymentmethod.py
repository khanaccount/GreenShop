# Generated by Django 4.2.6 on 2024-01-06 12:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0062_alter_transaction_paymentmethod'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='paymentMethod',
        ),
    ]
