from django.db import models
from django.contrib.auth import get_user_model




User = get_user_model()

# Create your models here.

class Task(models.Model):
    id = models.AutoField(primary_key=True)
    dcl = models.JSONField(null=True, blank = True)
    date = models.CharField(max_length=20, null=True)
    statement = models.TextField(null=True)
    image = models.ImageField(null=True,blank = True,upload_to = "images/taskImages/")
    difficulty = models.JSONField(null=True, blank = True)
    dimension = models.JSONField(null=True, blank = True)


class Account(models.Model):
    id = models.IntegerField(default=0, primary_key=True)
    email = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    
class TaskPerAccount(models.Model):
    id = models.AutoField(primary_key=True)
    task = models.ForeignKey(Task,on_delete=models.CASCADE)
    account = models.ForeignKey(Account,on_delete=models.CASCADE)
    