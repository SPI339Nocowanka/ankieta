document.addEventListener('DOMContentLoaded', async () => {
  const passwordInput = document.getElementById('passwordInput');
  const showResultsBtn = document.getElementById('showResultsBtn');
  const resultsContainer = document.getElementById('resultsContainer');

  showResultsBtn.addEventListener('click', async () => {
    if (passwordInput.value !== 'test1234') {
      alert('❌ Nieprawidłowe hasło! Spróbuj ponownie.');
      return;
    }

    try {
      const response = await fetch('/api/results');
      const results = await response.json();
      
      resultsContainer.innerHTML = '<div class="results-header"></div><div class="results-grid"></div>';
      const header = resultsContainer.querySelector('.results-header');
      const grid = resultsContainer.querySelector('.results-grid');
      
      let totalPoints = 0;

      results.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'result-item';
        questionDiv.innerHTML = `<div class="result-question">Pytanie ${qIndex + 1}</div>`;
        
        // Przygotuj i posortuj odpowiedzi
        const answersData = question.map((votes, aIndex) => ({
          answer: aIndex + 1,
          votes: votes || 0
        })).sort((a, b) => b.votes - a.votes);
        
        // Oblicz punkty dynamicznie na podstawie najlepszej odpowiedzi
        const maxVotes = answersData[0]?.votes || 1;
        let questionPoints = 0;
        
        // Współczynniki punktowe (proporcjonalne do głosów)
        const pointValues = [
          Math.round(maxVotes * 1.0),  // 1. miejsce - 100%
          Math.round(maxVotes * 0.7),  // 2. miejsce - 70%
          Math.round(maxVotes * 0.5),  // 3. miejsce - 50%
          Math.round(maxVotes * 0.3),  // 4. miejsce - 30%
          Math.round(maxVotes * 0.1)   // 5. miejsce - 10%
        ];
        
        // Wyświetl 5 najlepszych odpowiedzi
        answersData.slice(0, 5).forEach((item, index) => {
          const points = pointValues[index] || 0;
          questionPoints += points;
          
          const answerDiv = document.createElement('div');
          answerDiv.className = `result-option ${index < 3 ? 'top-answer' : ''}`;
          
          answerDiv.innerHTML = `
            <span>Odpowiedź ${item.answer}: ${item.votes} ${item.votes === 1 ? 'głos' : 'głosów'}</span>
            <span class="points">+${points}pkt</span>
          `;
          questionDiv.appendChild(answerDiv);
        });

        totalPoints += questionPoints;

        // Dodaj podsumowanie punktów
        questionDiv.innerHTML += `
          <div class="question-points">
            Suma punktów: <strong>${questionPoints}pkt</strong>
          </div>
        `;

        grid.appendChild(questionDiv);
      });

      // Podsumowanie ogólne
      header.innerHTML = `
        <div class="total-points">
          <h3>Podsumowanie</h3>
          <p>Łączna liczba punktów: <strong>${totalPoints}pkt</strong></p>
        </div>
      `;

      resultsContainer.style.display = 'block';
      passwordInput.value = '';
      
    } catch (error) {
      console.error('Błąd:', error);
      resultsContainer.innerHTML = '😢 Wystąpił błąd podczas ładowania wyników';
      resultsContainer.style.display = 'block';
    }
  });

  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      showResultsBtn.click();
    }
  });
});