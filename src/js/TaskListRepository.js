import { FetchWrapper } from "../../shared/FetchWrapper";

export class TaskListRepository {
  URL = "tasks";
  constructor(API) {
    this.fetchWrapper = new FetchWrapper(API);
  }
  addTask = (newTask) => {
    return this.fetchWrapper.post(this.URL, newTask);
  };
  deleteTask = (id) => {
    this.fetchWrapper.delete(this.URL, id);
  };
  doneTask = (body, id) => {
    return this.fetchWrapper.patch(this.URL, body, id);
  };
  getTasks = () => {
    return this.fetchWrapper.get(this.URL);
  };
}
