from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from shop.views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    path("shop/size/", SizeView.as_view()),
    path("shop/customer/", CustomerView.as_view()),
    path("shop/product/", ProductView.as_view()),
    path("shop/order/", OrderView.as_view()),
    path("shop/orderItem/", OrderItemView.as_view()),
    path("shop/shippingAddress/", ShippingAddressView.as_view()),
    path("shop/registration/", RegistrationView.as_view()),
    path("shop/login/", LoginView.as_view()),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
