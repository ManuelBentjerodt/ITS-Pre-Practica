# Generated by Django 4.1.3 on 2022-12-14 19:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('email', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('password', models.CharField(max_length=50)),
                ('user_category', models.IntegerField(default=0)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('dcl', models.JSONField(blank=True, null=True)),
                ('date', models.DateTimeField()),

            ],
        ),
        migrations.CreateModel(
            name='TaskPerAccount',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='its.account')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='its.task')),
            ],
        ),
    ]
