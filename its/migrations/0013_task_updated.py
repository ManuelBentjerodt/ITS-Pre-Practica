# Generated by Django 4.1.3 on 2023-01-08 09:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('its', '0012_remove_task_date_task_created'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='updated',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
    ]
