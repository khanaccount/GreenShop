from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from shop.views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", OrderView.as_view()),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
