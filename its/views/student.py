from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import Task, Account, TaskPerAccount
from ..forms import TaskForm, TaskFormDraw
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.views import View
import json
from django.http import JsonResponse
from ..node import * 

@login_required(login_url="sign_in")
def student_home(request):
    context = {
        'probando':  0
    }
    return render(request, 'student/student_home.html', context)


class FirstStepView(View):
    def get(self, request, id):
        task = Task.objects.get(id = id)

        context = {
            'statement': task.statement,
            'studentDcl':"",
            }
        return render(request, 'student/steps/firstStep.html', context)

    def post(self, request, id):
        task = Task.objects.get(id = id)

        if request.content_type == "verify/json":
            studentDict = json.loads(request.body)["studentDcl"]
            teacherDict = task.dcl

            studentdcl = recreate_dcl(studentDict)
            teacherdcl = recreate_dcl(teacherDict)
            
            print(graphs_are_equal(teacherdcl, studentdcl))


        return JsonResponse({'success': True, 'redirect': '/teacher_home'})
        # return redirect('teacher_home')


def secondStep(request, id=None):
    task = Task.objects.get(id = id)
    context = {
        'task': task
    }
    return render(request, 'student/steps/secondStep.html', context)

def thirdStep(request, id=None):
    task = Task.objects.get(id = id)

    try: 
        taskImageUrl = task.image.url

    except:
        taskImageUrl = None

    context = {
        'taskId': task.id,
        'statement': task.statement,
        'correctDcl': task.dcl,
        'imageUrl': taskImageUrl,
    }
    return render(request, 'student/steps/thirdStep.html', context)
    
def fourthStep(request, id=None):
    task = Task.objects.get(id = id)
    context = {
        'task': task
    }
    return render(request, 'student/steps/fourthStep.html', context)

def fifthStep(request, id=None):
    task = Task.objects.get(id = id)
    context = {
        'task': task
    }
    return render(request, 'student/steps/fifthStep.html', context)
