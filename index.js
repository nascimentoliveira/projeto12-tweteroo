import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];
const PORT = 5000;

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;

  if (!username) {
    res.status(400).send('Todos os campos são obrigatórios! Campo "username" obrigatório!');
    return;
  }

  if (users.some(user => user.username === username)) {
    res.status(409).send('Usuário já cadastrado! Escolha outro username ou entre com sua conta!');
    return;
  }

  if (!avatar) {
    res.status(400).send('Todos os campos são obrigatórios! Campo "avatar" obrigatório!');
    return;
  }

  users.push({ username, avatar });
  res.status(201).send('OK');
});

app.post('/tweets', (req, res) => {
  const { tweet } = req.body;
  const username = req.headers.user;

  if (!username) {
    res.status(400).send('Headers deve conter o campo "User"!');
    return;
  }

  if (!tweet) {
    res.status(400).send('Todos os campos são obrigatórios! Campo "tweet" obrigatório!');
    return;
  }

  const avatar = users.find(user => user.username === username).avatar;

  tweets.unshift({
    username,
    avatar,
    tweet
  });

  res.status(201).send('OK');
});

app.get('/tweets', (req, res) => {

  const page = parseInt(req.query.page);

  if (!page) {
    res.status(200).send(tweets);
    return;
  }

  if (page < 1) {
    res.status(400).send('Informe uma página válida!');
    return;
  }

  if ((page - 1) * 10 > tweets.length) {
    res.status(204);
    return;
  }

  res.status(200).send(
    tweets.slice(
      (page - 1) * 10,
      (tweets.length < (page) * 10) ? tweets.length : (page) * 10
    )
  );
});

app.get("/tweets/:user", (req, res) => {

  const userQuery = req.params.user;

  if (!users.some(user => user.username === userQuery)) {
    res.status(400).send('Usuário não cadastrado!');
    return;
  }

  const tweetsUser = tweets.filter((tweet) => tweet.username === userQuery);

  res.status(200).send(tweetsUser);
});

app.listen(PORT, function (err) {

  if (err) console.log(err);
  console.log("Server listening on PORT", PORT);
});