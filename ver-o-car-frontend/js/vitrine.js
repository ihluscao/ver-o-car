// Variáveis Globais de Controle de Arquitetura

let frotaGlobal = [];
let paginaAtual = 1;
const CARROS_POR_PAGINA = 15; // 3 linhas x 5 colunas
let loopCarrossel;

document.addEventListener('DOMContentLoaded', buscarCatalogo);

async function buscarCatalogo() {
    try {
        const response = await fetch('http://localhost:8000/api/veiculos/');
        
        const loading = document.getElementById('mensagem-carregamento');
        if (loading) loading.style.display = 'none';

        if (response.ok) {
            const resposta = await response.json();
            const todosOsCarros = Array.isArray(resposta) ? resposta : resposta.results;

            if (todosOsCarros) {
                // Guarda apenas os carros disponíveis na variável global
                frotaGlobal = todosOsCarros.filter(carro => carro.status === 'DISPONIVEL');
                
                renderizarDestaques();
                renderizarVitrine();
            }
        } else {
            document.getElementById('catalogo-carros').innerHTML = "<p>Erro ao carregar o catálogo.</p>";
        }
    } catch (error) {
        console.error("Falha na comunicação:", error);
        document.getElementById('catalogo-carros').innerHTML = "<p>Servidor offline.</p>";
    }
}

// 🟢 NOVO: Pega os 3 carros de maior valor e cria banners
// 🟢 ATUALIZADO: Pega os 3 carros de maior valor, cria banners e ativa o giro
function renderizarDestaques() {
    const container = document.getElementById('carrossel-container');
    const secao = document.getElementById('area-destaques');
    
    if (frotaGlobal.length < 3) return; 

    const top3 = [...frotaGlobal].sort((a, b) => b.preco - a.preco).slice(0, 3);
    
    let html = "";
    top3.forEach(carro => {
        const urlImagem = carro.imagem ? carro.imagem : 'https://via.placeholder.com/1200x600?text=Sem+Foto';
        html += `
            <div class="destaque-card">
                <img src="${urlImagem}" alt="${carro.modelo}">
                <div class="destaque-info">
                    <h2 style="color: white; margin-bottom: 0;">${carro.marca} ${carro.modelo}</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 1rem;"><mark>R$ ${carro.preco}</mark></p>
                    <button class="primary" onclick="iniciarCompra(${carro.id})">Aproveitar Oferta</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    secao.style.display = 'block'; 

    // Chama o motor para começar a girar o carrossel
    iniciarCarrosselAutomatico(container);
}

// 🟢 NOVO: O Motor do Carrossel Automático
function iniciarCarrosselAutomatico(container) {
    // Se já houver um giro rodando, nós o limpamos para não duplicar a velocidade
    if (loopCarrossel) clearInterval(loopCarrossel); 

    loopCarrossel = setInterval(() => {
        // Calcula o limite máximo que o contêiner consegue rolar
        const limiteMaximo = container.scrollWidth - container.clientWidth;
        
        // Se a posição atual for maior ou igual ao limite (com 10px de folga), volta pro início
        if (container.scrollLeft >= limiteMaximo - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // Se não chegou no final, pula a largura exata de um carro para a direita
            container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
        }
    }, 3500); // 3500 = 3,5 segundos por foto. Pode alterar ao seu gosto!
}

// 🟢 ATUALIZADO: Renderiza apenas os carros da página atual
function renderizarVitrine() {
    const container = document.getElementById('catalogo-carros');
    
    if (frotaGlobal.length === 0) {
        container.innerHTML = "<p>Puxa, todos os nossos carros foram vendidos!</p>";
        return;
    }

    // Lógica Matemática da Paginação (Slice)
    const inicio = (paginaAtual - 1) * CARROS_POR_PAGINA;
    const fim = inicio + CARROS_POR_PAGINA;
    const carrosDaPagina = frotaGlobal.slice(inicio, fim);

    let htmlGerado = '<div class="grid">'; 
    
    carrosDaPagina.forEach(carro => {
        // Substitua nas duas funções onde a urlImagem é definida!
const urlImagem = carro.imagem 
    ? carro.imagem 
    : 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=80';
        htmlGerado += `
            <article>
                <header>
                    <strong>${carro.marca} ${carro.modelo}</strong>
                </header>
                <img src="${urlImagem}" alt="${carro.modelo}" style="width: 100%; aspect-ratio: 16/9; object-fit: cover; margin-bottom: 0.5rem; border-radius: 4px;">
                <p>Ano: ${carro.ano}</p>
                <p><mark>Por: R$ ${carro.preco}</mark></p> 
                <footer>
                    <button class="outline" onclick="iniciarCompra(${carro.id})">Tenho Interesse!</button>
                </footer>
            </article>
        `;
    });
    
    htmlGerado += "</div>";
    container.innerHTML = htmlGerado;
    
    renderizarControlesPaginacao();
}

// 🟢 NOVO: Desenha os botões de Anterior / Próxima
function renderizarControlesPaginacao() {
    const totalPaginas = Math.ceil(frotaGlobal.length / CARROS_POR_PAGINA);
    const container = document.getElementById('controles-paginacao');
    
    if (totalPaginas <= 1) {
        container.innerHTML = ""; // Se só tem 1 página, não precisa de botões
        return;
    }

    let html = `
        <button class="secondary outline" onclick="mudarPagina(-1)" ${paginaAtual === 1 ? 'disabled' : ''}>⬅ Anterior</button>
        <span>Página <strong>${paginaAtual}</strong> de ${totalPaginas}</span>
        <button class="secondary outline" onclick="mudarPagina(1)" ${paginaAtual === totalPaginas ? 'disabled' : ''}>Próxima ➡</button>
    `;
    
    container.innerHTML = html;
}

function mudarPagina(direcao) {
    paginaAtual += direcao;
    renderizarVitrine();
    // Faz a tela rolar suavemente de volta para o topo do catálogo
    document.getElementById('hero').scrollIntoView({ behavior: 'smooth' });
}

function iniciarCompra(idDoCarro) {
    alert(`Redirecionando para fechar o contrato do carro ID ${idDoCarro}.`);
}

function moverCarrosselManual(direcao) {
    const container = document.getElementById('carrossel-container');
    const larguraCarro = container.clientWidth;
    const limiteMaximo = container.scrollWidth - container.clientWidth;

    if (direcao === 1) {
        // Clicou para a Direita
        if (container.scrollLeft >= limiteMaximo - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' }); // Volta pro início
        } else {
            container.scrollBy({ left: larguraCarro, behavior: 'smooth' });
        }
    } else {
        // Clicou para a Esquerda
        if (container.scrollLeft <= 10) {
            container.scrollTo({ left: limiteMaximo, behavior: 'smooth' }); // Vai pro final
        } else {
            container.scrollBy({ left: -larguraCarro, behavior: 'smooth' });
        }
    }

    // A Mágica de UX: Reinicia o timer para o carrossel não correr sozinho 
    // logo após o usuário ter clicado manualmente para ver a foto
    iniciarCarrosselAutomatico(container);
}