# Generated by Django 4.1.3 on 2022-12-26 23:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('its', '0005_alter_task_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='statement',
            field=models.TextField(null=True),
        ),
    ]
