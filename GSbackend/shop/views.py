from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.generics import RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import Http404


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

    def get(self, request):
        user = Customer.objects.get(id=request.user)
        output = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        }
        return Response(output)

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
                "review": output.reviewCount,
                "rating": output.rating,
                "size": SizeSerializer(output.size).data,
                "categories": CategorySerializer(output.categories).data,
                "mainImg": output.mainImg,
                "newArriwals": output.newArriwals,
            }
            for output in Product.objects.all()
        ]
        return Response(output)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class ProductCardView(APIView):
    def twoNulls(NULL, object, string):
        objectPrice = object.mainPrice if string == "mainPrice" else object.salePrice

        objectPrice = "$" + str(objectPrice)

        if len(objectPrice.split(".")[1]) == 1:
            objectPrice += "0"

        return objectPrice

    def get(self, request, id):
        try:
            reviews = ReviewSerializer(
                Review.objects.filter(product=id), many=True
            ).data
        except:
            reviews = None
        try:
            product = Product.objects.get(id=id)
        except:
            return Http404("Product not Found")
        data = [
            {
                "id": product.id,
                "name": product.name,
                "salePrice": self.twoNulls(product, "salePrice"),
                "reviewCount": product.reviewCount,
                "rating": product.rating,
                "size": SizeSerializer(product.size).data,
                "categories": CategorySerializer(product.categories).data,
                "sku": product.sku,
                "mainImg": product.mainImg,
                "reviews": reviews,
                "shortDescriptionInfo": product.shortDescriptionInfo,
                "descriptionInfo": product.descriptionInfo,
            }
        ]
        return Response(data)


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        output = [
            {
                "id": output.id,
                "customer": CustomerSerializer(output.customer).data,
                "date": output.date,
                "isCompleted": output.isCompleted,
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
        product = Product.objects.get(id=request.data["product"])
        order, created = Order.objects.get_or_create(
            customer=customer, isCompleted=False
        )

        data = {
            "product": product.pk,
            "order": order.pk,
        }

        if "quantity" in request.data:
            data["quantity"] = request.data["quantity"]

        serializer = OrderItemSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(data)

    def put(self, request, *args, **kwargs):
        try:
            instance = OrderItem.objects.get(id=request.data["idOrderItem"])
        except:
            return Response({"error": "Object does not exists"})

        serializer = OrderItemSerializer(
            data=request.data, instance=instance, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


class ShippingAddressView(APIView):
    def get(self, request):
        output = [
            {
                "id": output.id,
                "customer": CustomerSerializer(output.customer).data,
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


class TransactionViews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        output = [
            {
                "order": OrderSerializer(output.order).data,
                "shippingAddress": ShippingAdressSerializer(
                    output.shippingAddress
                ).data,
            }
            for output in Order.objects.filter(customer=request.user)
        ]
        return Response(output)

    def post(self, request):
        serializer = TransactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            order = Order.objects.get(isCompleted=False, customer=request.user)
            order.isCompleted = True
            order.save()

            serializer.save(order=order)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Order.DoesNotExist:
            return Response({"order": "Order not found"})


class ReviewViews(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        serializer = ReviewSerializer(data=request.data)
        product = Product.objects.get(id=id)
        review = Review.objects.filter(customer=request.user, product=id)
        if review.count() == 0:
            if serializer.is_valid(raise_exception=True):
                serializer.save(customer=request.user, product=product)

                product.update_reviews_info()

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "This user already has a review for this product"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, id):
        try:
            review = Review.objects.get(customer=request.user, product=id)
        except:
            return Response(
                {"error": "Review not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if not request.user == review.customer:
            return Response(
                {"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN
            )

        product = review.product
        review.delete()

        product.update_reviews_info()

        return Response({"message": "Review deleted"}, status=status.HTTP_200_OK)


class FavouritesViews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            favourite = Favourite.objects.get(customer=request.user, product=id)
            return Response(
                {"message": "Product in favourite"}, status=status.HTTP_200_OK
            )
        except:
            return Response(
                {"error": "Product not in favourite"}, status=status.HTTP_404_NOT_FOUND
            )

    def post(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except:
            return Response(
                {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
            )
        customer = request.user

        favourites = Favourite.objects.filter(customer=customer, product=product)
        if favourites.count() == 0:
            data = {"customer": customer.id, "product": product.id}

            serializer = FavouritesSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()

            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Favourites is exists"}, status=status.HTTP_400_BAD_REQUEST
            )

    def delete(self, request, id):
        try:
            product = Product.objects.get(id=id)
        except:
            return Response(
                {"error": "Product is not exists"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            favourites = Favourite.objects.get(product=product)
        except:
            return Response(
                {"error": "Product not in favourites"},
                status=status.HTTP_404_NOT_FOUND,
            )

        favourites.delete()

        return Response({"message": "Favourites deleted"}, status=status.HTTP_200_OK)


class FavouritesGetViews(APIView):
    permission_classes = [IsAuthenticated]

    def productData(self, object):
        data = ProductSerializer(object).data
        dataOutput = {
            "id": data["id"],
            "name": data["name"],
            "mainPrice": data["mainPrice"],
            "salePrice": data["salePrice"],
            "discount": data["discount"],
            "discountPercentage": data["discountPercentage"],
            "mainImg": data["mainImg"],
        }
        return dataOutput

    def get(self, request):
        favourites = Favourite.objects.filter(customer=request.user)

        output = [
            {"product": self.productData(output.product)} for output in favourites
        ]

        return Response(output, status=status.HTTP_200_OK)
