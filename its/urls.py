from django.urls import path
from .views import *



urlpatterns = [
    path('',index,name='index'),
    path('sign_up',sign_up,name='sign_up'),
    path('sign_in',sign_in,name='sign_in'),
    path('sign_out',sign_out,name='sign_out'),
    
    path('teacher_home',teacher_home,name='teacher_home'),
    path('student_home',student_home,name='student_home'),
    
    path('create_task',CreateTaskView.as_view(),name='create_task'),
    path('edit_task/<int:id>',EditTaskView.as_view(), name='edit_task'),
    path('delete_task/<int:id>',delete_task, name='delete_task'),

    path('first_step<int:id>',firstStep, name='first_step'),
    path('second_step<int:id>',secondStep, name='second_step'),
    path('third_step<int:id>',thirdStep, name='third_step'),
    path('fourth_step<int:id>',fourthStep, name='fourth_step'),
    path('fifth_step<int:id>',fifthStep, name='fifth_step'),
]