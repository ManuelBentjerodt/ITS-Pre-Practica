# Generated by Django 4.1.3 on 2023-01-11 20:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('its', '0018_task_opened_second_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='task',
            name='opened_second_time',
        ),
    ]