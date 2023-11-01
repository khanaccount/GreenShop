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
                "name": output.name,
                "price": output.price,
                "review": output.review,
                "rating": output.rating,
                "size": output.size,
                "categories": output.categories,
                "sku": output.sku,
                "image": output.image,
            }
            for output in Customer.objects.all()
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
                "customer": output.customer,
                "first_name": output.first_name,
                "second_name": output.second_name,
                "phone": output.phone,
                "date": output.date,
                "status": output.status,
                "transaction_id": output.transaction_id,
            }
            for output in Customer.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
