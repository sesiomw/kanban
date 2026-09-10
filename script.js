const inputNome = document.querySelector('#nome-usuario');
const buttonEntrar = document.querySelector('#entrar');
const telaIdentificacao = document.querySelector('.identificacao')
const inputAdicionar = document.querySelector('#input-tarefa');
const buttonAdicionar = document.querySelector('#adicionar');
const containerTodo = document.querySelector('.todo-column .cards-container');
const containerDoing = document.querySelector('.doing-column .cards-container');
const containerDone = document.querySelector('.done-column .cards-container');
const templateTarefa = document.querySelector('#templateTarefa');

let nomeUsuario = '';

async function salvarTarefas() {
    function extrairTextos(container) {
        const cards = container.querySelectorAll('.task-card');

        return Array.from(cards).map(card => {
            const titulo = card.querySelector('.task-title');
            const autor = card.querySelector('.task-author');

            return {
                titulo: titulo.textContent,
                autor: autor.textContent
            };
        });
    }

    const dados = {
        todo: extrairTextos(containerTodo),
        doing: extrairTextos(containerDoing),
        done: extrairTextos(containerDone)
    };

console.log(dados);

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

        tarefas.todo.forEach(tarefa => criarTarefa(tarefa.titulo, containerTodo, false, tarefa.autor));
        tarefas.doing.forEach(tarefa => criarTarefa(tarefa.titulo, containerDoing, false, tarefa.autor));
        tarefas.done.forEach(tarefa => criarTarefa(tarefa.titulo, containerDone, false, tarefa.autor));
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

function criarTarefa(texto, containerDestino, salvar = true, autor = nomeUsuario) {
    if (!texto || texto.trim() === '') return;

    const tarefa = templateTarefa.content.cloneNode(true);
    const card = tarefa.querySelector('.task-card');
    const spanTitle = tarefa.querySelector('.task-title');
    const spanAutor = tarefa.querySelector('.task-author');
    const buttonExcluir = tarefa.querySelector('.excluir');
    const buttonEsquerda = tarefa.querySelector('.move-left');
    const buttonDireita = tarefa.querySelector('.move-right');

    spanTitle.textContent = texto.trim();
    spanAutor.textContent = autor;

    buttonExcluir.onclick = () => {
        card.remove();
        salvarTarefas();
    };

    buttonEsquerda.onclick = () => moverTarefa(card, -1);
    buttonDireita.onclick = () => moverTarefa(card, 1);

    containerDestino.appendChild(card);
    if (salvar) salvarTarefas();
}

function verificarNomeUsuario() {
    const nomeSalvo = localStorage.getItem('nomeUsuario');
    if (nomeSalvo == null) {
        return;
    }
    inputNome.value = nomeSalvo;
    nomeUsuario = nomeSalvo;
}

buttonEntrar.addEventListener('click', () => {
    const nome = inputNome.value.trim();
    if (nome === '') {
        return;
    }
    localStorage.setItem('nomeUsuario', nome);
    nomeUsuario = nome;
    telaIdentificacao.style.display = 'none';
})

buttonAdicionar.addEventListener('click', () => {
    const texto = inputAdicionar.value.trim();
    criarTarefa(texto, containerTodo);
    inputAdicionar.value = '';
});

inputAdicionar.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') buttonAdicionar.click();
});

verificarNomeUsuario();
carregarTarefas();