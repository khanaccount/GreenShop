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
from django.core.validators import MinValueValidator, MaxValueValidator

import string


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

    class Meta:
        verbose_name_plural = "Categories"


class Size(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class PaymentMethod(models.Model):
    name = models.CharField(max_length=200, unique=True)

    def __str__(self):
        return self.name


def upload_to(instance, filename):
    return "profile_images/{filename}".format(filename=filename)


def upload_to_product(instance, filename):
    return "product_images/{filename}".format(filename=filename)


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
    profileImg = models.ImageField(blank=True, null=True, upload_to=upload_to)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    objects = CustomerManager()

    def __str__(self):
        return self.username


class EmailChangeRequest(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    newEmail = models.EmailField()
    confirmationKey = models.CharField(max_length=40)
    isConfirmed = models.BooleanField(default=False)


class Product(models.Model):
    name = models.CharField(max_length=50)
    mainPrice = models.FloatField()
    salePrice = models.FloatField(editable=False)
    reviewCount = models.IntegerField(default=0, editable=False)
    rating = models.FloatField(default=0, editable=False)
    discount = models.BooleanField(default=False)
    discountPercentage = models.IntegerField(default=0)
    size = models.ManyToManyField(Size)
    categories = models.ForeignKey(
        Category, on_delete=models.CASCADE, default=1, blank=True, null=True
    )
    sku = models.CharField(max_length=13, unique=True, editable=False)
    mainImg = models.ImageField(blank=True, null=True, upload_to=upload_to_product)
    newArriwals = models.BooleanField(default=1)
    shortDescriptionInfo = models.TextField(max_length=1000, null=True)
    descriptionInfo = models.TextField(null=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.sku:
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

    def update_reviews_info(self):
        reviews = Review.objects.filter(product=self)
        reviewCount = reviews.count()
        averageRating = reviews.aggregate(models.Avg("rating"))["rating__avg"]

        self.reviewCount = reviewCount
        self.rating = round(averageRating, 2) if averageRating is not None else 0
        self.save()

    def create_product_quantity(self):
        sizes = self.size.all()

        print(sizes)

        for size in sizes:
            productQuantity = ProductQuantity(product=self, size=size)
            productQuantity.save()


class ShippingAddress(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, blank=True, null=True
    )
    firstName = models.CharField(max_length=50)
    lastName = models.CharField(max_length=50)
    streetAddress = models.CharField(max_length=200, null=False)
    region = models.CharField(max_length=200, null=False)
    city = models.CharField(max_length=200, null=False)
    state = models.CharField(max_length=200, null=True, blank=True)
    phone = models.CharField(max_length=50)

    def __str__(self):
        return self.streetAddress

    class Meta:
        verbose_name_plural = "Shipping Adresses"


class Coupon(models.Model):
    couponCode = models.CharField(editable=False, max_length=16)
    isFreeDelivery = models.BooleanField(default=False)
    isDiscountCoupon = models.BooleanField(default=False)
    discount = models.IntegerField(default=0)
    isActive = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.couponCode}: Discount - {self.discount}; Free delivery - {self.isFreeDelivery}"

    def save(self):
        alphabet = string.ascii_letters + string.digits
        if not self.couponCode:
            while True:
                randomCode = "".join(random.choice(alphabet) for _ in range(16))

                if not Coupon.objects.filter(couponCode=randomCode).exists():
                    self.couponCode = randomCode
                    break

        if not self.isActive:
            ordersWithCoupon = Order.objects.filter(coupon=self, isUsedCoupon=True)
            ordersWithCoupon.update(isUsedCoupon=False, coupon=None)

        super(Coupon, self).save()


class Order(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, blank=True, null=True
    )
    date = models.DateField(auto_now_add=True)
    subtotalPrice = models.FloatField(default=0)
    shippingPrice = models.FloatField(default=0)
    totalPrice = models.FloatField(default=0)
    isUsedCoupon = models.BooleanField(default=False)
    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.CASCADE,
        default=None,
        editable=False,
        blank=True,
        null=True,
    )
    couponDiscount = models.IntegerField(default=1)
    isCompleted = models.BooleanField(default=False, blank=False)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.id)

    def update_prices(self):
        subtotalPrice = (
            OrderItem.objects.filter(order=self).aggregate(
                subtotalPriceSum=models.Sum(
                    models.F("quantity") * models.F("product__salePrice")
                )
            )["subtotalPriceSum"]
            or 0
        )

        print(subtotalPrice)

        # shippingPrice = "${:.2f}".format(subtotalPriceSum * 0.05)
        shippingPrice = (
            5 + subtotalPrice * 0.05
            if OrderItem.objects.filter(order=self).count() != 0
            else 0
        )

        totalPrice = subtotalPrice

        if self.isUsedCoupon:
            if self.coupon.isDiscountCoupon:
                totalPrice = round(totalPrice * (1 - (self.coupon.discount / 100)), 2)
            if self.coupon.isFreeDelivery:
                shippingPrice = 0

        totalPrice += shippingPrice

        self.subtotalPrice = subtotalPrice
        self.shippingPrice = shippingPrice
        self.totalPrice = totalPrice
        self.save()


class OrderItem(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, blank=True, null=True
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, blank=True, null=True)
    quantity = models.IntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(99)]
    )
    size = models.ForeignKey(Size, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return f"{self.product}, {self.order}"


class Transaction(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True)
    shippingAddress = models.ForeignKey(
        ShippingAddress, on_delete=models.CASCADE, null=True
    )
    isCompleted = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)
    paymentMethod = models.ForeignKey(
        PaymentMethod, on_delete=models.CASCADE, default=1, blank=True, null=True
    )
    transactionId = models.CharField(
        max_length=200, blank=True, null=True, default=None
    )

    def __str__(self):
        return str(self.id)


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    text = models.TextField(null=True)
    rating = models.IntegerField(validators=[MaxValueValidator(5)])

    def __str__(self):
        return f"{self.customer.username}: {self.product.name}"


class Favourite(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, null=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"{self.customer.username}: {self.product.name}"


class ProductQuantity(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    size = models.ForeignKey(Size, on_delete=models.CASCADE, null=True)
    quantity = models.IntegerField(
        default=0,
        validators=[MinValueValidator(0)],
    )

    def __str__(self):
        return f"{self.product.name}: {self.quantity} ({self.size.name})"
