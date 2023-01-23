from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views import View
from django.http import JsonResponse
from ...models import Task
from django.conf import settings
import json
import os



class EditTaskView(View):
    @login_required(login_url="sign_in")
    def get(self, request, id):
        task = Task.objects.get(id = id)

        try: 
            taskImageUrl = task.image.url

        except:
            taskImageUrl = None

        context = {
            'taskid': task.id,
            'dclJSON': task.dcl,
            'sizeFactor': task.sizeFactor,
            'difficulty': task.difficulty,
            'statement': task.statement,
            'imageUrl': taskImageUrl
            
        }

        return render (request, 'teacher/edit_task.html', context)

    @login_required(login_url="sign_in")
    def post(self, request, id):
        task = Task.objects.get(id = id)

        if request.content_type == "application/json":
            jsondata = json.loads(request.body)
            task.dcl = jsondata['dclJSON']
            task.sizeFactor = float(jsondata['sizeFactor'])
            task.difficulty = float(jsondata['difficulty'])
            task.statement = jsondata['statement']
            task.save()

            return JsonResponse({'success': True, 'redirect': '/teacher_home'})

        else:
            task.image = request.FILES['image']
            task.save()
            
            return JsonResponse({'success': True})


    def delete(self, request, id): # delete image
        task = Task.objects.get(id = id)

        try:
            image_path = os.path.join(settings.MEDIA_ROOT, task.image.path)
            os.remove(image_path)
            task.image = None

        except:
            pass
        
        task.save()

        return JsonResponse({'success': True})

