from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from ...models import Task



class TeacherHomeView(View):
    @method_decorator(login_required(login_url='sign_in'))
    def get(self, request):
        tasks = Task.objects.all()
        context = {
            'tasks': tasks,
            'user': request.user
        }
        return render(request, 'teacher/teacher_home.html', context)
    
