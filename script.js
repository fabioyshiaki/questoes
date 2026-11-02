// 1. Banco de Dados Simulado (Pode ser substituído por chamadas fetch() para APIs ou Firebase)
const bancoDeQuestoes = [
    {
        id: 1,
        banca: "FGV",
        ano: 2023,
        // O edital original da prova onde esta questão caiu
        conteudo_programatico_edital: "Engenharia de Requisitos: técnicas de elicitação, análise, especificação e validação.",
        enunciado: "No contexto da Engenharia de Requisitos, a técnica utilizada para descobrir necessidades dos stakeholders através de sessões estruturadas é:",
        alternativas: ["A) Prototipação", "B) Brainstorming", "C) Entrevistas", "D) JAD (Joint Application Design)"],
        resposta: "D"
    },
    {
        id: 2,
        banca: "FGV",
        ano: 2024,
        conteudo_programatico_edital: "Lei Geral de Proteção de Dados Pessoais (Lei n° 13.709/2018): princípios e bases legais.",
        enunciado: "Segundo a LGPD, o tratamento de dados pessoais para cumprimento de obrigação legal ou regulatória pelo controlador independe do consentimento do titular.",
        alternativas: ["A) Certo", "B) Errado"],
        resposta: "A"
    },
    {
        id: 3,
        banca: "FGV",
        ano: 2022,
        conteudo_programatico_edital: "Banco de dados: Modelagem relacional, linguagem SQL.",
        enunciado: "Qual comando SQL é utilizado para remover a estrutura de uma tabela do banco de dados?",
        alternativas: ["A) DELETE", "B) TRUNCATE", "C) DROP", "D) REMOVE"],
        resposta: "C"
    }
];

// 2. Extração exaustiva dos tópicos do documento TJPB.pdf
const assuntosTJPB = [
    "Compreensão e interpretação de textos de gêneros variados", //[cite: 1]
    "Raciocínio Lógico e Matemático: Resolução de problemas", //[cite: 1]
    "Redes de computadores e protocolos TCP/IP", //[cite: 1]
    "Lei Geral de Proteção de Dados Pessoais (Lei n° 13.709/2018)", //[cite: 1, 4]
    "Plataforma Digital do Poder Judiciário (PDPJ-Br)", //
    "Engenharia de requisitos: técnicas de elicitação, análise, especificação e validação", //[cite: 2]
    "Padrões de projeto GoF: criacionais, estruturais e comportamentais", //[cite: 2]
    "Desenvolvimento Mobile: Ciclo de vida de aplicações móveis (Android e iOS)", //[cite: 3]
    "Linguagem SQL (ANSI): DML, DDL, DCL e TCL", //[cite: 3]
    "Integração e entrega contínua (CI/CD): pipelines de automação", //[cite: 3]
    "Segurança da Informação e Qualidade de Software", //[cite: 4]
    "Design de Interface (UI) e Experiência do Usuário (UX): Princípios de design de interface" //[cite: 5]
];

// 3. Inicialização da Interface
document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('assuntoSelect');
    assuntosTJPB.forEach(assunto => {
        const option = document.createElement('option');
        option.value = assunto;
        option.textContent = assunto;
        select.appendChild(option);
    });

    document.getElementById('btnFiltrar').addEventListener('click', processarFiltro);
    document.getElementById('formNovaQuestao').addEventListener('submit', adicionarQuestao);
});

// 4. Algoritmo de Similaridade de Texto (Jaccard Index adaptado)
function calcularSimilaridade(texto1, texto2) {
    const normalizar = (texto) => texto.toLowerCase().replace(/[^\w\s]/gi, '').split(/\s+/).filter(w => w.length > 2);
    const palavras1 = new Set(normalizar(texto1));
    const palavras2 = new Set(normalizar(texto2));
    
    let intersecao = 0;
    palavras1.forEach(palavra => {
        if (palavras2.has(palavra)) intersecao++;
    });
    
    const uniao = palavras1.size + palavras2.size - intersecao;
    return uniao === 0 ? 0 : (intersecao / uniao) * 100;
}

// 5. Motor de Filtragem e Ordenação
function processarFiltro() {
    const assuntoEscolhido = document.getElementById('assuntoSelect').value;
    if (!assuntoEscolhido) {
        alert("Selecione um assunto do edital do TJPB.");
        return;
    }

    const questoesAnalisadas = bancoDeQuestoes.map(questao => {
        const score = calcularSimilaridade(assuntoEscolhido, questao.conteudo_programatico_edital);
        return { ...questao, scoreSimilaridade: score };
    });

    // Ordena da maior similaridade para a menor
    questoesAnalisadas.sort((a, b) => b.scoreSimilaridade - a.scoreSimilaridade);
    
    // Filtra questões que tenham pelo menos o mínimo de similaridade para não poluir a tela
    const questoesRelevantes = questoesAnalisadas.filter(q => q.scoreSimilaridade > 0);
    renderizarQuestoes(questoesRelevantes);
}

// 6. Renderização de UI
function renderizarQuestoes(questoes) {
    const container = document.getElementById('questoesContainer');
    container.innerHTML = '';

    if (questoes.length === 0) {
        container.innerHTML = '<p>Nenhuma questão similar encontrada para este tópico no banco atual.</p>';
        return;
    }

    questoes.forEach(q => {
        const card = document.createElement('div');
        card.className = 'questao-card';
        
        const alternativasHtml = q.alternativas.map(alt => `<li>${alt}</li>`).join('');
        
        card.innerHTML = `
            <span class="similaridade-badge">Grau de Similaridade do Edital: ${q.scoreSimilaridade.toFixed(1)}%</span>
            <p><strong>Banca:</strong> ${q.banca} | <strong>Ano:</strong> ${q.ano}</p>
            <p><strong>Edital Original da Questão:</strong> ${q.conteudo_programatico_edital}</p>
            <p><strong>Enunciado:</strong> ${q.enunciado}</p>
            <ul class="alternativas">
                ${alternativasHtml}
            </ul>
            <button onclick="alert('A resposta correta é: ${q.resposta}')">Ver Resposta</button>
        `;
        container.appendChild(card);
    });
}

// 7. Função de Inserção de Novos Dados
function adicionarQuestao(e) {
    e.preventDefault();
    const novoConteudo = document.getElementById('novoConteudoEdital').value;
    const novoEnunciado = document.getElementById('novoEnunciado').value;
    
    bancoDeQuestoes.push({
        id: bancoDeQuestoes.length + 1,
        banca: "FGV",
        ano: new Date().getFullYear(),
        conteudo_programatico_edital: novoConteudo,
        enunciado: novoEnunciado,
        alternativas: ["A) Alternativa genérica A", "B) Alternativa genérica B"], // Expansível no formulário final
        resposta: "A"
    });
    
    alert("Questão adicionada ao banco local com sucesso!");
    document.getElementById('formNovaQuestao').reset();
}
