from django.shortcuts import render
from ...models import Task
from django.views import View
import json
from django.http import JsonResponse
from ...node import * 

class FirstStepView(View):
    def get(self, request, id):
        task = Task.objects.get(id = id)

        context = {
            'statement': task.statement,
            'imageUrl': task.image.url
            }
        return render(request, 'student/steps/firstStep.html', context)

    def post(self, request, id):
        task = Task.objects.get(id = id)

        if request.content_type == "verify/json":
            studentDict = json.loads(request.body)["studentDcl"]
            teacherDict = task.dcl

            studentdcl = recreate_dcl(studentDict)
            teacherdcl = recreate_dcl(teacherDict)
            
            print(graphs_are_equal(teacherdcl, studentdcl))


        return JsonResponse({'success': True, 'redirect': '/teacher_home'})
        # return redirect('teacher_home')