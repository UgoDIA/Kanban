# Generated by Django 4.1.7 on 2023-03-28 09:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('kanban', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='colonne',
            name='ordre',
            field=models.IntegerField(unique=True),
        ),
        migrations.AlterField(
            model_name='taches',
            name='ordre',
            field=models.IntegerField(unique=True),
        ),
    ]
