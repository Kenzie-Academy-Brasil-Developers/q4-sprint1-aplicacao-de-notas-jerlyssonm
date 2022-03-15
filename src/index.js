import express from 'express';
import {
  verifyUserExist,
  alreadyExistUser,
  alreadyExistNote,
  userList,
} from './middlewares.js';
import User from './userModel.js';
import Notes from './noteModel.js';

const app = express();
app.use(express.json());

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
  const user = userList.filter((obj) => obj.cpf === cpf);

  user[0].updateUse(data.name);

  res.json({
    message: 'User is updated',
    user: user[0],
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

  const user = userList.filter((obj) => obj.cpf === cpf);
  const note = new Notes(title, content);

  user[0].setNotes(note);
  res
    .status(201)
    .json({ message: `${note.title} was added into ${user[0].name}` });
});

app.get('/users/:cpf/notes', verifyUserExist, (req, res) => {
  const newCpf = req.params.cpf;
  const user = userList.filter((obj) => obj.cpf === newCpf);
  res.json(user[0].notes);
});

app.patch(
  '/users/:cpf/notes/:id',
  verifyUserExist,
  alreadyExistNote,
  (req, res) => {
    const { cpf, id } = req.params;
    const { title, content } = req.body;

    const user = userList.filter((obj) => obj.cpf === cpf);
    const note = user[0].notes.filter((obj) => obj.id === id);
    note[0].updateNote(title, content);
    res.json(note[0]);
  }
);

app.delete(
  '/users/:cpf/notes/:id',
  verifyUserExist,
  alreadyExistNote,
  (req, res) => {
    const { cpf, id } = req.params;
    const user = userList.filter((obj) => obj.cpf === cpf);
    user[0].notes.pop(id);
    res.status(204).json();
  }
);

app.listen(3000);
