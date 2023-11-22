from django.db import models
import jwt
from django.core.validators import RegexValidator
from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
import random

from datetime import datetime, timedelta


class CustomerManager(BaseUserManager):
    def create_user(self, username, email, password):
        if username is None:
            raise TypeError("Users must have a username.")

        if email is None:
            raise TypeError("Users must have an email address.")

        if password is None:
            raise TypeError("Users must have a password")

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Size(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Customer(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(
        max_length=100,
        unique=True,
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z0-9][a-zA-Z0-9_]*$",
                message=("Invalid username"),
                code="invalid_username",
            ),
        ],
    )
    password = models.CharField(
        max_length=25,
        validators=[
            RegexValidator(
                regex=r"^[A-Za-z\d!@#$%^&*()_+]+$",
                message=("Invalid password"),
                code="invalid_password",
            ),
        ],
    )
    email = models.EmailField(max_length=50, unique=True)

    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = CustomerManager()

    def __str__(self):
        return self.username

    # @property
    # def token(self):
    #     return self._generate_jwt_token()

    # def get_full_name(self):
    #     return self.username

    # def get_short_name(self):
    #     return self.username

    # def _generate_jwt_token(self):
    #     dt = datetime.now() + timedelta(days=1)

    #     token = jwt.encode(
    #         {"id": self.pk, "exp": int((dt - datetime(1970, 1, 1)).total_seconds())},
    #         settings.SECRET_KEY,
    #         algorithm="HS256",
    #     )

    #     return token


class Product(models.Model):
    name = models.CharField(max_length=50)
    mainPrice = models.FloatField()
    salePrice = models.FloatField(editable=False)
    review = models.IntegerField(default=0, editable=False)
    rating = models.FloatField(default=0, editable=False)
    discount = models.BooleanField(default=False)
    discountPercentage = models.IntegerField(default=0)
    size = models.ForeignKey(
        Size, on_delete=models.SET_NULL, default=1, blank=True, null=True
    )
    categories = models.ForeignKey(
        Category, on_delete=models.SET_NULL, default=1, blank=True, null=True
    )
    sku = models.CharField(max_length=13, unique=True, editable=False)
    mainImg = models.CharField(max_length=200)

    def __str__(self):
        return self.name

    def save(self):
        if self.sku == "":
            while True:
                random_num = str(random.randint(10**12, 10**13 - 1))

                if not Product.objects.filter(sku=random_num).exists():
                    self.sku = random_num
                    break

        if self.discount:
            self.salePrice = round(
                self.mainPrice * (1 - (self.discountPercentage / 100)), 2
            )
        else:
            self.salePrice = self.mainPrice

        super(Product, self).save()


class ShippingAddress(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, blank=True, null=True
    )
    firstName = models.CharField(max_length=50, blank=True, null=True)
    secondName = models.CharField(max_length=50, blank=True, null=True)
    streetAddress = models.CharField(max_length=200, null=False)
    region = models.CharField(max_length=200, null=False)
    city = models.CharField(max_length=200, null=False)
    phone = models.CharField(max_length=50, default="", blank=True, null=True)

    def __str__(self):
        return self.streetAddress


class Order(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, blank=True, null=True
    )
    date = models.DateField(auto_now_add=True)
    isCompleted = models.BooleanField(default=False, blank=False)

    def __str__(self):
        return str(self.id)


class OrderItem(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, blank=True, null=True
    )
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    quantity = models.IntegerField(default=0, blank=True, null=True)

    def __str__(self):
        return f"{self.product}, {self.order}"


class Transaction(models.Model):
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    shippingAddress = models.ForeignKey(
        ShippingAddress, on_delete=models.SET_NULL, null=True
    )
    isCompleted = models.BooleanField(default=False)

    def __str__(self):
        return str(self.id)
