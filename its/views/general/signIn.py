from django.shortcuts import render, redirect
from django.contrib.auth.models import  auth
from django.contrib import messages



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
