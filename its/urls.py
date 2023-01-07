from django.urls import path
from . import views


urlpatterns = [
    path('',views.index,name='index'),
    path('sign_up',views.sign_up,name='sign_up'),
    path('sign_in',views.sign_in,name='sign_in'),
    path('sign_out',views.sign_out,name='sign_out'),
    
    path('teacher_home',views.teacher_home,name='teacher_home'),
    path('student_home',views.student_home,name='student_home'),
    
    path('create_task',views.create_task, name='create_task'),
    path('edit_task/<int:id>',views.EditTaskView.as_view(), name='edit_task'),
    path('delete_task/<int:id>',views.delete_task, name='delete_task'),

    path('first_step',views.firstStep, name='first_step'),
    path('third_step',views.thirdStep, name='third_step'),
    path('fourth_step',views.fourthStep, name='fourth_step'),
    path('fifth_step',views.fifthStep, name='fifth_step'),
]