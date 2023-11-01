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
    name = models.CharField(max_length=50)
    price = models.FloatField()
    review = models.IntegerField()
    rating = models.FloatField()
    size = models.ForeignKey(
        Size, on_delete=models.SET_NULL, default=1, blank=True, null=True
    )
    categories = models.ForeignKey(
        Category, on_delete=models.SET_NULL, default=1, blank=True, null=True
    )
    sku = models.BigIntegerField(unique=True)
    image = models.ImageField(blank=True, null=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, blank=True, null=True
    )
    first_name = models.CharField(max_length=50)
    second_name = models.CharField(max_length=50)
    phone = models.CharField(max_length=50, default="", blank=True)
    date = models.DateField(auto_now_add=True)
    status = models.BooleanField(default=False, null=True, blank=False)
    transaction_id = models.CharField(max_length=200, null=True)

    def __str__(self):
        return str(self.id)


class OrderItem(models.Model):
    product = models.ForeignKey(
        Product, on_delete=models.SET_NULL, blank=True, null=True
    )
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    quantity = models.IntegerField(default=0, blank=True, null=True)
    date_added = models.DateField(auto_now_add=True)


class ShippingAddress(models.Model):
    customer = models.ForeignKey(
        Customer, on_delete=models.SET_NULL, blank=True, null=True
    )
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    street_address = models.CharField(max_length=200, null=False)
    region = models.CharField(max_length=200, null=False)
    city = models.CharField(max_length=200, null=False)
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.street_address
