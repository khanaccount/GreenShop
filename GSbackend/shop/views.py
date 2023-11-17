from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.generics import RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView


class CategoryView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "name": output.username,
            }
            for output in Customer.objects.all()
        ]
        return Response(output)


class SizeView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "name": output.username,
            }
            for output in Customer.objects.all()
        ]
        return Response(output)


class CustomerView(APIView):
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     output = [
    #         {
    #             "id": output.id,
    #             "username": output.username,
    #             "email": output.email,
    #         }
    #         for output in Customer.objects.all()
    #     ]
    #     return Response(output)

    def get(self, request):
        customer = request.user
        return Response(CustomerSerializer(customer).data)


class ProductView(APIView):
    def twoNulls(NULL, object, string):
        objectPrice = object.mainPrice if string == "mainPrice" else object.salePrice

        objectPrice = "$" + str(objectPrice)

        if len(objectPrice.split(".")[1]) == 1:
            objectPrice += "0"

        return objectPrice

    def get(self, request):
        output = [
            {
                "id": output.id,
                "name": output.name,
                "mainPrice": self.twoNulls(output, "mainPrice"),
                "salePrice": self.twoNulls(output, "salePrice"),
                "discount": output.discount,
                "discountPercentage": output.discountPercentage,
                "review": output.review,
                "rating": output.rating,
                "size": SizeSerializer(output.size).data,
                "categories": CategorySerializer(output.categories).data,
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        output = [
            {
                "id": output.id,
                "customer": CustomerSerializer(output.customer).data,
                "firstName": output.firstName,
                "secondName": output.secondName,
                "phone": output.phone,
                "date": output.date,
                "isCompleted": output.isCompleted,
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


class CartView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        customer = request.user
        order, created = Order.objects.get_or_create(
            customer=customer, isCompleted=False
        )
        orderItem = order.orderitem_set.all()
        output = [
            {
                "id": output.id,
                "name": ProductSerializer(output.product).data.get("name"),
                "price": ProductSerializer(output.product).data.get("salePrice"),
                "quantity": output.quantity,
            }
            for output in orderItem
        ]
        return Response(output)


class OrderItemView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        output = [
            {
                "id": output.id,
                "product": ProductSerializer(output.product).data,
                "order": OrderSerializer(output.order).data,
                "quantity": output.quantity,
            }
            for output in OrderItem.objects.all()
        ]
        return Response(output)

    def post(self, request):
        customer = request.user
        product = Product.objects.get(id=request.idProduct)
        order, created = Order.objects.get_or_create(
            customer=customer, isCompleted=False
        )

        data = {
            "product": product.pk,
            "order": order.pk,
        }

        serializer = OrderItemSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(data)

    def put(self, request):
        instance = OrderItem.objects.get(id=request.idItem)
        serializer = OrderItemSerializer(data=request.data, instance=instance)

        serializer.is_valid(raise_exception=True)
        serializer.save
        return Response(serializer.data, status=status.HTTP_200_OK)


class ShippingAddressView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "customer": CustomerSerializer(output.customer).data,
                "order": OrderSerializer(output.order).data,
                "streetAddress": output.streetAddress,
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


class RegistrationView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


# class LoginView(APIView):
#     permission_classes = (AllowAny,)

#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)

#         if serializer.is_valid(raise_exception=True):
#             return Response(serializer.data, status=status.HTTP_200_OK)


class CustomerRetrieveUpdateView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        serializer = CustomerEditSerializer(request.user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        serializer = CustomerEditSerializer(
            request.user, data=request.data, partial=True
        )

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super.post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            return response

        if "non_field_errors" in response.data:
            error_message = "Неверный username или password"
            return Response(
                {"errors": [{"error": error_message}]},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return response
