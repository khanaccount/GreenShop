# Generated by Django 4.2.6 on 2023-12-14 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0035_alter_product_size'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='newArriwals',
            field=models.BooleanField(default=1),
        ),
    ]