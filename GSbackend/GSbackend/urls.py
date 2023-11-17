from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from shop.views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("shop/size/", SizeView.as_view()),
    path("shop/customer/", CustomerView.as_view()),
    path("shop/product/", ProductView.as_view()),
    path("shop/order/", OrderView.as_view()),
    path("shop/orderItem/", OrderItemView.as_view()),
    path("shop/cart/", CartView.as_view()),
    path("shop/shippingAddress/", ShippingAddressView.as_view()),
    path("shop/edit/", CustomerRetrieveUpdateView.as_view()),
    path("shop/registration/", RegistrationView.as_view()),
    path("shop/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("shop/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("shop/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
