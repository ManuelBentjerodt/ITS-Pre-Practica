from django.shortcuts import render
from ...models import Task
from django.views import View
import json
from django.http import JsonResponse
from ...node import * 

class FirstStepView(View):
    def get(self, request, id):
        task = Task.objects.get(id = id)

        try:
            taskImageUrl = task.image.url

        except:
            taskImageUrl = None

        context = {
            'statement': task.statement,
            'imageUrl': taskImageUrl
            }
        return render(request, 'student/steps/firstStep.html', context)

    def post(self, request, id):
        task = Task.objects.get(id = id)

        if request.content_type == "verify/json":
            studentDict = json.loads(request.body)["studentDcl"]
            teacherDict = task.dcl

            studentdcl = recreate_dcl(studentDict)
            teacherdcl = recreate_dcl(teacherDict)
            
            print("studentdcl: ", studentDict)

            nodes_equals = nodes_are_equals(teacherdcl, studentdcl)

            return JsonResponse({'success': nodes_equals['status'], 'redirect': '/student_home', 'errors': nodes_equals['errors']})
            


        return JsonResponse({'success': False, 'redirect': '/teacher_home', 'errors': ['bad request']})
        # return redirect('teacher_home')