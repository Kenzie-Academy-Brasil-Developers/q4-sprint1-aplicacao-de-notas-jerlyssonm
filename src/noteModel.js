import { v4 } from 'uuid';

export default class Notes {
  constructor(title, content) {
    this.id = v4();
    this.title = title;
    this.content = content;
    this.created_at = new Date();
  }

  updateNote(title, content) {
    this.title = title;
    this.content = content;
    this.updated_at =new Date();
  }
}
