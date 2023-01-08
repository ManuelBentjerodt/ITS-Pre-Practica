from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views import View
from django.http import JsonResponse, HttpResponseRedirect
from ..models import Task
import json



def teacher_home(request):
    print("llamando a teacher_home")
    tasks = Task.objects.all()
    context = {
        'tasks': tasks,
        'user': request.user
    }
    return render(request, 'teacher_home.html', context)

# @login_required(login_url="sign_in")
# def create_task(request):
#     if request.method == 'GET':
#         task_form = TaskForm()
#         context = {
#             'form': task_form
#         }
#     else:
#         task_form = TaskForm(request.POST, request.FILES)
#         context = {
#             'form': task_form
#         }
#         if task_form.is_valid():
#             task_form.save()
#             return redirect('teacher_home')
            
#     return render (request, 'create_task.html', context)


@login_required(login_url="sign_in")
def delete_task(request, id=None):
    task = Task.objects.get(id = id)
    task.delete()
    return redirect('teacher_home')

class CreateTaskView(View):
    def get(self, request):
        return render (request,'create_task.html')

    def post(self, request):
        jsondata = json.loads(request.body)
        task = Task()
        task.difficulty = float(jsondata['difficulty'])
        task.dcl = jsondata['dclJSON']
        task.sizeFactor = float(jsondata['sizeFactor'])
        task.statement = jsondata['statement']
        task.save()
        return JsonResponse({'success': True, 'redirect': '/teacher_home'})
      
    
        

class EditTaskView(View):
    def get(self, request, id):
        task = Task.objects.get(id = id)
        context = {
            'taskid': task.id,
            'dclJSON': task.dcl,
            'sizeFactor': task.sizeFactor,
            'difficulty': task.difficulty,
            'statement': task.statement
        }
        return render (request,'edit_task.html',context)


    def post(self, request, id):
        jsondata = json.loads(request.body)
        task = Task.objects.get(id = id)
        task.dcl = jsondata['dclJSON']
        task.sizeFactor = float(jsondata['sizeFactor'])
        task.difficulty = float(jsondata['difficulty'])
        task.statement = jsondata['statement']
        task.save()
        return JsonResponse({'success': True, 'redirect': '/teacher_home'})




