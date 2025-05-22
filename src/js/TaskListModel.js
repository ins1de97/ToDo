import { Observable } from "../../shared/Observable";

export class TaskListModel {
  constructor(initialValue) {
    this.tasks = new Observable(initialValue);
  }

  addTask = (newTask) => {
    this.tasks.value.push(newTask);
    this.tasks.notify();
  };
  deleteTask = (id) => {
    this.tasks.value = this.tasks.value.filter((task) => task.id !== id);
    this.tasks.notify();
  };
  toggleTask = (id) => {
    this.tasks.value = this.tasks.value.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item
    );
    this.tasks.notify();
  };
  getTaskById = (id) => {
    return this.tasks.value.find((task) => task.id === id);
  };
}
