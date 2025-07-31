// Pytania i odpowiedzi
const questions = [
    {
        question: "Co najczęściej robią uczniowie na przerwie?",
        options: ["Odrabiają lekcje", "Grają w gry", "Rozmawiają", "Jedzą", "Biegają"]
    },
    {
        question: "Najpopularniejszy przedmiot szkolny to?",
        options: ["Matematyka", "WF", "Historia", "Język polski", "Informatyka"]
    },
    {
        question: "Co zabierają uczniowie do szkoły, czego nie potrzebują?",
        options: ["Zeszyty", "Podręczniki", "Telefony", "Słodycze", "Zabawki"]
    },
    {
        question: "Gdzie uczniowie spędzają czas po szkole?",
        options: ["W domu", "Na podwórku", "W bibliotece", "Na zajęciach dodatkowych", "U kolegów"]
    },
    {
        question: "Najczęstsza wymówka na nieodrobione zadanie?",
        options: ["Zapomniałem", "Nie miałem czasu", "Zgubiłem zeszyt", "Byłem chory", "Nie zrozumiałem"]
    },
    {
        question: "Ulubiona pora roku uczniów?",
        options: ["Wiosna", "Lato", "Jesień", "Zima", "Wszystkie"]
    },
    {
        question: "Co uczniowie lubią najbardziej w szkole?",
        options: ["Lekcje", "Przerwy", "Wycieczki", "Nauczycieli", "Imprezy szkolne"]
    },
    {
        question: "Najpopularniejszy sport wśród uczniów?",
        options: ["Piłka nożna", "Koszykówka", "Siatkówka", "Bieganie", "Pływanie"]
    },
    {
        question: "Co uczniowie robią, gdy zapomną pracy domowej?",
        options: ["Przepraszają nauczyciela", "Szybko przepisują", "Udają chorobę", "Wymyślają wymówkę", "Nic nie robią"]
    },
    {
        question: "Najlepszy sposób na naukę według uczniów?",
        options: ["Notatki", "Powtarzanie", "Korepetycje", "Grupowa nauka", "Filmy edukacyjne"]
    }
];

let currentQuestion = 0;

// Inicjalizacja ankiety
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion(currentQuestion);
    
    document.getElementById('survey-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const selectedOption = document.querySelector('input[name="option"]:checked');
        
        if (selectedOption) {
            const success = await saveResponse(
                currentQuestion, 
                parseInt(selectedOption.value)
            );
            
            if (success || localStorage.getItem('offline-mode')) {
                currentQuestion++;
                if (currentQuestion < questions.length) {
                    loadQuestion(currentQuestion);
                } else {
                    showEndScreen();
                }
            } else {
                alert('Błąd zapisu! Odpowiedź zapisana lokalnie. Spróbuj ponownie później.');
                localStorage.setItem('offline-mode', 'true');
            }
        } else {
            alert('Proszę wybrać odpowiedź!');
        }
    });
});

// Ładuje pytanie na stronę
function loadQuestion(index) {
    const question = questions[index];
    document.getElementById('question-title').textContent = `Pytanie ${index + 1}`;
    document.getElementById('question-text').textContent = question.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('label');
        optionElement.className = 'option';
        optionElement.innerHTML = `
            <input type="radio" name="option" value="${i}">
            ${option}
        `;
        optionsContainer.appendChild(optionElement);
    });
}

// Zapisuje odpowiedź (GitHub + awaryjnie LocalStorage)
async function saveResponse(questionIndex, optionIndex) {
    const responseData = {
        question: questionIndex,
        option: optionIndex,
        timestamp: new Date().toISOString()
    };

    try {
        const saved = await saveToGitHub(responseData);
        if (!saved) throw new Error('Błąd GitHub API');
        return true;
    } catch (error) {
        console.error('Zapis lokalny (offline):', error);
        const offlineData = JSON.parse(localStorage.getItem('offline-responses') || '[]');
        offlineData.push(responseData);
        localStorage.setItem('offline-responses', JSON.stringify(offlineData));
        return false;
    }
}

// Pokazuje ekran końcowy
function showEndScreen() {
    document.getElementById('survey-container').style.display = 'none';
    document.getElementById('end-screen').style.display = 'block';
    
    // Próbuje wysłać zapisane lokalnie odpowiedzi (jeśli są)
    const offlineData = JSON.parse(localStorage.getItem('offline-responses') || '[]');
    if (offlineData.length > 0) {
        offlineData.forEach(async data => {
            await saveToGitHub(data);
        });
        localStorage.removeItem('offline-responses');
        localStorage.removeItem('offline-mode');
    }
}