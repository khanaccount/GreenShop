from django.shortcuts import render
from rest_framework.views import APIView
from .models import *
from .serializer import *
from rest_framework.generics import RetrieveUpdateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.http import Http404

from .utils import Util

from django.conf import settings


class CategoryView(APIView):
    def get(self, request):
        # Получение списка размеров и их преобразование в json
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
        # Получение списка размеров и их преобразование в json
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
        # Получение данных о текущем пользователе
        customer = request.user
        order, created = Order.objects.get_or_create(
            customer=customer, isCompleted=False
        )

        orderItem = order.orderitem_set.all()

        # Преобразование в json
        output = {
            "id": customer.id,
            "username": customer.username,
            "email": customer.email,
            "cartCount": orderItem.count(),
        }
        return Response(output)


class ProductView(APIView):
    def get(self, request):
        # Получение списка продуктов и их преобразование в json
        output = [
            {
                "id": output.id,
                "name": output.name,
                "mainPrice": "${:.2f}".format(output.mainPrice),
                "salePrice": "${:.2f}".format(output.salePrice),
                "discount": output.discount,
                "discountPercentage": output.discountPercentage,
                "review": output.reviewCount,
                "rating": output.rating,
                "size": SizeSerializer(output.size, many=True).data,
                "categories": CategorySerializer(output.categories).data,
                "mainImg": output.mainImg,
                "newArriwals": output.newArriwals,
            }
            for output in Product.objects.all()
        ]
        return Response(output)

    def post(self, request):
        # Создание нового продукта
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            Product.create_product_quantity(serializer.instance)
            return Response(serializer.data)


class ProductCardView(APIView):
    def get(self, request, id):
        # Получение данных о конкретном продукте и его отзывах
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

        productQuantity = ProductQuantity.objects.filter(product=product)
        size = [
            {
                "id": sizeQuantity.size.id,
                "name": sizeQuantity.size.name,
                "quantity": sizeQuantity.quantity,
            }
            for sizeQuantity in productQuantity
        ]

        # Преобразование в json
        data = [
            {
                "id": product.id,
                "name": product.name,
                "salePrice": "${:.2f}".format(product.salePrice),
                "reviewCount": product.reviewCount,
                "rating": product.rating,
                "size": size,
                "categories": CategorySerializer(product.categories).data,
                "sku": product.sku,
                "mainImg": product.mainImg,
                "reviews": reviews,
                "shortDescriptionInfo": product.shortDescriptionInfo,
                "descriptionInfo": product.descriptionInfo,
            }
        ]

        if request.user.is_authenticated:
            order, created = Order.objects.get_or_create(
                customer=request.user, isCompleted=False
            )

            orderItem = OrderItem.objects.filter(order=order, product=product.id)
            print(orderItem.count())

            sizeInCart = [
                {
                    "id": SizeSerializer(output.size).data["id"],
                    "name": SizeSerializer(output.size).data["name"],
                }
                for output in orderItem
            ]
            data[0]["inCart"] = sizeInCart

        return Response(data)


class OrderView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Получение списка заказов и их преобразование в json
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
        # Создание нового заказа
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class CartView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Получение данных о корзине нынешнего пользователя
        customer = request.user
        order, created = Order.objects.get_or_create(
            customer=customer, isCompleted=False
        )
        orderItem = order.orderitem_set.all()

        # Преобразование в json
        output = [
            {
                "id": output.id,
                "idProduct": ProductSerializer(output.product).data.get("id"),
                "name": ProductSerializer(output.product).data.get("name"),
                "price": ProductSerializer(output.product).data.get("salePrice"),
                "quantity": output.quantity,
                "mainImg": ProductSerializer(output.product).data.get("mainImg"),
                "totalPrice": "${:.2f}".format(
                    output.quantity * output.product.salePrice
                ),
                "sku": ProductSerializer(output.product).data.get("sku"),
                "size": SizeSerializer(output.size).data,
            }
            for output in orderItem
        ]
        pricesCart = {
            "subtotalPrice": "${:.2f}".format(order.subtotalPrice),
            "shippingPrice": "${:.2f}".format(order.shippingPrice),
            "totalPrice": "${:.2f}".format(order.totalPrice),
            "isUsedCoupon": order.isUsedCoupon,
        }

        if order.coupon:
            pricesCart["isFreeDelivery"] = order.coupon.isFreeDelivery
            pricesCart["isDiscountCoupon"] = order.coupon.isDiscountCoupon
            pricesCart["couponDiscount"] = "${:.2f}".format(
                order.subtotalPrice - order.totalPrice + order.shippingPrice
            )
        else:
            pricesCart["isFreeDelivery"] = False
            pricesCart["isDiscountCoupon"] = False
            pricesCart["couponDiscount"] = "0.00$"
        return Response({"prices": pricesCart, "output": output})


