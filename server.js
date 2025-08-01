const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'responses.json');
const PASSWORD = 'test1234';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Inicjalizacja danych
function initData() {
  const data = {
    votes: Array.from({length: 15}, () => Array(10).fill(0)),
    participants: []
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data));
  return data;
}

// Endpointy
app.post('/api/vote', (req, res) => {
  try {
    const { userId, answers } = req.body;
    let data;

    try {
      data = JSON.parse(fs.readFileSync(DATA_FILE));
    } catch {
      data = initData();
    }

    if (data.participants.includes(userId)) {
      return res.status(400).json({ error: 'Już głosowałeś!' });
    }

    answers.forEach(({q, a}) => {
      data.votes[q-1][a-1]++;
    });

    data.participants.push(userId);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Błąd serwera' });
  }
});

app.get('/api/results', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(DATA_FILE));
    res.json(data.votes);
  } catch {
    res.json(initData().votes);
  }
});

// Uruchom serwer
app.listen(PORT, () => {
  if (!fs.existsSync(path.dirname(DATA_FILE))) {
    fs.mkdirSync(path.dirname(DATA_FILE));
  }
  console.log(`Serwer działa na http://localhost:${PORT}`);
});