const inputAdicionar = document.querySelector('#input-tarefa');
const buttonAdicionar = document.querySelector('#adicionar');
const containerTodo = document.querySelector('.todo-column .cards-container');
const containerDoing = document.querySelector('.doing-column .cards-container');
const containerDone = document.querySelector('.done-column .cards-container');
const templateTarefa = document.querySelector('#templateTarefa');

async function salvarTarefas() {
    function extrairTextos(container) {
        const titulos = container.querySelectorAll('.task-card .task-title');
        return Array.from(titulos).map(el => el.textContent);
    }

    const dados = {
        todo: extrairTextos(containerTodo),
        doing: extrairTextos(containerDoing),
        done: extrairTextos(containerDone)
    };
    await fetch('/api/tarefas', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    });
}

async function carregarTarefas() {
    try {
        const resposta = await fetch('/api/tarefas');
        const tarefas = await resposta.json();

        tarefas.todo.forEach(texto => criarTarefa(texto, containerTodo, false));
        tarefas.doing.forEach(texto => criarTarefa(texto, containerDoing, false));
        tarefas.done.forEach(texto => criarTarefa(texto, containerDone, false));
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function moverTarefa(card, direcao) {
    const colunas = [containerTodo, containerDoing, containerDone];
    const colunaAtual = card.parentElement;
    const indexAtual = colunas.indexOf(colunaAtual);
    const indexNovo = indexAtual + direcao;

    if (indexNovo < 0 || indexNovo >= colunas.length) return;
    card.remove();
    colunas[indexNovo].appendChild(card);
    salvarTarefas();
}

function criarTarefa(texto, containerDestino, salvar = true) {
    if (!texto || texto.trim() === '') return;

    const tarefa = templateTarefa.content.cloneNode(true);
    const card = tarefa.querySelector('.task-card');
    const spanTitle = tarefa.querySelector('.task-title');
    const buttonExcluir = tarefa.querySelector('.excluir');
    const buttonEsquerda = tarefa.querySelector('.move-left');
    const buttonDireita = tarefa.querySelector('.move-right');

    spanTitle.textContent = texto.trim();

    buttonExcluir.onclick = () => {
        card.remove();
        salvarTarefas();
    };

    buttonEsquerda.onclick = () => moverTarefa(card, -1);
    buttonDireita.onclick = () => moverTarefa(card, 1);

    containerDestino.appendChild(card);
    if (salvar) salvarTarefas();
}

buttonAdicionar.addEventListener('click', () => {
    const texto = inputAdicionar.value.trim();
    criarTarefa(texto, containerTodo);
    inputAdicionar.value = '';
});

inputAdicionar.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') buttonAdicionar.click();
});

carregarTarefas();