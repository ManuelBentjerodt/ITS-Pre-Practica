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


]