class OrderItemView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        # Получение списка позиций заказа и их преобразование в json
        output = [
            {
                "id": output.id,
                "product": ProductSerializer(output.product).data,
                "order": OrderSerializer(output.order).data,
                "quantity": output.quantity,
                "size": SizeSerializer(output.size).data,
            }
            for output in OrderItem.objects.all()
        ]
        return Response(output)

    def post(self, request, id):
        # Добавление новой позиции в заказ
        customer = request.user
        product = Product.objects.get(id=id)
        order, created = Order.objects.get_or_create(
            customer=customer, isCompleted=False
        )

        data = {
            "product": product.pk,
            "order": order.pk,
        }

        if "quantity" in request.data:
            quantity = request.data["quantity"]
            if quantity <= 0 or quantity >= 100:
                return Response(
                    {"error": "Invalid quntity value"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            else:
                data["quantity"] = quantity

        if "size" in request.data:
            size = request.data["size"]
            if product.size.filter(id=size).exists():
                data["size"] = size
            else:
                return Response(
                    {"error": "Invalid size for the product"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"error": "Write a size"}, status=status.HTTP_406_NOT_ACCEPTABLE
            )

        if OrderItem.objects.filter(product=product, size=size, order=order).exists():
            return Response(
                {"error": "Product is exists on cart"},
                status=status.HTTP_406_NOT_ACCEPTABLE,
            )

        serializer = OrderItemSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            order.update_prices()
            return Response(data, status=status.HTTP_200_OK)

    def put(self, request, id, *args, **kwargs):
        # Обновление данных о позиции заказа, в частности, о количестве единиц продукта
        order, created = Order.objects.get_or_create(
            customer=request.user, isCompleted=False
        )

        try:
            orderItem = OrderItem.objects.get(
                product=id, order=order, size=request.data["size"]
            )
        except:
            return Response(
                {"error": "Order does not exists"}, status=status.HTTP_404_NOT_FOUND
            )

        if "quantity" in request.data:
            quantity = request.data["quantity"]
            if quantity <= 0 or quantity >= 100:
                return Response({"error": "Invalid quntity value"})

        serializer = OrderItemSerializer(
            data=request.data, instance=orderItem, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        Order.update_prices(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, id):
        # Удаление позиции из заказа
        order, created = Order.objects.get_or_create(
            customer=request.user, isCompleted=False
        )

        try:
            orderItem = OrderItem.objects.get(
                product=id, order=order, size=request.data["size"]
            )
        except:
            return Response(
                {"error": "Order does not exists"}, status=status.HTTP_404_NOT_FOUND
            )

        orderItem.delete()

        if OrderItem.objects.filter(order=order).count() == 0:
            order.isUsedCoupon = False
            order.coupon = None
            order.save()
        order.update_prices()

        return Response({"message": "Order deleted"}, status=status.HTTP_200_OK)


class ShippingAddressView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Получение списка адресов доставки пользователя
        output = [
            {
                "id": output.id,
                "firstName": output.firstName,
                "lastName": output.lastName,
                "customer": CustomerSerializer(output.customer).data,
                "phone": output.phone,
                "state": output.state,
                "streetAddress": output.streetAddress,
                "region": output.region,
                "city": output.city,
            }
            for output in ShippingAddress.objects.filter(customer=request.user)
        ]
        return Response(output)

    def post(self, request):
        # Добавление нового адреса доставки
        shippingAddresses = ShippingAddress.objects.filter(customer=request.user)

        if shippingAddresses.count() < 3:
            serializer = ShippingAdressSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(customer=request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "More then three addresses"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request):
        try:
            shippingAddress = ShippingAddress.objects.get(
                id=request.data["shippingAddress"]
            )
        except:
            return Response(
                {"error": "Shipping address not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        shippingAddress.delete()

        return Response({"message": "Success deleted"}, status=status.HTTP_200_OK)


class RegistrationView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        # Регистрация нового пользователя
        serializer = RegistrationSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        serializer.save()

        customer = Customer.objects.get(username=serializer.data["username"])
        tokens = RefreshToken.for_user(customer).access_token

        current_site = get_current_site(request).domain
        relative_link = reverse("email-verify")

        absurl = "http://" + current_site + relative_link + "?token=" + str(tokens)
        email_body = (
            "Hi "
            + customer.username
            + " Use the link below to verify your email \n"
            + absurl
        )

        data = {
            "email_body": email_body,
            "to_email": customer.email,
            "email_subject": "Verify your email",
        }

        Util.send_email(data=data)

        return Response(
            {
                "user_data": CustomerSerializer(customer).data,
                "access_token": str(tokens),
            },
            status=status.HTTP_201_CREATED,
        )


class VerifyEmail(APIView):
    serializer_class = EmailVerificationSerializer

    def get(self, request):
        token = request.GET.get("token")

        try:
            payload = jwt.decode(token, options={"verify_signature": False})
            customer = Customer.objects.get(id=payload["user_id"])
            if not customer.is_active:
                customer.is_active = True
                customer.save()
            return Response(
                {"email": "Successfully activated"}, status=status.HTTP_200_OK
            )
        except jwt.ExpiredSignatureError as identifier:
            return Response(
                {"error": "Activation Expired"}, status=status.HTTP_400_BAD_REQUEST
            )
        except jwt.exceptions.DecodeError as identifier:
            return Response(
                {"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )


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
        # Обновление данных о текущем пользователе
        serializer = CustomerEditSerializer(
            request.user, data=request.data, partial=True
        )

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)


class TransactionViews(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Получение данных о транзакциях пользователя и их преобразование в json
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
        # Создание новой транзакции
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
        # Добавление нового отзыва к продукту
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
        # Удаление отзыва пользователя о продукте
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
        # Добавление товара в избранное

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
        # Удаление товара из избранного

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
        # Преобразование данных в json
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
        # Получение всех избранных товаров
        favourites = Favourite.objects.filter(customer=request.user)

        output = [
            {"product": self.productData(output.product)} for output in favourites
        ]

        return Response(output, status=status.HTTP_200_OK)


class CouponViews(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            coupon = Coupon.objects.get(couponCode=request.data["couponCode"])
        except:
            return Response(
                {"error": "Incorrect coupon"}, status=status.HTTP_404_NOT_FOUND
            )

        try:
            order, created = Order.objects.get_or_create(
                customer=request.user, isCompleted=False
            )
        except:
            return Response({"error": "error"}, status=status.HTTP_406_NOT_ACCEPTABLE)

        if order.isUsedCoupon == True:
            return Response(
                {"error": "The coupon is already in use"},
                status=status.HTTP_403_FORBIDDEN,
            )

        if coupon.isActive == True:
            order.isUsedCoupon = True
            order.coupon = coupon
            order.save()
            order.update_prices()
            return Response(CouponSerializer(coupon).data, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid coupon"}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request):
        try:
            order, create = Order.objects.get_or_create(
                customer=request.user, isCompleted=False
            )
        except:
            return Response({"error": "error"}, status=status.HTTP_404_NOT_FOUND)

        if not order.isUsedCoupon:
            return Response(
                {"message": "The coupon is not used"}, status=status.HTTP_404_NOT_FOUND
            )

        order.isUsedCoupon = False
        order.coupon = None

        order.save()
        order.update_prices()

        return Response(
            {"message": "Coupon is deleted from order"}, status=status.HTTP_200_OK
        )


class ProductCarousel(APIView):
    def get(self, request):
        products = Product.objects.order_by("?")[:15]

        output = [
            {
                "id": output.id,
                "name": output.name,
                "mainPrice": "${:.2f}".format(output.mainPrice),
                "salePrice": "${:.2f}".format(output.salePrice),
                "discount": output.discount,
                "discountPercentage": "{}%".format(output.discountPercentage),
                "mainImg": output.mainImg,
            }
            for output in products
        ]

        return Response(output, status=status.HTTP_200_OK)
