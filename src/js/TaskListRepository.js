export class TaskListRepository {
  URL = "tasks";
  addTask = (newTask) => {
    return fetchWrapper.post(this.URL, newTask);
  };
}
