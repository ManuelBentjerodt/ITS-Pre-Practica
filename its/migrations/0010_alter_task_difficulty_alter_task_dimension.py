# Generated by Django 4.1.3 on 2023-01-06 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("its", "0009_task_difficulty_task_dimension"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="difficulty",
            field=models.JSONField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name="task",
            name="dimension",
            field=models.JSONField(blank=True, null=True),
        ),
    ]
