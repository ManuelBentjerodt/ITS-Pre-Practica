from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import Task, Account, TaskPerAccount
from ..forms import TaskForm, TaskFormDraw
from django.contrib.auth.models import User, auth
from django.contrib import messages


@login_required(login_url="sign_in")
def teacher_home(request):
    tasks = Task.objects.all()
    context = {
        'tasks': tasks,
        'user': request.user
    }
    return render(request, 'teacher_home.html', context)

@login_required(login_url="sign_in")
def create_task(request):
    if request.method == 'GET':
        task_form = TaskForm()
        context = {
            'form': task_form
        }
    else:
        task_form = TaskForm(request.POST, request.FILES)
        context = {
            'form': task_form
        }
        if task_form.is_valid():
            task_form.save()
            return redirect('teacher_home')
            
    return render (request, 'create_task.html', context)


@login_required(login_url="sign_in")
def delete_task(request, id=None):
    task = Task.objects.get(id = id)
    task.delete()
    return redirect('teacher_home')


@login_required(login_url="sign_in")
def edit_task(request, id):
    task = Task.objects.get(id = id)
    if request.method == 'GET':
        task_form = TaskForm(instance = task)
        context = {
            'form': task_form,
            'dclJSON': task.dcl
        }
    else:
        task_form = TaskForm(request.POST, request.FILES , instance = task)
        context = {
            'form':task_form
        }
        if task_form.is_valid():
            task_form.save()
            return redirect('teacher_home')
    return render (request,'edit_task.html',context)
