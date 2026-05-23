from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Veiculo

# Serializadores para os modelos Veiculo e Usuario, incluindo validação para o preço do veículo e criação de usuário com senha hashada.
class VeiculoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Veiculo
        fields = '__all__'

    def validate_preco(self, value):
        if value < 0:
            raise serializers.ValidationError("O preço do veículo não pode ser negativo.")
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}}

    #Criação de usuário utilizando o método create_user para garantir que a senha seja corretamente hashada
    def create(self, validated_data):
        return User.objects.create_user(**validated_data)