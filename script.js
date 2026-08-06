const containerAdicionar = document.querySelector('adicionar');
const inputAdicionar = document.querySelector('input');
const buttonAdicionar = document.querySelector('button');
const containerTodo = document.querySelector('.todo-column');
const containerDoing = document.querySelector('.doing-column');
const containerDone = document.querySelector('.done-column');
const templateTarefa = document.querySelector('template');

function criarTarefa(texto) {
    if (texto.trim() === '') return;
    const tarefa = templateTarefa.content.cloneNode(true);
    const spanTitle = tarefa.querySelector('span');
    const buttonExcluir = tarefa.querySelector('.excluir');
    spanTitle.textContent = texto;
    buttonExcluir.onclick = () => {buttonExcluir.closest('.task-card').remove()};
    containerTodo.appendChild(tarefa);
}

buttonAdicionar.addEventListener('click', () => {
    const texto = inputAdicionar.value.trim();
    criarTarefa(texto);
    inputAdicionar.value = '';
});
