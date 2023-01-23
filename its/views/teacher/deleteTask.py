from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required
from ...models import Task



@login_required(login_url="sign_in")
def delete_task(request, id=None):
    task = Task.objects.get(id = id)
    task.delete()
    return redirect('teacher_home')