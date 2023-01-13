from django.db import models
from django.contrib.auth import get_user_model


def upload_image(instance, file_name):
    extension = file_name.split('.')[-1]
    return f"static/images/taskImages/{instance.id}.{extension}"


User = get_user_model()

# Create your models here.

class Task(models.Model):
    id = models.AutoField(primary_key=True)
    dcl = models.JSONField(null=True, blank=True)
    created = models.DateTimeField( auto_now_add=True, blank=True, null=True)
    statement = models.TextField(null=True)
    image = models.ImageField(null=True,blank = True, upload_to = upload_image)
    difficulty = models.FloatField(max_length=20, null=True)
    sizeFactor = models.FloatField(max_length=20, null=True)
    
class Account(models.Model):
    id = models.IntegerField(default=0, primary_key=True)
    email = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    
class TaskPerAccount(models.Model):
    id = models.AutoField(primary_key=True)
    task = models.ForeignKey(Task,on_delete=models.CASCADE)
    account = models.ForeignKey(Account,on_delete=models.CASCADE)
    