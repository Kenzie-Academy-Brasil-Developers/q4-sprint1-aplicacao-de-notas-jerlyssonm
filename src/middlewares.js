export const userList = [];

export function verifyUserExist(req, res, next) {
  const data = req.body;
  const { cpf } = req.params;
  const user = userList.filter((obj) => obj.cpf === cpf);
  if (!user[0]) {
    res.status(404).json({ error: 'user is not registered' });
    return;
  }
  if (data.cpf && user[0].cpf !== data.cpf) {
    res.status(404).json({ message: 'CPF cannot be changed' });
    return;
  }
  return next();
}

export function alreadyExistUser(req, res, next) {
  const { cpf } = req.body;
  const user = userList.filter((obj) => obj.cpf === cpf);
  if (user[0]) {
    res.status(422).json({ error: 'user already exists' });
    return;
  }
  return next();
}

export function alreadyExistNote(req, res, next) {
  const { cpf, id } = req.params;
  const user = userList.filter((obj) => obj.cpf === cpf);
  const note = user[0].notes.filter((obj) => obj.id === id);
  if (!note[0]) {
    res.status(404).json({ error: 'note is not registered' });
    return;
  }
  return next();
}
