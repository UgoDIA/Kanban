from rest_framework.response import Response
from rest_framework.decorators import api_view
from  kanban.models import Taches, Colonne
from .serializers import TachesSerializer,ColonneSerializer
from django.db import connection
# Create your views here.

@api_view(['GET'])
def getTaches(request):
    taches=Taches.objects.all()
    serializer=TachesSerializer(taches, many=True)
    return Response(serializer.data)    


@api_view(['GET'])
def getColonnes(request):
    colonnes=Colonne.objects.all()
    serializer=ColonneSerializer(colonnes, many=True)
    return Response(serializer.data)