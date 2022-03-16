import express from 'express';
import {v4} from 'uuid';

const app = express();
const userList = []
app.use(express.json());

function verifyUserExist(req, res, next) {
  const data = req.body;
  const { cpf } = req.params;
  const user = userList.find((obj) => obj.cpf === cpf);
  if (!user) {
    res.status(404).json({ error: 'user is not registered' });
    return;
  }
  if (data.cpf && user.cpf !== data.cpf) {
    res.status(404).json({ message: 'CPF cannot be changed' });
    return;
  }
  return next();
}

function alreadyExistUser(req, res, next) {
  const { cpf } = req.body;
  const user = userList.find((obj) => obj.cpf === cpf);
  if (user) {
    res.status(422).json({ error: 'user already exists' });
    return;
  }
  return next();
}
function alreadyExistNote(req, res, next) {
  const { cpf, id } = req.params;
  const user = userList.find((obj) => obj.cpf === cpf);
  const note = user.notes.find((obj) => obj.id === id);
  if (!note) {
    res.status(404).json({ error: 'note is not registered' });
    return;
  }
  return next();
}

app.post('/users', alreadyExistUser, (req, res) => {
  const { name, cpf } = req.body;
  const user = new User(name, cpf);
  userList.push(user);
  res.status(201).json(user);
});

app.get('/users', (_, res) => {
  res.json(userList);
});

app.patch('/users/:cpf', verifyUserExist, (req, res) => {
  const data = req.body;
  const { cpf } = req.params;
  const user = userList.find((obj) => obj.cpf === cpf);

  user.updateUse(data.name);

  res.json({
    message: 'User is updated',
    user: user,
  });
});

app.delete('/users/:cpf', verifyUserExist, (req, res) => {
  const newCpf = req.params.cpf;
  userList.pop(newCpf);
  res.status(204).json();
});

app.post('/users/:cpf/notes', verifyUserExist, (req, res) => {
  const { title, content } = req.body;
  const { cpf } = req.params;

  const user = userList.find((obj) => obj.cpf === cpf);
  const note = new Notes(title, content);

  user.setNotes(note);
  res
    .status(201)
    .json({ message: `${note.title} was added into ${user.name}` });
});

app.get('/users/:cpf/notes', verifyUserExist, (req, res) => {
  const newCpf = req.params.cpf;
  const user = userList.find((obj) => obj.cpf === newCpf);
  res.json(user.notes);
});

app.patch(
  '/users/:cpf/notes/:id',
  verifyUserExist,
  alreadyExistNote,
  (req, res) => {
    const { cpf, id } = req.params;
    const { title, content } = req.body;

    const user = userList.find((obj) => obj.cpf === cpf);
    const note = user.notes.find((obj) => obj.id === id);
    note.updateNote(title, content);
    res.json(note);
  }
);

app.delete(
  '/users/:cpf/notes/:id',
  verifyUserExist,
  alreadyExistNote,
  (req, res) => {
    const { cpf, id } = req.params;
    const user = userList.find((obj) => obj.cpf === cpf);
    user.notes.pop(id);
    res.status(204).json();
  }
);

class User {
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
class Notes {
  constructor(title, content) {
    this.id = v4();
    this.title = title;
    this.content = content;
    this.created_at = new Date();
  }

  updateNote(title, content) {
    this.title = title;
    this.content = content;
    this.updated_at = new Date();
  }
}

app.listen(3000);
