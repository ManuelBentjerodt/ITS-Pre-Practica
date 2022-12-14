from dataclasses import field
from django import forms
from .models import Task, TaskPerAccount


class TaskForm(forms.ModelForm):
    dcl = forms.JSONField() #widget=forms.HiddenInput()
    class Meta:
        model = Task
        fields = '__all__'
        
class TaskFormDraw(forms.ModelForm):
    student_draw = forms.JSONField(widget=forms.HiddenInput())
    solved = forms.BooleanField(widget=forms.HiddenInput())
    class Meta:
        model = TaskPerAccount
        fields = ["student_draw", "solved",] #'__all__'