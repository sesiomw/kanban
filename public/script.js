const inputAdicionar = document.querySelector('#input-tarefa');
const buttonAdicionar = document.querySelector('#adicionar');
const containerTodo = document.querySelector('.todo-column .cards-container');
const containerDoing = document.querySelector('.doing-column .cards-container');
const containerDone = document.querySelector('.done-column .cards-container');
const templateTarefa = document.querySelector('#templateTarefa');

function salvarTarefas() {
    function extrairTextos(container) {
        const titulos = container.querySelectorAll('.task-card .task-title');
        return Array.from(titulos).map(el => el.textContent);
    }

    const dados = {
        todo: extrairTextos(containerTodo),
        doing: extrairTextos(containerDoing),
        done: extrairTextos(containerDone)
    };
    localStorage.setItem('tarefas', JSON.stringify(dados));
}

function carregarTarefas() {
    const dadosString = localStorage.getItem('tarefas');
    if (!dadosString) return;

    try {
        const dados = JSON.parse(dadosString);
        dados.todo.forEach(texto => criarTarefa(texto, containerTodo, false));
        dados.doing.forEach(texto => criarTarefa(texto, containerDoing, false));
        dados.done.forEach(texto => criarTarefa(texto, containerDone, false));
        salvarTarefas();
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