const API = "https://01a39814699ce8fa.mokky.dev/tasks";
const form = document.getElementById("form");
const taskInput = document.getElementById("form-input");
const taskList = document.getElementById("task-list");
const taskListDone = document.getElementById("done-list");
const taskDone = document.getElementById("task-done");
let tasks = await getTasks();

form.addEventListener("submit", addTask);
taskList.addEventListener("click", deleteTask);
taskList.addEventListener("click", doneTask);
taskDone.addEventListener("click", clearDoneList);

async function addTask(e) {
  e.preventDefault();
  const taskText = taskInput.value;
  const newTask = {
    text: taskText,
    done: false,
  };
  try {
    const task = await addServerTask(newTask);
    tasks.push(task);
    saveToLocalStorage("tasks", tasks);
    renderTask(task);
    taskInput.value = "";
    taskInput.focus();
  } catch (error) {
    console.log("Ошибка при отправки задачи");
  }
}

async function deleteTask(e) {
  if (e.target.dataset.action === "delete") {
    const taskItem = e.target.closest(".task-manager__item");
    const id = Number(taskItem.id);
    tasks = tasks.filter((task) => task.id !== id);
    try {
      await deleteServerTask(id);
      saveToLocalStorage("tasks", tasks);
      taskItem.remove();
    } catch (error) {
      console.log("Ошибка при удалении, попробуйте еще раз");
    }
  }
}

async function doneTask(e) {
  if (e.target.dataset.action === "done") {
    const taskItem = e.target.closest(".task-manager__item");
    const id = Number(taskItem.id);
    tasks = tasks.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    const task = tasks.find((task) => task.id === id);
    try {
      await doneServerTask(id, task);
      saveToLocalStorage("tasks", tasks);
      taskItem.remove();
      renderTask(task);
    } catch (error) {
      console.log("Ошибка! Попробуйте еще раз");
    }
  }
}

async function clearDoneList(e) {
  if (e.target.dataset.action === "clear") {
    tasks = tasks.filter((task) => !task.done);
    try {
      await clearServerDoneTask(tasks);
      saveToLocalStorage("tasks", tasks);
      taskListDone.innerHTML = "";
    } catch (error) {
      console.log("Ошибка! Попробуйте еще раз");
    }
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
function renderTasks(tasks) {
  if (tasks.length > 0) {
    tasks.forEach((task) => renderTask(task));
  }
}

async function getServerTasks() {
  try {
    const respons = await fetch(API);
    const result = await respons.json();
    return result;
  } catch (error) {
    throw error;
  }
}

async function addServerTask(payload) {
  try {
    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Falled to add");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw error;
  }
}

async function deleteServerTask(id) {
  try {
    const response = await fetch(API + "/" + id, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Задача не удалена");
    }
  } catch (error) {
    throw error;
  }
}

async function doneServerTask(id, payload) {
  try {
    const respons = await fetch(API + "/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!respons.ok) {
      throw new Error("Ошибка ответа от сервера");
    }
  } catch (error) {
    throw error;
  }
}
async function clearServerDoneTask(payload) {
  try {
    const respons = await fetch(API, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!respons.ok) {
      throw new Error("Ошибка ответа от сервера");
    }
  } catch (error) {
    throw error;
  }
}

async function getTasks() {
  let tasks = null;
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  } else {
    try {
      tasks = await getServerTasks();
    } catch (error) {
      console.log("Falled to tasks");
    }
  }
  return tasks;
}

renderTasks(await getTasks());
