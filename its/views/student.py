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
    return render(request, 'student_home.html', context)


def firstStep(request):
    return render(request, 'firstStep.html')

def thirdStep(request):
    return render(request, 'thirdStep.html')
    
def fourthStep(request):
    return render(request, 'fourthStep.html')

def fifthStep(request):
    return render(request, 'fifthStep.html')
