import { v4 } from 'uuid';

export default class User {
  constructor(name, cpf) {
    this.id = v4();
    this.name = name;
    this.cpf = cpf;
    this.notes = [];
  }

  setNotes(note) {
    this.notes.push(note);
  }

  updateUse(name) {
    this.name = name;
  }
}
