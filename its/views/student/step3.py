from django.shortcuts import render
from ...models import Task
from django.views import View
import json
from django.http import JsonResponse
from ...node import * 

class ThirdStepView(View):
    def get(self, request, id):
        task = Task.objects.get(id = id)

        context = {
            'statement': task.statement,
            'correctDcl': task.dcl,
            }
        return render(request, 'student/steps/thirdStep.html', context)

    def post(self, request, id):
        task = Task.objects.get(id = id)

        if request.content_type == "verify/json":
            studentDict = json.loads(request.body)["studentDcl"]
            teacherDict = task.dcl

            studentdcl = recreate_dcl(studentDict)
            teacherdcl = recreate_dcl(teacherDict)
            print("teacherdcl: ", teacherdcl)
            print("studentdcl: ", studentdcl)
            
            if veryfy_step_3(teacherdcl, studentdcl)["status"]:
                print("correcto")
                return JsonResponse({'success': True, 'redirect': '/student_home'})
            else:
                print("incorrecto")
                for error in veryfy_step_3(teacherdcl, studentdcl)["errors"]:
                    print(error)
                return JsonResponse({'success': False, 'redirect': '/student_home'})

    
        # return redirect('teacher_home')