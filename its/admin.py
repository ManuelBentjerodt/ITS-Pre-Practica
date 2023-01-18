from django.contrib import admin
from .models import Task, Tag
# Register your models here.


class TagInline(admin.TabularInline):
    model = Tag.tasks.through


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'statement', 'difficulty', 'sizeFactor', 'created', 'image']
    list_filter = ['difficulty', 'sizeFactor']
    inlines = [TagInline] 
    
admin.site.register(Tag)

# fuerza_perpendicular = Tag.objects.create(name="fuerza_perpendicular")
# task1 = Task.objects.create(statement="¿Cuál es la fuerza perpendicular?", difficulty=1, sizeFactor=1)
# task1.tags.add(fuerza_perpendicular)
# task1.tags.remove(fuerza_perpendicular)

