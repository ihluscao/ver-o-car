from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from .models import Veiculo
from .serializers import VeiculoSerializer, UserSerializer

#endpoints para Veículo e Usuário utilizando ViewSets do DRF, com permissões adequadas para cada ação (leitura aberta, modificação restrita a staff).
#Get para veículos é aberto para leitura, mas criação, atualização e exclusão são restritos a usuários staff. 
class VeiculoViewSet(viewsets.ModelViewSet):
    queryset = Veiculo.objects.all()
    serializer_class = VeiculoSerializer

    def get_permissions(self):
        # Permissões dinamicamente baseados no método HTTP
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser] # Apenas staff/superuser
        else:
            permission_classes = [IsAuthenticated] # Qualquer logado pode ver
        return [permission() for permission in permission_classes]

#endpoint para gerenciamento de usuários, restrito a administradores.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]