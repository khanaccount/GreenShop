from rest_framework import serializers
from .models import *


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = ["id", "name"]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "username", "password", "email"]


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "mainPrice",
            "salePrice",
            "discount",
            "discountPercentage",
            "review",
            "rating",
            "size",
            "categories",
            "sku",
            "mainImg",
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data["mainPrice"] = "$" + str(round(data["mainPrice"], 2))
        data["salePrice"] = "$" + str(round(data["salePrice"], 2))

        return data


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "firstName",
            "secondName",
            "phone",
            "date",
            "status",
            "transactionId",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            "id",
            "product",
            "order",
            "quantity",
        ]


class ShippingAdressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "order",
            "streetAddress",
            "region",
            "city",
        ]
