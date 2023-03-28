from django.db import models

class Colonne(models.Model):
    titre_colonne = models.CharField(primary_key=True, max_length=30)

    class Meta:
        db_table = 'colonne'


class Taches(models.Model):
    id_tache = models.AutoField(primary_key=True)
    titre_tache = models.CharField(max_length=50)
    titre_colonne = models.ForeignKey(Colonne, models.DO_NOTHING, db_column='titre_colonne')
    ordre = models.IntegerField()

    class Meta:
        db_table = 'taches'