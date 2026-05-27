document.addEventListener('DOMContentLoaded', listarCarros);

document.getElementById('btn-logout').addEventListener('click', fazerLogout);

async function listarCarros() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/veiculos/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            }
        });

        // 🟢 Removemos a mensagem de loading quando a API responde
        const loadingMsg = document.getElementById('mensagem-carregamento-painel');
        if (loadingMsg) loadingMsg.style.display = 'none';

        if (response.ok) {
            const carros = await response.json(); 
            renderizarCarrosNaTela(carros);
        } else if (response.status === 401) {
            alert("Sua sessão expirou. Faça login novamente.");
            fazerLogout();
        } else {
            document.getElementById('lista-veiculos').innerHTML = "<p>Erro ao buscar estoque.</p>";
        }
    } catch (error) {
        document.getElementById('lista-veiculos').innerHTML = "<p>Erro de rede.</p>";
    }
}

// 🟢 Nova função de renderização focada em Tabelas (estilo Backoffice)
function renderizarCarrosNaTela(listaDeCarros) {
    const container = document.getElementById('lista-veiculos');

    if (listaDeCarros.length === 0) {
        container.innerHTML = "<p>O estoque está vazio. Comece a cadastrar.</p>";
        return;
    }

    // Estrutura clássica de tabela HTML (o Pico.css cuida das bordas listradas)
    let htmlGerado = `
        <table class="striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Veículo</th>
                    <th scope="col">Ano</th>
                    <th scope="col">Chassi</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    listaDeCarros.forEach(carro => {
        // Usa a tag <mark> do Pico para destacar visualmente os carros VENDIDOS
        let statusBadge = carro.status === 'VENDIDO' 
            ? `<mark style="background-color: #d81b60; color: white;">VENDIDO</mark>` 
            : `<mark style="background-color: #4caf50; color: white;">DISPONÍVEL</mark>`;

        htmlGerado += `
            <tr>
                <th scope="row">${carro.id}</th>
                <td><strong>${carro.marca}</strong> ${carro.modelo}</td>
                <td>${carro.ano}</td>
                <td><code>${carro.chassi}</code></td>
                <td>R$ ${carro.preco}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });

    htmlGerado += `
            </tbody>
        </table>
    `;

    container.innerHTML = htmlGerado;
}


function fazerLogout() {
    localStorage.removeItem('accessToken'); 
    window.location.href = "index.html";    
}
// js/painel.js

// O Gatilho do Formulário de Cadastro
document.getElementById('form-cadastro-carro').addEventListener('submit', async function(event) {
    event.preventDefault();

    // 1. Usamos FormData em vez de JSON para suportar o envio de arquivos
    const formData = new FormData();
    
    // 2. Anexamos os campos de texto no pacote
    formData.append('marca', document.getElementById('input-marca').value);
    formData.append('modelo', document.getElementById('input-modelo').value);
    formData.append('ano', parseInt(document.getElementById('input-ano').value));
    formData.append('chassi', document.getElementById('input-chassi').value);
    formData.append('preco', parseFloat(document.getElementById('input-preco').value));
    formData.append('status', "DISPONIVEL");

    // 3. Capturamos o arquivo da imagem (se o usuário tiver selecionado um)
    const campoImagem = document.getElementById('input-imagem');
    if (campoImagem.files.length > 0) {
        // Anexa o arquivo físico no pacote. O nome 'imagem' deve bater com o models.py
        formData.append('imagem', campoImagem.files[0]);
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
        const response = await fetch('http://localhost:8000/api/veiculos/', {
            method: 'POST',
            headers: {
                // 🟢 ATENÇÃO ARQUITETO: NUNCA defina 'Content-Type': 'application/json' 
                // quando usar FormData. O navegador ajusta isso automaticamente para 
                // 'multipart/form-data' e insere as chaves (boundaries) corretas.
                'Authorization': `Bearer ${token}`
            },
            body: formData // Envia o pacote misto (texto + arquivo)
        });

        if (response.ok) {
            alert("Veículo cadastrado com sucesso!");
            document.getElementById('form-cadastro-carro').reset();
            listarCarros(); 
        } else {
            const erroData = await response.json();
            alert(`Erro de Validação: ${JSON.stringify(erroData)}`);
        }
    } catch (error) {
        alert("Erro ao enviar a imagem para o servidor.");
    }
});