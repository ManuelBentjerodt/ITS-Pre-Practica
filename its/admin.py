from django.contrib import admin
from .models import Task, Tag
# Register your models here.


class TagInline(admin.TabularInline):
    model = Tag.tasks.through


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'statement', 'difficulty', 'sizeFactor', 'created']
    list_filter = ['difficulty', 'sizeFactor']
    inlines = [TagInline] 
    
admin.site.register(Tag)

