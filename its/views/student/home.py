from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required(login_url="sign_in")
def student_home(request):
    context = {
        'probando':  0
    }
    return render(request, 'student/student_home.html', context)