# Generated by Django 3.2.9 on 2021-11-14 21:19

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('locker', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='locker',
            name='reserved',
            field=models.ForeignKey(db_column='reserved', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reservedstudent', to='locker.personalinfo'),
        ),
        migrations.AddField(
            model_name='locker',
            name='sector',
            field=models.CharField(help_text='층별 구역', max_length=2, null=True),
        ),
    ]
