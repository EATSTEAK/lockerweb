# Generated by Django 3.2.9 on 2021-11-15 13:11

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('locker', '0003_alter_personalinfo_lockernum'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personalinfo',
            name='lockernum',
            field=models.ForeignKey(db_column='lockernum', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='lockerusing', to='locker.locker'),
        ),
    ]
