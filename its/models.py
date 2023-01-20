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
    

    def save(self, *args, **kwargs):
        super(Task, self).save(*args, **kwargs)
        self.updateTags()

    def updateTags(self):
        if (self.dcl):
            self.tags.clear()
            print("DLC: ",self.dcl)
            origin_coords = self.dcl["coordinate"]

            ##Tags para el padre##
            self.addForceTag(self.dcl)
            self.addMomentTag(self.dcl)
            self.addLinkTag(self.dcl)
            

            ##Tags para los hijos##
            self.recursive(self.dcl,origin_coords)
            

    def recursive(self,dcl,coords):
        
        for child in dcl["childNodes"]:
            self.addForceTag(child)
            self.addMomentTag(child)
            self.addLinkTag(child)
            self.addSlopeTag(child,coords)
            self.recursive(child,coords)
    

    def addMomentTag(self,child):
        if (child["moments"]):	
            tag, create = Tag.objects.get_or_create(name="momento")
            self.tags.add(tag)
            
    
    def addForceTag(self,child):
        if (child["forces"]):
            for force in child["forces"]:
                if ((force[1] % 90) != 0):
                    tag, create = Tag.objects.get_or_create(name="fuerza con angulo")
                    self.tags.add(tag)
                else:
                    tag, create = Tag.objects.get_or_create(name="fuerza con angulo recto")
                    self.tags.add(tag)

    def addLinkTag(self,child):
        if (child["link"]):
            if (child["link"] == "pinnedSupport" or child["link"] == "rollerSupport"):
                tag, create = Tag.objects.get_or_create(name="apoyos simples")
                self.tags.add(tag)
            if (child["link"] == "fixedSupport"):
                tag, create = Tag.objects.get_or_create(name="empotrado")
                self.tags.add(tag)

            if (child["linkRotation"] != "0"):
                tag, create = Tag.objects.get_or_create(name="apoyos con angulo")
                self.tags.add(tag)

    def addSlopeTag(self,child,coords):
        if (child["coordinate"][1] - coords[1] != 0 and (child["moments"] or child["forces"] or child["link"])): 
            tag, create = Tag.objects.get_or_create(name="desnivel")
            self.tags.add(tag)




    
class Account(models.Model):
    id = models.IntegerField(default=0, primary_key=True)
    email = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    
class TaskPerAccount(models.Model):
    id = models.AutoField(primary_key=True)
    task = models.ForeignKey(Task,on_delete=models.CASCADE)
    account = models.ForeignKey(Account,on_delete=models.CASCADE)
    
class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)
    tasks = models.ManyToManyField(Task, related_name='tags')

    def __str__(self):
        return self.name






