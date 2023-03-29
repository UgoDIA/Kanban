from rest_framework.response import Response
from rest_framework.decorators import api_view
from  kanban.models import Taches, Colonne
from .serializers import TachesSerializer,ColonneSerializer,createTachesSerializer
from django.db import connection
# Create your views here.

@api_view(['GET'])
def getTaches(request):
    taches=Taches.objects.all().order_by('ordre')
    serializer=TachesSerializer(taches, many=True)
    return Response(serializer.data)    


@api_view(['GET'])
def getColonnes(request):
    colonnes=Colonne.objects.all().order_by('ordre')
    serializer=ColonneSerializer(colonnes, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def createColonne(request):
    serializer=ColonneSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST'])
def createTache(request):
    serializer=createTachesSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)