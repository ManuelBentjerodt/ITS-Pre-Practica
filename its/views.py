from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Task, Account, TaskPerAccount
from .forms import TaskForm, TaskFormDraw
from django.contrib.auth.models import User, auth
from django.contrib import messages

# Create your views here.


def sign_up(request):
    if request.method == 'POST':

        # username = request.POST.get("username")
        username = request.POST["username"]
        email = request.POST['email']
        password = request.POST['password']
        password2 = request.POST['password2']

        if password == password2:
            if User.objects.filter(email=email).exists():
                messages.info(request, 'Email ya existe')
                return redirect('sign_up')

            else:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                )
                user.save()

                user_login = auth.authenticate(
                    username=username,
                    email=email,
                    password=password
                )
                auth.login(request, user_login)

                user_model = User.objects.get(email=email)
                new_profile = Account.objects.create(user=user_model, id=user_model.id, email=email)

                new_profile.save()

                return redirect('sign_in')

        else:
            messages.info(request, 'Las contraseñas no coinciden')
            return redirect('sign_up')

    else:
        return render(request, 'sign_up.html')

def sign_in(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']

        user = auth.authenticate(username=username, password=password)

        if user:
            auth.login(request, user)
            if username == "teacher":
                return redirect('teacher_home')
            else:
                return redirect('student_home')
        else:
            messages.info(request, 'Credenciales inválidas')
            return redirect('sign_in')

    else:
        return render(request, 'sign_in.html')

@login_required(login_url="sign_in")
def sign_out(request):
    auth.logout(request)
    return redirect('sign_in')

@login_required(login_url="sign_in")
def teacher_home(request):
    tasks = Task.objects.all()
    context = {
        'tasks': tasks
    }
    return render(request, 'teacher_home.html', context)

@login_required(login_url="sign_in")
def student_home(request):
    context = {
        'probando':  0
    }
    return render(request, 'student_home.html', context)

def index(request):
    tasks = Task.objects.all()
    context = {
        'tasks': tasks
    }
    return render (request, 'index.html', context)

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

