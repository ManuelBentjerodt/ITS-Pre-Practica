from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from ..models import Task, Account
from django.contrib.auth.models import User, auth
from django.contrib import messages



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
            return redirect('general/sign_up')

    else:
        return render(request, 'general/sign_up.html')

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
        return render(request, 'general/sign_in.html')

@login_required(login_url="sign_in")
def sign_out(request):
    auth.logout(request)
    return redirect('sign_in')


def index(request):
    tasks = Task.objects.all()
    context = {
        'tasks': tasks
    }
    return render (request, 'general/index.html', context)