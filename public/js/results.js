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
      
      // Oblicz sumę punktów
      let totalPoints = 0;
      const pointValues = [20, 15, 10, 8, 6, 5, 4, 3, 2, 1]; // Wartości punktowe jak w Familiadzie
      
      results.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'result-item';
        questionDiv.innerHTML = `<div class="result-question">Pytanie ${qIndex + 1}</div>`;
        
        const answersData = question.map((votes, aIndex) => ({
          answer: aIndex + 1,
          votes,
          points: pointValues[aIndex] || 0
        })).sort((a, b) => b.votes - a.votes);
        
        // Oblicz punkty dla tego pytania
        let questionPoints = 0;
        answersData.forEach((item, index) => {
          const answerDiv = document.createElement('div');
          answerDiv.className = `result-option ${index === 0 ? 'top-answer' : ''}`;
          
          // Dodaj punkty tylko do najwyżej ocenionych odpowiedzi
          const pointsEarned = index < 3 ? item.points : 0;
          questionPoints += pointsEarned;
          
          answerDiv.innerHTML = `
            <span>${item.answer}. ${item.votes} ${item.votes === 1 ? 'głos' : 'głosów'}</span>
            ${index < 3 ? `<span class="points">+${pointsEarned}pkt</span>` : ''}
          `;
          questionDiv.appendChild(answerDiv);
        });
        
        // Dodaj podsumowanie punktów dla pytania
        questionDiv.innerHTML += `
          <div class="question-points">
            Suma punktów: <strong>${questionPoints}pkt</strong>
          </div>
        `;
        
        totalPoints += questionPoints;
        grid.appendChild(questionDiv);
      });
      
      // Dodaj podsumowanie ogólne
      header.innerHTML = `
        <div class="total-points">
          <h3>Podsumowanie</h3>
          <p>Łączna liczba punktów: <strong>${totalPoints}pkt</strong></p>
        </div>
      `;
      
      resultsContainer.style.display = 'block';
      passwordInput.value = '';
      
    } catch (error) {
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