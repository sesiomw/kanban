const containerAdicionar = document.querySelector('adicionar');
const inputAdicionar = document.querySelector('input');
const buttonAdicionar = document.querySelector('button');
const containerTodo = document.querySelector('.todo-column');
const containerDoing = document.querySelector('.doing-column');
const containerDone = document.querySelector('.done-column');
const templateTarefa = document.querySelector('template');

function salvarTarefas() {
    const nodeListTarefas = containerTodo.querySelectorAll('.task-card');
    const arrayTarefas = Array.from(nodeListTarefas).map((tarefa) => tarefa.textContent);
    localStorage.setItem('tarefas', JSON.stringify(arrayTarefas));
}

function criarTarefa(texto) {
    if (texto.trim() === '') return;
    const tarefa = templateTarefa.content.cloneNode(true);
    const spanTitle = tarefa.querySelector('span');
    const buttonExcluir = tarefa.querySelector('.excluir');
    spanTitle.textContent = texto;
    buttonExcluir.onclick = () => {buttonExcluir.closest('.task-card').remove()
        salvarTarefas();
    };
    containerTodo.appendChild(tarefa);
    salvarTarefas();
};

buttonAdicionar.addEventListener('click', () => {
    const texto = inputAdicionar.value.trim();
    criarTarefa(texto);
    inputAdicionar.value = '';
});

inputAdicionar.addEventListener('keypress', (event) => {
    if (event.key !== 'Enter') return;
    buttonAdicionar.click();
});
