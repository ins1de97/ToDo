const form = document.getElementById("form");
const taskInput = document.getElementById("form-input");
const taskList = document.getElementById("task-list");
const taskListDone = document.getElementById("done-list");
const taskDone = document.getElementById("task-done");

let tasks = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];

form.addEventListener("submit", addTask);
taskList.addEventListener("click", deleteTask);
taskList.addEventListener("click", doneTask);
taskDone.addEventListener("click", clearDoneList);

function addTask(e) {
  e.preventDefault();
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);
  saveToLocalStorage("tasks", tasks);
  renderTask(newTask);

  taskInput.value = "";
  taskInput.focus();
}

function deleteTask(e) {
  if (e.target.dataset.action === "delete") {
    const taskItem = e.target.closest(".task-manager__item");

    const id = Number(taskItem.id);
    tasks = tasks.filter((task) => task.id !== id);
    saveToLocalStorage("tasks", tasks);
    taskItem.remove();
  }
}

function doneTask(e) {
  if (e.target.dataset.action === "done") {
    const taskItem = e.target.closest(".task-manager__item");
    const id = Number(taskItem.id);

    tasks = tasks.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    saveToLocalStorage("tasks", tasks);
    taskItem.remove();
    tasks.forEach((task) => task.id === id && renderTask(task));
  }
}

function clearDoneList(e) {
  if (e.target.dataset.action === "clear") {
    tasks = tasks.filter((task) => !task.done);
    saveToLocalStorage("tasks", tasks);

    taskListDone.innerHTML = "";
  }
}

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function renderTask(task) {
  if (!task.done) {
    const taskHTML = `<li id="${task.id}" class="task-manager__item">
                                <span class="task-manager__item">${task.text}</span>
                                <button class="task-manager__check-button" data-action="done"><img src="./public/svg/chek_mark.svg" alt=""></button>
                                <button class="task-manager__delete-button" data-action="delete"><img src="./public/svg/delete.svg" alt=""></button>
                            </li>`;
    taskList.insertAdjacentHTML("beforeend", taskHTML);
  } else {
    const taskHTML = `<li class="task-manager__item task-manager__item--completed">
    <span class="task-manager__text">${task.text}
    </span> </li>`;
    taskListDone.insertAdjacentHTML("afterbegin", taskHTML);
  }
}
function renderTasks() {
  if (tasks.length > 0) {
    tasks.forEach((task) => renderTask(task));
  }
}
renderTasks();
