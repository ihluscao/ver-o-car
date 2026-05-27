from django.contrib import admin
from .models import Veiculo, Cliente, Venda

# Opção 1: Registro Simples (Padrão)
admin.site.register(Cliente)
admin.site.register(Venda)

# Opção 2: Registro Avançado para o Estoque (Opcional, mas muito elegante)
@admin.register(Veiculo)
class VeiculoAdmin(admin.ModelAdmin):
    # Escolhe quais colunas aparecem na lista inicial do admin
    list_display = ('marca', 'modelo', 'ano', 'preco', 'status')
    
    # Adiciona um campo de pesquisa para facilitar a vida da gerência
    search_fields = ('marca', 'modelo', 'chassi')
    
    # Adiciona um filtro lateral por status
    list_filter = ('status', 'ano')