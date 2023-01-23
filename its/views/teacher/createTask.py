from django.shortcuts import redirect
from django.views import View
from ...models import Task
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator




class CreateTaskView(View):
    @method_decorator(login_required(login_url='sign_in'))
    def get(self, request):
        task = Task()
        task.save()

        return redirect('edit_task', id=task.id)