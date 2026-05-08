const grid = document.getElementById('grid-fazenda');
const statusMsg = document.getElementById('status-msg');
const valProducao = document.getElementById('val-producao');
const valInsumos = document.getElementById('val-insumos');
const valSustentavel = document.getElementById('val-sustentavel');

let modo = ''; // 'tradicional' ou 'precisao'
let totalInsumos = 0;
let totalProducao = 0;
let pontosSustentaveis = 0;
const totalTalhoes = 25;

// Inicializa a fazenda
function criarFazenda() {
    grid.innerHTML = '';
    totalInsumos = 0;
    totalProducao = 0;
    pontosSustentaveis = 0;
    atualizarPainel();

    for (let i = 0; i < totalTalhoes; i++) {
        const plot = document.createElement('div');
        plot.classList.add('plot');
        
        // Define aleatoriamente a necessidade do solo (0 a 100)
        const necessidade = Math.floor(Math.random() * 100);
        plot.dataset.necessidade = necessidade;
        plot.dataset.info = `Necessidade: ${necessidade}%`;
        
        // Se a necessidade for alta, o solo parece mais seco (claro)
        if (necessidade > 60) plot.style.backgroundColor = '#d2b48c';
        else plot.style.backgroundColor = '#8d6e63';

        plot.addEventListener('click', () => tratarSolo(plot));
        grid.appendChild(plot);
    }
}

function tratarSolo(plot) {
    if (!modo) {
        statusMsg.innerText = "⚠️ Selecione um modo antes de aplicar!";
        return;
    }

    const nec = parseInt(plot.dataset.necessidade);
    
    if (modo === 'tradicional') {
        // No tradicional, sempre gasta o máximo (ex: 100 unidades)
        totalInsumos += 100;
        totalProducao += 80; // Produção padrão
        // Se a necessidade era baixa e aplicou muito, perde sustentabilidade
        pontosSustentaveis += (nec > 50) ? 10 : -5;
        
        aplicarVisual(plot, '#4caf50');
    } 
    else if (modo === 'precisao') {
        // No precisão, gasta exatamente o que precisa
        totalInsumos += nec;
        totalProducao += 95; // Produção maior por ser exato
        pontosSustentaveis += 20; // Sustentabilidade alta
        
        aplicarVisual(plot, '#2e7d32');
    }

    plot.style.pointerEvents = 'none'; // Impede clicar de novo no mesmo
    atualizarPainel();
}

function aplicarVisual(plot, cor) {
    plot.classList.add('aplicado');
    plot.style.backgroundColor = cor;
    plot.innerText = "🌱";
}

function atualizarPainel() {
    valProducao.innerText = `${totalProducao} sc/ha`;
    valInsumos.innerText = `R$ ${totalInsumos.toLocaleString()}`;
    
    // Cálculo simples de sustentabilidade (máximo 100%)
    let percSust = Math.min(Math.max(pontosSustentaveis / 2, 0), 100);
    valSustentavel.innerText = `${Math.floor(percSust)}%`;
}

// Eventos dos Botões
document.getElementById('btn-tradicional').addEventListener('click', () => {
    modo = 'tradicional';
    grid.className = 'farm-grid';
    statusMsg.innerText = "🚜 MODO CONVENCIONAL: Você está aplicando insumos de forma igual em toda a área. Observe o desperdício.";
});

document.getElementById('btn-precisao').addEventListener('click', () => {
    modo = 'precisao';
    grid.className = 'farm-grid modo-precisao-ativo';
    statusMsg.innerText = "🛰️ MODO PRECISÃO: Os sensores detectam a necessidade exata. Aplique apenas o necessário!";
});

document.getElementById('btn-reset').addEventListener('click', criarFazenda);

// Começar
criarFazenda();