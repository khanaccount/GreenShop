from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.response import Response


class CategoryView(APIView):
    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class SizeView(APIView):
    def post(self, request):
        serializer = SizeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class CustomerView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "username": output.username,
                "password": output.password,
                "email": output.email,
            }
            for output in Customer.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class ProductView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "title": output.name,
                "mainPrice": output.mainPrice,
                "salePrice": output.salePrice,
                "discount": output.discount,
                "discountPercentage": output.discountPercentage,
                "review": output.review,
                "rating": output.rating,
                "size": output.size,
                "categories": output.categories,
                "sku": output.sku,
                "mainImg": output.mainImg,
            }
            for output in Product.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class OrderView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "customer": output.customer,
                "firstName": output.firstName,
                "secondName": output.secondName,
                "phone": output.phone,
                "date": output.date,
                "status": output.status,
                "transactionId": output.transactionId,
            }
            for output in Order.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class OrderItemView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "product": output.product,
                "order": output.order,
                "quantity": output.quantity,
            }
            for output in OrderItem.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = OrderItemSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class ShippingAddressView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "customer": output.customer,
                "order": output.order,
                "streetAddress": output.streetAdress,
                "region": output.region,
                "city": output.city,
            }
            for output in ShippingAddress.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = ShippingAdressSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
