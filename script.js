const inputAdicionar = document.querySelector('#input-tarefa');
const buttonAdicionar = document.querySelector('#adicionar');
const containerTodo = document.querySelector('.todo-column');
const containerDoing = document.querySelector('.doing-column');
const containerDone = document.querySelector('.done-column');
const templateTarefa = document.querySelector('template');

function salvarTarefas() {

    function extrairTextos(container) {
        const titulos = container.querySelectorAll('.task-card span');
        return Array.from(titulos).map(elemento => elemento.textContent);
    }

    const dados = {
        todo: extrairTextos(containerTodo),
        doing: extrairTextos(containerDoing),
        done: extrairTextos(containerDone)
    };

    localStorage.setItem('tarefas', JSON.stringify(dados));
};

function carregarTarefas() {
   const dadosString = localStorage.getItem('tarefas');
   if (!dadosString) return;

   const dados = JSON.parse(dadosString);
   dados.todo.forEach(texto => criarTarefa(texto, containerTodo));
   dados.doing.forEach(texto => criarTarefa(texto, containerDoing));
   dados.done.forEach(texto => criarTarefa(texto, containerDone));
};

function moverTarefa(tarefa, direcao) {
    const colunas = [containerTodo, containerDoing, containerDone];
    const colunaAtual = card.parentElement;

    const indexAtual = colunas.indexOf(colunaAtual);
    const indexNovo = indexAtual + direcao;

    if (indexNovo < 0 || indexNovo >= colunas.lenght) return;
    card.remove();
    colunas[indexNovo].appendChild(card);

    salvarTarefas();


};

function criarTarefa(texto, containerDestino) {
    if (texto.trim() === '') return;
    const tarefa = templateTarefa.content.cloneNode(true);
    const card = tarefa.querySelector('.task-card');
    const spanTitle = tarefa.querySelector('span');
    const buttonExcluir = tarefa.querySelector('.excluir');
    const buttonEsquerda = tarefa.querySelector('.move-left');
    const buttonDireita = tarefa.querySelector('.move-right');

    spanTitle.textContent = texto;
    buttonExcluir.onclick = () => {
        card.remove();
        salvarTarefas();
    };

    buttonEsquerda.onclick = () => moverTarefa(card, -1);
    buttonDireita.onclick = () => moverTarefa(card, 1);
    containerDestino.appendChild(card);
    salvarTarefas();
};

buttonAdicionar.addEventListener('click', () => {
    const texto = inputAdicionar.value.trim();
    criarTarefa(texto, containerTodo);
    inputAdicionar.value = '';
});

inputAdicionar.addEventListener('keypress', (event) => {
    if (event.key !== 'Enter') return;
    buttonAdicionar.click();
});

carregarTarefas();
