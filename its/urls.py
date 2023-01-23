from django.urls import path
from its.views.general.index import index
from its.views.general.signUp import sign_up
from its.views.general.signIn import sign_in
from its.views.general.signOut import sign_out


from its.views.student.home import student_home
from its.views.student.step1 import FirstStepView
from its.views.student.step2 import SecondStepView
from its.views.student.step3 import ThirdStepView
from its.views.student.step4 import FourthStepView
from its.views.student.step5 import FifthStepView

from its.views.teacher.deleteTask import delete_task
from its.views.teacher.createTask import CreateTaskView
from its.views.teacher.editTask import EditTaskView
from its.views.teacher.home import TeacherHomeView



urlpatterns = [
    path('', index, name='index'),
    path('sign_up', sign_up, name='sign_up'),
    path('sign_in', sign_in, name='sign_in'),
    path('sign_out', sign_out, name='sign_out'),
    
    path('teacher_home', TeacherHomeView.as_view(), name='teacher_home'),
    path('student_home', student_home, name='student_home'),
    
    path('create_task', CreateTaskView.as_view(), name='create_task'),
    path('edit_task/<int:id>', EditTaskView.as_view(), name='edit_task'),
    path('delete_task/<int:id>', delete_task, name='delete_task'),

    path('first_step/<int:id>', FirstStepView.as_view(), name='first_step'),
    path('second_step/<int:id>', SecondStepView.as_view(), name='second_step'),
    path('third_step/<int:id>', ThirdStepView.as_view(), name='third_step'),
    path('fourth_step/<int:id>', FourthStepView.as_view(), name='fourth_step'),
    path('fifth_step/<int:id>', FifthStepView.as_view(), name='fifth_step'),
]