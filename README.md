# 🚗 Ver-o-Car: Sistema de Gestão e Vitrine Automotiva

![Status](https://img.shields.io/badge/Status-Finalizado-success)
![Python](https://img.shields.io/badge/Python-3.x-blue)
![Django](https://img.shields.io/badge/Django-REST_Framework-red)
![MySQL](https://img.shields.io/badge/MySQL-XAMPP-orange)

## 📖 Sobre o Projeto
O **Ver-o-Car** é uma plataforma B2B e B2C desenvolvida como projeto do grupo de estudos de backend. 

O sistema é dividido em duas frentes integradas via API REST:
1. **Backoffice (B2B):** Painel administrativo seguro com autenticação JWT para gestão de estoque e upload de imagens.
2. **Vitrine (B2C):** Interface pública responsiva, consumindo dados dinamicamente para exibição do catálogo de veículos.


## 🛠️ Tecnologias Utilizadas
* **Back-end:** Python, Django, Django REST Framework (DRF).
* **Banco de Dados:** MySQL (via XAMPP).
* **Front-end:** HTML5, JavaScript, CSS3 (Pico.css).
* **Autenticação & Documentação:** SimpleJWT, drf-spectacular (Swagger).

## ⚙️ Pré-requisitos
* [Python 3.x](https://www.python.org/downloads/) instalado.
* [XAMPP](https://www.apachefriends.org/pt_br/index.html) instalado (para rodar o servidor MySQL).
* Git para clonagem do repositório.

## 🚀 Como Rodar o Projeto Localmente

**1. Configurando o Banco de Dados (XAMPP)**
* Abra o painel do XAMPP e inicie o serviço **MySQL**.
* Acesse o phpMyAdmin (`http://localhost/phpmyadmin`) e crie um banco de dados vazio chamado `ver_o_car`.

**2. Configurando o Back-end**
```bash
# Clone o repositório
git clone [https://github.com/seu-usuario/ver-o-car.git](https://github.com/seu-usuario/ver-o-car.git)
cd ver-o-car

# Crie e ative o ambiente virtual
python -m venv venv
source venv/Scripts/activate # No Windows
# source venv/bin/activate # No Linux/Mac

# Instale as dependências
pip install -r dependencias.txt

# Aplique as migrações no banco de dados
python manage.py makemigrations core
python manage.py migrate

# Crie o superusuário para acessar o painel admin
python manage.py createsuperuser

# Inicie o servidor
python manage.py runserver