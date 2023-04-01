from django.contrib import admin
from django.urls import path, include
from . import views
from django.contrib import messages
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('api/taches/', views.CR_taches, name="getTaches"),
    path('api/taches/<str:pk>/', views.RUD_taches, name="taches"),
    path('api/colonnes/', views.CR_colonnes, name="getColonnes"),
    path('api/colonnes/<str:pk>/', views.RUD_colonnes, name="colonnes"),
]