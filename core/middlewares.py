import logging
import json
from django.http import JsonResponse

logger = logging.getLogger(__name__)

#primeira camada de middleware, para logar as requisições e respostas.
class RequestLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        logger.info(f"Nova requisição recebida: {request.method} {request.path}")
        response = self.get_response(request)
        logger.info(f"Resposta enviada: Status {response.status_code}")
        return response

#segunda camada de middleware, para autenticação básica.
# core/middlewares.py

class CustomAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # 1. Se for uma requisição apenas para LER dados, deixa passar!
        if request.method == 'GET':
            return self.get_response(request)

        # 2. Se for POST, PUT ou DELETE, a regra antiga continua valendo:
        if request.path.startswith('/api/') and 'token' not in request.path:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return JsonResponse(
                    {'erro': 'Cabeçalho de Autorização ausente. Acesso negado pelo Middleware.'}, 
                    status=401
                )
                
        return self.get_response(request)

#terceira camada de middleware, para validar o corpo das requisições POST/PUT.
class RequestValidationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Intercepta apenas POSTs/PUTs indo para a API
        if request.method in ['POST', 'PUT'] and request.path.startswith('/api/veiculos/'):
            try:
                body = request.body.decode('utf-8')
                if body:
                    data = json.loads(body)
                    
                    if 'preco' in data and float(data['preco']) < 0:
                        return JsonResponse(
                            {'erro': 'Middleware Validation: O preço não pode ser negativo.'}, 
                            status=400
                        )
                    
                    request._body = body.encode('utf-8')
            except json.JSONDecodeError:
                return JsonResponse({'erro': 'JSON malformado.'}, status=400)

        return self.get_response(request)