import { FetchWrapper } from "../../shared/FetchWrapper";
import { TaskListModel } from "./TaskListModel";
import { TaskListRepository } from "./TaskListRepository";
const API = "https://01a39814699ce8fa.mokky.dev";

const form = document.getElementById("form");
const taskInput = document.getElementById("form-input");
const taskList = document.getElementById("task-list");
const taskListDone = document.getElementById("done-list");
const taskWrapper = document.getElementById("tasks");

let initialValue = await getTasks();
const { addTask, deleteTask, toggleTask, getTaskById, tasks } =
  new TaskListModel(initialValue);

const taskRepository = new TaskListRepository(API);

tasks.subscribe((value) => {
  saveToLocalStorage("tasks", value);
});

form.addEventListener("submit", addTaskV);
taskList.addEventListener("click", doneTaskV);
taskWrapper.addEventListener("click", deleteTaskV);

async function addTaskV(e) {
  e.preventDefault();
  const taskText = taskInput.value;
  const newTask = {
    text: taskText,
    done: false,
  };
  try {
    const task = await taskRepository.addTask(newTask);
    addTask(task);
    renderTask(task);
    taskInput.value = "";
    taskInput.focus();
  } catch (error) {
    console.log("Ошибка при отправки задачи");
  }
}

async function deleteTaskV(e) {
  if (e.target.dataset.action === "delete") {
    const taskItem = e.target.closest(".task-manager__item");
    const id = Number(taskItem.id);
    try {
      await taskRepository.deleteTask(id);
      deleteTask(id);
      taskItem.remove();
    } catch (error) {
      console.log("Ошибка при удалении, попробуйте еще раз");
    }
  }
}

async function doneTaskV(e) {
  if (e.target.dataset.action === "done") {
    const taskItem = e.target.closest(".task-manager__item");
    const id = Number(taskItem.id);
    const task = getTaskById(id);
    try {
      const newTask = await taskRepository.doneTask({ done: !task.done }, id);
      toggleTask(id);
      taskItem.remove();
      renderTask(newTask);
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
    const taskHTML = `<li id="${task.id}" class="task-manager__item task-manager__item--completed">
    <span class="task-manager__text">${task.text}</span>
    <button class="task-manager__delete-button" data-action="delete"><img src="./public/svg/delete.svg" alt=""></button> 
    </li>`;
    taskListDone.insertAdjacentHTML("afterbegin", taskHTML);
  }
}
function renderTasks(tasks) {
  if (tasks.length > 0) {
    tasks.forEach((task) => renderTask(task));
  }
}

async function getTasks() {
  let tasks = null;
  if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  } else {
    try {
      tasks = taskRepository.getTasks();
    } catch (error) {
      console.log(error);
    }
  }
  return tasks;
}

renderTasks(await getTasks());
