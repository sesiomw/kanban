const inputNome = document.querySelector('#nome-usuario');
const buttonEntrar = document.querySelector('#entrar');
const telaIdentificacao = document.querySelector('.identificacao')
const inputAdicionar = document.querySelector('#input-tarefa');
const inputPrazo = document.querySelector('#input-prazo');
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
            const prazo = card.querySelector('.task-deadline');

            return {
                titulo: titulo.textContent,
                autor: autor.textContent,
                prazo: card.dataset.prazo || ''
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
        limparTarefas();
        tarefas.todo.forEach(tarefa => criarTarefa(tarefa.titulo, containerTodo, false, tarefa.autor, tarefa.prazo));
        tarefas.doing.forEach(tarefa => criarTarefa(tarefa.titulo, containerDoing, false, tarefa.autor, tarefa.prazo));
        tarefas.done.forEach(tarefa => criarTarefa(tarefa.titulo, containerDone, false, tarefa.autor, tarefa.prazo));
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

function limparTarefas() {
    containerTodo.innerHTML = '';
    containerDoing.innerHTML = '';
    containerDone.innerHTML = '';
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

setInterval(carregarTarefas, 2000);

function criarTarefa(texto, containerDestino, salvar = true, autor = nomeUsuario, prazo = '') {
    if (!texto || texto.trim() === '') return;

    const tarefa = templateTarefa.content.cloneNode(true);
    const card = tarefa.querySelector('.task-card');
    const spanTitle = tarefa.querySelector('.task-title');
    const spanAutor = tarefa.querySelector('.task-author');
    const spanPrazo = tarefa.querySelector('.task-deadline');
    card.dataset.prazo = prazo;
    const buttonExcluir = tarefa.querySelector('.excluir');
    const buttonEsquerda = tarefa.querySelector('.move-left');
    const buttonDireita = tarefa.querySelector('.move-right');

    spanTitle.textContent = texto.trim();
    spanAutor.textContent = autor;
    spanPrazo.textContent = formatarData(prazo);

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

function formatarData(data) {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
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
    const prazo = inputPrazo.value;
    criarTarefa(texto, containerTodo, true, nomeUsuario, prazo);
    inputAdicionar.value = '';
    inputPrazo.value = '';
});

inputAdicionar.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') buttonAdicionar.click();
});

verificarNomeUsuario();
carregarTarefas();