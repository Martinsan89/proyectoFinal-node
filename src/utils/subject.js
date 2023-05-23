export default class Subject {
  #observers = new Set();

  suscribe(observer) {
    this.#observers.add(observer);
  }

  unsuscribe(observer) {
    this.#observers.delete(observer);
  }

  notify(message) {
    this.#observers.forEach((observer) => {
      observer.update(message);
    });
  }
}
