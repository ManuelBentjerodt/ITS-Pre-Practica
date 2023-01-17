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
    
    def compareTo(self,jsonAnswer):
        #otherDcl = json.loads(jsonAnswer)
        print("Esto es la funcion compareTo del TASK\n")
        print("Esto es el json del estudiante: ",jsonAnswer)
        print("\nEsto es el dcl del task: ",self.dcl)

        print("id de dcl correcto: ",self.dcl["id"])
        self.compareNodes(jsonAnswer)

    def recursive(self,studentNode,correctNode):

        for child in self.dcl["childNodes"]:
            self.recursiveFunction(child)
        pass





    def compareNodes(self,studentNode):
        #recorrer un nodo y compararlo con el correcto#
        #luego aplicar la recursividad a sus hijos.
        distance_list = []

        for child in self.dcl["childNodes"]:
            #Estamos en dcl correcto. Vemos la distancia entre el nodo actual y sus hijos 
            #y la guardamos en una lista para luego compararla con el dcl del estudiante

            distanceBetweenNodes = []
            distanceBetweenNodes.append(self.dcl["coordinate"][0]-child["coordinate"][0])
            distanceBetweenNodes.append(self.dcl["coordinate"][1]-child["coordinate"][1])
            distance_list.append(distanceBetweenNodes)
            #self.recursiveFunction(child)

        print("Esto es la lista de distancias: ",distance_list)


        distance_list_student = []

        for chil in studentNode["childNodes"]:
            #Estamos en dcl del estudiante. Vemos la distancia entre el nodo actual y sus hijos 
            #y la guardamos en una lista para luego compararla con el dcl correcto

            distanceBetweenNodes = []
            
            distanceBetweenNodes.append(studentNode["coordinate"][0]-chil["coordinate"][0])
            distanceBetweenNodes.append(studentNode["coordinate"][1]-chil["coordinate"][1])
            distance_list_student.append(distanceBetweenNodes)

            #self.recursiveFunction(child)
        print("Esto es la lista de distancias del estudiante: ",distance_list_student)

        number_of_distances = len(distance_list)
        number_of_distances_student = len(distance_list_student)
        if (number_of_distances > number_of_distances_student):
            print("le falta un nodo")
        elif (number_of_distances < number_of_distances_student):
            print("le sobra un nodo")
        else:
            print("tiene la misma cantidad de nodos, todo bien por aqui")
            
        for distance in distance_list:
            node_in_student = False
            for distance_student in distance_list_student:
                if (distance[0] == distance_student[0] and distance[1] == distance_student[1]):
                    print("Las distancias son iguales")
                    node_in_student = True
                    break
            if (node_in_student == False):
                print("No se encontro el nodo en el estudiante, esta mal situado"))
                pass
           



        



        #hardcoding f
        pass

    
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
    name = models.CharField(max_length=30)
    tasks = models.ManyToManyField(Task, related_name='tags')

    def __str__(self):
        return self.name






