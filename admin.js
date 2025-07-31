document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        
        if (password === 'test1234') {
            document.getElementById('login-container').style.display = 'none';
            document.getElementById('results-container').style.display = 'block';
            loadResults();
        } else {
            alert('Nieprawidłowe hasło!');
        }
    });
    
    document.getElementById('refresh-btn').addEventListener('click', loadResults);
});

// Ładuje wyniki z GitHub
async function loadResults() {
    try {
        const fileData = await fetchGitHubFile();
        const rawData = fileData ? fileData.content : [];
        const processedData = processResponses(rawData);
        displayResults(processedData);
    } catch (error) {
        console.error('Błąd:', error);
        document.getElementById('results').innerHTML = `
            <p class="error">Błąd przy ładowaniu wyników. Spróbuj ponownie.</p>
        `;
    }
}

// Przetwarza surowe dane na macierz wyników
function processResponses(rawData) {
    const results = Array(questions.length).fill().map(() => Array(5).fill(0));
    
    rawData.forEach(response => {
        if (response.question >= 0 && response.question < questions.length) {
            results[response.question][response.option]++;
        }
    });
    
    return results;
}

// Wyświetla wyniki
function displayResults(responses) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
    
    let totalParticipants = 0;

    questions.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-result';
        
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Pytanie ${qIndex + 1}: ${question.question}`;
        questionDiv.appendChild(questionTitle);
        
        const total = responses[qIndex].reduce((a, b) => a + b, 0);
        totalParticipants = Math.max(totalParticipants, total);
        
        question.options.forEach((option, oIndex) => {
            const count = responses[qIndex][oIndex];
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            
            const optionDiv = document.createElement('div');
            optionDiv.innerHTML = `
                <p>${option}: <strong>${count}</strong> głosów (${percentage}%)</p>
                <div class="answer-bar" style="width: ${percentage}%">
                    ${percentage > 5 ? percentage + '%' : ''}
                </div>
            `;
            questionDiv.appendChild(optionDiv);
        });
        
        resultsContainer.appendChild(questionDiv);
    });
    
    // Dodaj podsumowanie
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'summary';
    summaryDiv.innerHTML = `
        <h3>Podsumowanie</h3>
        <p>Łączna liczba uczestników: <strong>${totalParticipants}</strong></p>
        <button id="export-json" class="export-btn">Pobierz pełne dane (JSON)</button>
    `;
    resultsContainer.appendChild(summaryDiv);
    
    // Przycisk eksportu
    document.getElementById('export-json').addEventListener('click', exportToJSON);
}

// Eksportuje pełne dane do pliku JSON
async function exportToJSON() {
    try {
        const fileData = await fetchGitHubFile();
        const data = fileData ? fileData.content : [];
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `familiada-wyniki-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    } catch (error) {
        alert('Błąd eksportu: ' + error.message);
    }
}