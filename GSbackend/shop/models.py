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
    first_name = models.CharField(name="Имя", max_length=50, null=True, blank=True)
    second_name = models.CharField(name="Фамилия", max_length=50, null=True, blank=True)
    username = models.CharField(name="Логин", max_length=25, unique=True)
    password = models.CharField(name="Пароль", max_length=25)
    email = models.EmailField(name="email", max_length=50, unique=True)

    def __str__(self):
        return self.username

    def register(self):
        self.save()

    def getEmail(self):
        return self.email


class Products(models.Model):
    name = models.CharField(name="Логин", max_length=25)
    price = models.FloatField(default=0, max=1500)
    review = models.IntegerField(default=0)
    rating = models.FloatField(default=0, max=5)
    size = models.ForeignKey(Size, on_delete=models.SET_NULL, default=1)
    categories = models.ForeignKey(Category, on_delete=models.SET_NULL, default=1)
    sku = models.BigIntegerField(unique=True, min=1000000000000, max=9999999999999)
    # image

    def __str__(self):
        return self.name


class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL)
    first_name = models.CharField(max_length=50)
    second_name = models.CharField(max_length=50)
    email = customer.getEmail()
    phone = models.CharField(max_length=50, default="", blank=True)
    date = models.DateField(auto_now_add=True)
    status = models.BooleanField(default=False, null=True, blank=False)
    transaction_id = models.CharField(max_length=200, null=True)

    def __str__(self):
        return self.id


class OrderItem(models.Model):
    product = models.ForeignKey(
        Products, on_delete=models.SET_NULL, blank=True, null=True
    )
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, blank=True, null=True)
    quantity = models.IntegerField(default=0, blank=True, null=True)
    date_added = models.DateField(auto_now_add=True)


class ShippingAddress(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL)
    street_address = models.CharField(max_length=200, null=False)
    region = models.CharField(max_length=200, null=False)
    city = models.CharField(max_length=200, null=False)
    date_added = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.street_address
