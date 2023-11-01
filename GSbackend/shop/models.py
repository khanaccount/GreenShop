from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Size(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Customer(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=25)
    email = models.EmailField(max_length=50)

    def __str__(self):
        return self.username

    def register(self):
        self.save()


class Product(models.Model):
    title = models.CharField(max_length=50)
    mainPrice = models.FloatField()
    salePrice = models.FloatField()
    review = models.IntegerField()
    rating = models.FloatField()
    discount = models.BooleanField(default=False)
    discountPercentage = models.IntegerField()
    size = models.ForeignKey(
        Size, on_delete=models.SET_NULL, default=1, blank=True, null=True
    )
    categories = models.ForeignKey(
        Category, on_delete=models.SET_NULL, default=1, blank=True, null=True
    )
    sku = models.BigIntegerField(unique=True)
    mainImg = models.ImageField(blank=True, null=True)

    def __str__(self):
        return self.title


class Order(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, blank=True, null=True
    )
    firstName = models.CharField(max_length=50)
    secondName = models.CharField(max_length=50)
    phone = models.CharField(max_length=50, default="", blank=True)
    date = models.DateField(auto_now_add=True)
    status = models.BooleanField(default=False, null=True, blank=False)
    transactionId = models.CharField(max_length=200, null=True)

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


class ShippingAddress(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, blank=True, null=True
    )
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    streetAddress = models.CharField(max_length=200, null=False)
    region = models.CharField(max_length=200, null=False)
    city = models.CharField(max_length=200, null=False)

    def __str__(self):
        return self.streetAddress
