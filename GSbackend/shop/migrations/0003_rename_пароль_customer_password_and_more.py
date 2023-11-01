# Generated by Django 4.2.6 on 2023-11-01 17:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_rename_products_product_remove_customer_имя_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customer',
            old_name='Пароль',
            new_name='password',
        ),
        migrations.RemoveField(
            model_name='customer',
            name='Логин',
        ),
        migrations.AddField(
            model_name='customer',
            name='username',
            field=models.CharField(default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='customer',
            name='email',
            field=models.EmailField(max_length=50),
        ),
    ]
