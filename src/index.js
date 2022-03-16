import express from 'express';
import {v4} from 'uuid';

const app = express();
const userList = []
app.use(express.json());

//Middlewares

function verifyUserExist(req, res, next) {
  const { cpf } = req.params;
  const user = userList.find((obj) => obj.cpf === cpf);
  if (!user) {
    return res.status(404).json({ error: 'user is not registered' });
  }
  if (req.body.cpf && user.cpf !== req.body.cpf) {
    return res.status(404).json({ message: 'CPF cannot be changed' });
  }
  req.user = user;
  return next();
}

function alreadyExistUser(req, res, next) {
  const { name, cpf } = req.body;
  const user = userList.find((obj) => obj.cpf === cpf);
  if (user) {
    return res.status(422).json({ error: 'user already exists' });
  }else{
    const user = new User(name, cpf);
    req.user = user;
  }
  return next();
}

function alreadyExistNote(req, res, next) {
  const { id } = req.params;
  const {user} = req
  const note = user.notes.find((obj) => obj.id === id);
  if (!note) {
    return res.status(404).json({ error: 'note is not registered' });
  }
  req.note = note;
  return next();
}

//Rotas

app.get('/users', (_, res) => {
  res.json(userList);
});

app.post('/users', alreadyExistUser, (req, res) => {
  const {user} = req
  userList.push(user);
  res.status(201).json(user);
});

app.patch('/users/:cpf', verifyUserExist, (req, res) => {
  const {name} = req.body;
  const {user} = req;

  user.updateUse(name);

  res.json({
    message: 'User is updated',
    user: user,
  });
});

app.delete('/users/:cpf', verifyUserExist, (req, res) => {
  const {cpf} = req.params;
  userList.pop(cpf);
  res.status(204).json();
});

app.post('/users/:cpf/notes', verifyUserExist, (req, res) => {
  const { title, content } = req.body;
  const note = new Notes(title, content);
  const {user} = req;
  user.setNotes(note);
  res
    .status(201)
    .json({ message: `${note.title} was added into ${user.name}` });
});

app.get('/users/:cpf/notes', verifyUserExist, (req, res) => {
  const {user} = req
  res.json(user.notes);
});

app.patch(
  '/users/:cpf/notes/:id',
  verifyUserExist,
  alreadyExistNote,
  (req, res) => {
    const { title, content } = req.body;
    const {note} = req;

    note.updateNote(title, content);
    res.json(note);
  }
);

app.delete(
  '/users/:cpf/notes/:id',
  verifyUserExist,
  alreadyExistNote,
  (req, res) => {
    const {id} = req.params;
    const {user} = req;
    user.notes.pop(id);
    res.status(204).json();
  }
);

// Classes de User e Notes
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
