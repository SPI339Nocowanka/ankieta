const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'responses.json');
const PASSWORD = 'test1234';

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Utwórz folder data jeśli nie istnieje
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// Inicjalizacja pliku danych
function initializeDataFile() {
    const initialData = {
        responses: Array.from({length: 15}, (_, i) => ({
            questionId: i + 1,
            questionText: `Pytanie ${i + 1}: Najlepsza odpowiedź to...?`,
            options: Array.from({length: 10}, (_, j) => ({
                id: j + 1,
                text: `Opcja ${j + 1}`,
                votes: 0
            }))
        })),
        votedIPs: [],
        cookies: [] // Nowa tablica na identyfikatory ciasteczek
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
}

// Funkcja do bezpiecznego odczytu danych
function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return initializeDataFile();
        }

        const rawData = fs.readFileSync(DATA_FILE, 'utf8');
        
        if (!rawData.trim()) {
            return initializeDataFile();
        }

        return JSON.parse(rawData);
    } catch (err) {
        console.error('Błąd odczytu pliku danych:', err);
        return initializeDataFile();
    }
}

// Endpoint do głosowania
app.post('/api/vote', (req, res) => {
    try {
        const { answers, cookieId } = req.body; // Teraz używamy cookieId zamiast IP
        const db = readData();

        // Sprawdź czy cookieId już głosowało
        if (db.cookies.includes(cookieId)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Już głosowałeś! Można głosować tylko raz.' 
            });
        }

        // Zaktualizuj głosy
        answers.forEach(answer => {
            const question = db.responses.find(q => q.questionId === answer.questionId);
            if (question) {
                const option = question.options.find(o => o.id === answer.answerId);
                if (option) option.votes++;
            }
        });

        // Zapisz identyfikator ciasteczka
        db.cookies.push(cookieId);
        fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
        
        res.json({ 
            success: true,
            message: 'Dziękujemy za oddanie głosu!' 
        });
    } catch (err) {
        console.error('Błąd podczas głosowania:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Wystąpił błąd serwera podczas przetwarzania głosu' 
        });
    }
});

// Endpoint do wyników (pozostał bez zmian)
app.post('/api/results', (req, res) => {
    try {
        const { password } = req.body;
        
        if (password !== PASSWORD) {
            return res.status(401).json({ 
                success: false, 
                message: 'Nieprawidłowe hasło' 
            });
        }

        const db = readData();
        const sortedResponses = db.responses.map(question => ({
            ...question,
            options: question.options.sort((a, b) => b.votes - a.votes)
        }));

        res.json({ 
            success: true, 
            results: sortedResponses 
        });
    } catch (err) {
        console.error('Błąd podczas pobierania wyników:', err);
        res.status(500).json({ 
            success: false, 
            message: 'Błąd serwera' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
    readData(); // Inicjalizacja przy starcie
});