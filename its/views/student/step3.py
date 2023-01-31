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
            realDclTeacher = convert_to_real_dcl(teacherDict)
            studentdcl = recreate_dcl(studentDict)
            # print(realDclTeacher)
            # print("*")
            # print(request.body)

            # print(studentdcl)
            verify = verify_step_3(realDclTeacher, studentdcl)

            return JsonResponse({'success': verify['status'], 'redirect': '/student_home'})
    
        # for error in verify_step_3(realDclTeacher, studentdcl)["errors"]:
        #     # print(error)
        #     pass

        return JsonResponse({'success': False, 'redirect': '/student_home'})



def convert_to_real_dcl(dcl):
    dcl = recreate_dcl(dcl)
    all_nodes = list(dcl.get_all_descendants())
    
    for node in all_nodes:
        if node.link:
            angle = float(node.linkRotation)
            if node.link == "fixedSupport" or node.link == "pinnedSupport":
                if angle == 0:
                    node.step3["axisXsupport"].append(["+", "Rx", None])
                    node.step3["axisYsupport"].append(["+", "Ry", None])
                
                elif 0 < angle < 90:
                    node.step3["axisXsupport"].append(["+", "Rx", f"cos({pretty_angle(node.linkRotation)})"])
                    node.step3["axisXsupport"].append(["+", "Ry", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["-", "Rx", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["+", "Ry", f"cos({pretty_angle(node.linkRotation)})"])
                
                elif angle == 90:
                    node.step3["axisXsupport"].append(["+", "Ry", None])
                    node.step3["axisYsupport"].append(["-", "Rx", None])
                
                elif 90 < angle < 180:
                    node.step3["axisXsupport"].append(["-", "Rx", f"cos({pretty_angle(node.linkRotation)})"])
                    node.step3["axisXsupport"].append(["+", "Ry", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["-", "Rx", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["-", "Ry", f"cos({pretty_angle(node.linkRotation)})"])
                
                elif angle == 180:
                    node.step3["axisXsupport"].append(["-", "Rx", None])
                    node.step3["axisYsupport"].append(["-", "Ry", None])
                
                elif 180 < angle < 270:
                    node.step3["axisXsupport"].append(["-", "Rx", f"cos({pretty_angle(node.linkRotation)})"])
                    node.step3["axisXsupport"].append(["-", "Ry", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["+", "Rx", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["-", "Ry", f"cos({pretty_angle(node.linkRotation)})"])
                
                elif angle == 270:
                    node.step3["axisXsupport"].append(["-", "Ry", None])
                    node.step3["axisYsupport"].append(["+", "Rx", None])

                elif 270 < angle < 360:
                    node.step3["axisXsupport"].append(["+", "Rx", f"cos({pretty_angle(node.linkRotation)})"])
                    node.step3["axisXsupport"].append(["+", "Ry", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["-", "Rx", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["+", "Ry", f"cos({pretty_angle(node.linkRotation)})"])

                if node.link == "fixedSupport":
                    node.step3["momentsSupport"].append("Rm")

            elif node.link == "rollerSupport":
                if angle == 0:
                    node.step3["axisYsupport"].append(["+", "Ry", None])
                
                elif 0 < angle < 90:
                    node.step3["axisXsupport"].append(["+", "Ry", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["+", "Ry", f"cos({pretty_angle(node.linkRotation)})"])
                
                elif angle == 90:
                    node.step3["axisXsupport"].append(["+", "Ry", None])
                
                elif 90 < angle < 180:
                    node.step3["axisXsupport"].append(["+", "Ry", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["-", "Ry", f"cos({pretty_angle(node.linkRotation)})"])
                
                elif angle == 180:
                    node.step3["axisYsupport"].append(["-", "Ry", None])
                
                elif 180 < angle < 270:
                    node.step3["axisXsupport"].append(["-", "Ry", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["-", "Ry", f"cos({pretty_angle(node.linkRotation)})"])
                
                elif angle == 270:
                    node.step3["axisXsupport"].append(["-", "Ry", None])

                elif 270 < angle < 360:
                    node.step3["axisXsupport"].append(["+", "Ry", f"sin({pretty_angle(node.linkRotation)})"])
                    node.step3["axisYsupport"].append(["+", "Ry", f"cos({pretty_angle(node.linkRotation)})"])
        
        if len(node.forces):
            for force in node.forces:
                magntitude = force[0]
                angle = force[1]
                unity = force[2]

                if angle == 0:  
                    node.step3["forcesX"].append(["-", magntitude, unity, None])
                elif 0 < angle < 90:
                    node.step3["forcesX"].append(["-", magntitude, unity, f"cos({pretty_angle(angle)})"])
                    node.step3["forcesY"].append(["-", magntitude, unity, f"sin({pretty_angle(angle)})"])
                elif angle == 90:
                    node.step3["forcesY"].append(["-", magntitude, unity, None])
                elif 90 < angle < 180:
                    node.step3["forcesX"].append(["+", magntitude, unity, f"cos({pretty_angle(angle)})"])
                    node.step3["forcesY"].append(["-", magntitude, unity, f"sin({pretty_angle(angle)})"])
                elif angle == 180:
                    node.step3["forcesX"].append(["+", magntitude, unity, None])
                elif 180 < angle < 270:
                    node.step3["forcesX"].append(["+", magntitude, unity, f"cos({pretty_angle(angle)})"])
                    node.step3["forcesY"].append(["+", magntitude, unity, f"sin({pretty_angle(angle)})"])
                elif angle == 270:
                    node.step3["forcesY"].append(["+", magntitude, unity, None])
                elif 270 < angle < 360:
                    node.step3["forcesX"].append(["-", magntitude, unity, f"cos({pretty_angle(angle)})"])
                    node.step3["forcesY"].append(["+", magntitude, unity, f"sin({pretty_angle(angle)})"])
        
        if len(node.moments):
            for moment in node.moments:
                magntitude = moment[0]
                unity = moment[1]
                if magntitude > 0:
                    node.step3["moments"].append(["+", abs(magntitude), unity, None])
                else:
                    node.step3["moments"].append(["-", abs(magntitude), unity, None])
    return dcl

def pretty_angle(angle):
    angle = int(angle)
    if 0 <= angle < 90:
        return angle
    elif 90 <= angle < 180:
        return 180 - angle
    elif 180 <= angle < 270:
        return angle - 180
    elif 270 <= angle < 360:
        return 360 - angle


