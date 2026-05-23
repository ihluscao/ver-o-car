from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Veiculo, Usuario
from .serializers import VeiculoSerializer, UsuarioSerializer

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
class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    permission_classes = [IsAdminUser]