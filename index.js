import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;

  if (!username) {
    res.status(422).send('Campo "username" obrigatório!');
    return;
  }

  if (users.some(user => user.username === username)) {
    res.status(409).send('Usuário já cadastrado!');
    return;
  }

  if (!avatar) {
    res.status(422).send('Campo "avatar" obrigatório!');
    return;
  }

  users.push(req.body);
  res.sendStatus(201);
});

app.post('/tweets', (req, res) => {
  const { username, tweet } = req.body;

  if (!username) {
    res.status(422).send('Campo "username" obrigatório!');
    return;
  }

  if (!tweet) {
    res.status(422).send('Campo "tweet" obrigatório!');
    return;
  }
  const avatar = users.find(user => user.username === username).avatar;

  tweets.push({
    username,
    avatar,
    tweet
  });

  res.sendStatus(200);
});

app.get('/tweets', (req, res) => {
  res.send(tweets);
});

app.listen(5000);