from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.db import connection
from os.path import isfile, join
from django.urls import reverse
import os, shutil, psycopg2
from os import walk,listdir
from os.path import isfile, join
from .models import Taches,Colonne
from datetime import date


# Create your views here.

def index(request):
    return redirect('kanban')

def kanban(request):
    return render(request, 'kanban.html')