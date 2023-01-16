from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import Task, Account, TaskPerAccount
from ..forms import TaskForm, TaskFormDraw
from django.contrib.auth.models import User, auth
from django.contrib import messages



@login_required(login_url="sign_in")
def student_home(request):
    context = {
        'probando':  0
    }
    return render(request, 'student/student_home.html', context)


def firstStep(request, id=None):
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
    return render(request, 'student/steps/firstStep.html', context)

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
