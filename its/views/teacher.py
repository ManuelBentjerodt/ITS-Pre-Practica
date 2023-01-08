from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import Task
from django.contrib.auth.models import User, auth
from django.views import View
import json
from django.http import JsonResponse


@login_required(login_url="sign_in")
def teacher_home(request):
    tasks = Task.objects.all()
    context = {
        'tasks': tasks,
        'user': request.user
    }
    return render(request, 'teacher_home.html', context)


@login_required(login_url="sign_in")
def delete_task(request, id=None):
    task = Task.objects.get(id = id)
    task.delete()
    return redirect('teacher_home')

@login_required(login_url="sign_in")
class CreateTaskView(View):
    @classmethod
    def as_view(cls, **initkwargs):
        def get(self, request):
            context = {
                'taskId': 100
            }
            return render(request, 'create_task.html', context)

        def post(self, request):
            jsondata = json.loads(request.body)
            task = Task()
            task.dcl = jsondata['dclJSON']
            task.sizeFactor = float(jsondata['sizeFactor'])
            task.difficulty = float(jsondata['difficulty'])
            task.save()
            return JsonResponse({'success': True})

@login_required(login_url="sign_in")
class EditTaskView(View):
    def get(self, request, id):
        task = Task.objects.get(id = id)
        context = {
            'dclJSON': task.dcl,
            'sizeFactor': task.sizeFactor,
            'taskId': task.id
        }
        return render (request,'edit_task.html',context)


    def post(self, request, id):
        jsondata = json.loads(request.body)
        print("Request: ", jsondata)
        task = Task.objects.get(id = id)
        task.dcl = jsondata['dclJSON']
        task.sizeFactor = float(jsondata['sizeFactor'])
        task.difficulty = float(jsondata['difficulty'])
        task.save()
        return JsonResponse({'success': True})



