from rest_framework.response import Response
from rest_framework.decorators import api_view
from  kanban.models import Taches, Colonne
from .serializers import TachesSerializer,ColonneSerializer,createTachesSerializer
from django.db import connection
from django.db.models import Count,Max
# Create your views here.

@api_view(['GET','POST'])
def CR_taches(request):
    if request.method=='GET':
        taches=Taches.objects.all().order_by('ordre')
        serializer=TachesSerializer(taches, many=True)
        return Response(serializer.data)
    elif request.method=='POST':
        serializer=createTachesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)
    
@api_view(['POST','GET','DELETE'])
def RUD_taches(request,pk):
    if request.method=='POST':
        tache=Taches.objects.get(id_tache=pk)
        serializer=TachesSerializer(instance=tache,data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)
    elif request.method=='GET':
        tache=Taches.objects.get(id_tache=pk)
        serializer=TachesSerializer(tache, many=False)
        return Response(serializer.data)            

@api_view(['GET','POST'])
def CR_colonnes(request):
    if request.method=='GET':
        colonnes=Colonne.objects.all().order_by('ordre')
        serializer=ColonneSerializer(colonnes, many=True)
        return Response(serializer.data)
    elif request.method=='POST':
        serializer=ColonneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)


@api_view(['GET','POST','DELETE'])
def RUD_colonnes(request,pk):
    if request.method=='GET':
        colonne=Colonne.objects.get(id_colonne=pk)
        serializer=ColonneSerializer(colonne, many=False)
        return Response(serializer.data)    
    elif request.method=='POST':
        col=Colonne.objects.get(id_colonne=pk)
        serializer=ColonneSerializer(instance=col,data=request.data)
        if serializer.is_valid():
            serializer.save()
        return Response(serializer.data)
    elif request.method=='DELETE':
        col=Colonne.objects.get(id_colonne=pk)
        col.delete()
        return Response("Ligne supprimée")
