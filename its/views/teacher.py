from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views import View
from django.http import JsonResponse, HttpResponseRedirect
from ..models import Task
import json



def teacher_home(request):
    tasks = Task.objects.all()
    context = {
        'tasks': tasks,
        'user': request.user
    }
    return render(request, 'teacher/teacher_home.html', context)


@login_required(login_url="sign_in")
def delete_task(request, id=None):
    task = Task.objects.get(id = id)
    task.delete()
    return redirect('teacher_home')


class CreateTaskView(View):
    def get(self, request):
        task = Task()
        task.save()

        return redirect('edit_task', id=task.id)


class EditTaskView(View):
    def get(self, request, id):
        task = Task.objects.get(id = id)

        if task.image:
            taskImageUrl = task.image.url
        else:
            taskImageUrl = None
        context = {
            'taskid': task.id,
            'dclJSON': task.dcl,
            'sizeFactor': task.sizeFactor,
            'difficulty': task.difficulty,
            'statement': task.statement,
            'imageUrl': taskImageUrl
            
        }
        print()
        print(task.image)
        print()
        return render (request, 'teacher/edit_task.html', context)


    def post(self, request, id):
        task = Task.objects.get(id = id)

        if request.content_type == "application/json":
            jsondata = json.loads(request.body)
            task.dcl = jsondata['dclJSON']
            task.sizeFactor = float(jsondata['sizeFactor'])
            task.difficulty = float(jsondata['difficulty'])
            task.statement = jsondata['statement']

        else:
            task.image = request.FILES['image']

        task.save()

        return JsonResponse({'success': True, 'redirect': '/teacher_home'})
        # return redirect('teacher_home')




