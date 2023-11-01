from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["name"]


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ["name"]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["username", "password", "email"]


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "name",
            "price",
            "review",
            "rating",
            "size",
            "categories",
            "sku",
            "image",
        ]


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "customer",
            "first_name",
            "second_name",
            "phone",
            "date",
            "status",
            "transaction_id",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "product",
            "order",
            "quantity",
            "date_added",
        ]


class ShippingAdressesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "customer",
            "order",
            "street_address",
            "region",
            "city",
            "date_added",
        ]
