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
        fields = ["id", "username", "email"]


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Если очень хочется в одну строчку:
        # representation["mainPrice"] = "$" + str(representation["mainPrice"]) + "0" if len(str(representation["mainPrice"]).split(".")[1]) == 1 else "$" + str(representation["mainPrice"])
        mainPrice = "$" + str(representation["mainPrice"])
        salePrice = "$" + str(representation["salePrice"])

        if len(mainPrice.split(".")[1]) == 1:
            mainPrice += "0"

        if len(mainPrice.split(".")[1]) == 1:
            mainPrice += "0"

        representation["mainPrice"] = mainPrice
        representation["salePrice"] = salePrice

        return representation


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "id",
            "customer",
            "date",
            "isCompleted",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(default=1)

    class Meta:
        model = OrderItem
        fields = "__all__"

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get("quantity")
        instance.save()
        return instance


class ShippingAdressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = "__all__"


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=128, min_length=8, write_only=True)

    class Meta:
        model = Customer
        fields = "__all__"

    def create(self, validated_data):
        return Customer.objects.create_user(**validated_data)


# class LoginSerializer(serializers.Serializer):
#     username = serializers.CharField(max_length=255)
#     password = serializers.CharField(min_length=8, max_length=128, write_only=True)
#     token = serializers.CharField(max_length=255, read_only=True)

#     def validate(self, data):
#         username = data.get("username", None)
#         password = data.get("password", None)

#         if username is None:
#             raise serializers.ValidationError("An username is required to log in")

#         if password is None:
#             raise serializers.ValidationError("A password is required to log in.")

#         user = authenticate(username=username, password=password)

#         if user is None:
#             raise serializers.ValidationError(
#                 "A user with this username and password was not found."
#             )

#         return {"username": user.username, "token": user.token}


class EmailVerificationSerializer(serializers.ModelSerializer):
    token = serializers.CharField(max_length=256)

    class Meta:
        model = Customer
        fields = ["token"]


# class CustomerEditSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(min_length=8, max_length=128, write_only=True)

#     class Meta:
#         model = Customer
#         fields = ("email", "password")

#     def update(self, instance, validated_data):
#         password = validated_data.pop("password", None)

#         for key, value in validated_data.items():
#             setattr(instance, key, value)

#         if password is not None:
#             instance.set_password(password)

#         instance.save()

#         return instance


class EmailChangeRequestSerializer(serializers.Serializer):
    newEmail = serializers.EmailField()


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = "__all__"


class ReviewSerializer(serializers.ModelSerializer):
    customer = serializers.CharField(source="customer.username", read_only=True)

    class Meta:
        model = Review
        fields = "__all__"


class FavouritesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favourite
        fields = "__all__"


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = "__all__"
