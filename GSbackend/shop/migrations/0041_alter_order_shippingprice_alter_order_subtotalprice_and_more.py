# Generated by Django 4.2.6 on 2023-12-19 20:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0040_alter_orderitem_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='shippingPrice',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='order',
            name='subtotalPrice',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='order',
            name='totalPrice',
            field=models.FloatField(default=0),
        ),
    ]
