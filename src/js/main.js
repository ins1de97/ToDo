
const form = document.getElementById ("form");
const taskInput = document.getElementById ("form-input");
const taskList = document.getElementById('task-list');
const taskListDone = document.getElementById('done-list');
const taskDone = document.getElementById('task-done');


form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);
taskDone.addEventListener('click', clearDoneTask);


function addTask (e) {
    e.preventDefault();
    const taskText = taskInput.value;
    const taskHTML = `<li class="task-manager__item">
                            <span class="task-manager__text">${taskText}</span>
                            <button class="task-manager__check-button" data-action="done"><img src="./public/svg/chek_mark.svg" alt=""></button>
                            <button class="task-manager__delete-button" data-action="delete"><img src="./public/svg/delete.svg" alt=""></button>
                        </li>`;
    taskList.insertAdjacentHTML('beforeend', taskHTML);

    taskInput.value = '';
    taskInput.focus();
}

function deleteTask (e) {
    if (e.target.dataset.action === 'delete'){
        const taskItem = e.target.closest('.task-manager__item');
        taskItem.remove();
    }
}

function doneTask (e){
    if (e.target.dataset.action === 'done'){
        const taskItem = e.target.closest('.task-manager__item');
        const taskText = taskItem.innerText;
        taskItem.remove(); 
        const taskHTML = `<li class="task-manager__item task-manager__item--completed">
                            <span class="task-manager__text">${taskText}</span>
                        </li>`;
        taskListDone.insertAdjacentHTML('afterbegin', taskHTML);
    }
}

function clearDoneTask (e) {
    if (e.target.dataset.action === 'clear'){
        const taskItem = taskListDone;
        taskItem.innerHTML = '';
    }
}