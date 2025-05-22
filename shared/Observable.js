export class Observable {
  subcriblers = new Set();
  constructor(initialValue) {
    this.value = initialValue;
  }

  subscribe = (fn) => {
    this.subcriblers.add(fn);
  };
  unsubscribe = (fn) => {
    this.subcriblers.delete(fn);
  };

  notify = (data = this.value) => {
    this.subcriblers.forEach((fn) => fn(data));
  };
}
