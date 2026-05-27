from django.db import models
from django.contrib.auth.models import User

class Cliente(models.Model):
    nome = models.CharField(max_length=255)
    cpf = models.CharField(max_length=14, unique=True)
    telefone = models.CharField(max_length=20, null=True, blank=True)
    data_cadastro = models.DateTimeField(auto_now_add=True) # Preenche a data sozinho

    def __str__(self):
        return self.nome

class Veiculo(models.Model):
    STATUS_CHOICES = [
        ('DISPONIVEL', 'Disponível'),
        ('VENDIDO', 'Vendido'),
    ]
    
    marca = models.CharField(max_length=100)
    modelo = models.CharField(max_length=100)
    ano = models.IntegerField()
    chassi = models.CharField(max_length=17, unique=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DISPONIVEL')
    imagem = models.ImageField(upload_to='carros/', null=True, blank=True)

    def __str__(self):
        return f"{self.marca} {self.modelo} ({self.ano})"

class Venda(models.Model):
    veiculo = models.OneToOneField(Veiculo, on_delete=models.PROTECT) 
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT)
    vendedor = models.ForeignKey(User, on_delete=models.PROTECT)
    data_venda = models.DateTimeField(auto_now_add=True)
    valor_final = models.DecimalField(max_digits=10, decimal_places=2)
    forma_pagamento = models.CharField(max_length=50)

    def save(self, *args, **kwargs):
        if self.pk is None:
            self.veiculo.status = 'VENDIDO'
            self.veiculo.save()
            
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Venda: {self.veiculo.modelo} para {self.cliente.nome}"