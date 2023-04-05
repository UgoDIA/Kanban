from django.db import models

class Colonne(models.Model):
    id_colonne = models.IntegerField(primary_key=True)
    titre_colonne = models.CharField(max_length=30)
    ordre = models.IntegerField()

    class Meta:
        db_table = 'colonne'


class Taches(models.Model):
    id_tache = models.IntegerField(primary_key=True)
    titre_tache = models.CharField(max_length=50)
    id_colonne = models.ForeignKey(Colonne, models.DO_NOTHING, db_column='id_colonne')
    ordre = models.IntegerField()

    class Meta:
        db_table = 'tache'