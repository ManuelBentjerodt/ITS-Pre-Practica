# Generated by Django 4.1.3 on 2023-01-11 20:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("its", "0017_tag"),
    ]

    operations = [
        migrations.RenameField(model_name="tag", old_name="task", new_name="tasks",),
    ]