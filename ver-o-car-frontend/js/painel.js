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

        if (response.ok) {
            const carros = await response.json();
            renderizarCarrosNaTela(carros);
        } else if (response.status === 401) {
            alert("Sua sessão expirou. Faça login novamente.");
            fazerLogout();
        } else {
            console.error("Erro ao buscar estoque.");
        }
    } catch (error) {
        document.getElementById('lista-veiculos').innerHTML = "<p>Erro de conexão com o servidor.</p>";
    }
}

function renderizarCarrosNaTela(listaDeCarros) {
    const container = document.getElementById('lista-veiculos');

    if (listaDeCarros.length === 0) {
        container.innerHTML = "<p>Nenhum veículo cadastrado no estoque.</p>";
        return;
    }

    let htmlGerado = "<ul>";
    
    listaDeCarros.forEach(carro => {
        htmlGerado += `
            <li>
                <strong>${carro.marca} ${carro.modelo}</strong> (${carro.ano}) 
                - Chassi: ${carro.chassi} 
                - R$ ${carro.preco} 
                - Status: <em>${carro.status}</em>
            </li>
            <hr>
        `;
    });

    htmlGerado += "</ul>";


    container.innerHTML = htmlGerado;
}


function fazerLogout() {
    localStorage.removeItem('accessToken'); 
    window.location.href = "index.html";    
}
// js/painel.js (Continuação)

// 1. O Gatilho do Formulário
document.getElementById('form-cadastro-carro').addEventListener('submit', async function(event) {
    // Impede a página de recarregar
    event.preventDefault();

    // 2. Monta o objeto JSON lendo os IDs do HTML
    const novoVeiculo = {
        marca: document.getElementById('input-marca').value,
        modelo: document.getElementById('input-modelo').value,
        ano: parseInt(document.getElementById('input-ano').value),
        chassi: document.getElementById('input-chassi').value,
        preco: parseFloat(document.getElementById('input-preco').value),
        status: "DISPONIVEL" // Definimos um padrão inicial
    };

    // 3. Resgata o token de autorização
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
        // 4. Dispara o POST para o Django
        const response = await fetch('http://localhost:8000/api/veiculos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(novoVeiculo)
        });

        // 5. Analisa a Resposta
        if (response.ok) {
            alert("Veículo cadastrado com sucesso!");
            
            // Limpa o formulário na tela
            document.getElementById('form-cadastro-carro').reset();
            
            // Re-lista os carros para que o novo apareça imediatamente
            listarCarros(); 
        } else {
            // Se caiu aqui, o Middleware do Django ou o Serializer bloqueou a ação
            const erroData = await response.json();
            
            // Tenta mostrar a mensagem exata do erro
            if (erroData.erro) {
                alert(`Recusado pelo Servidor: ${erroData.erro}`);
            } else {
                alert(`Erro de Validação: ${JSON.stringify(erroData)}`);
            }
        }
    } catch (error) {
        alert("Erro ao conectar com o banco de dados.");
    }
});