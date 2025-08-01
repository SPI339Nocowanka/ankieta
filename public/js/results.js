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
      
      resultsContainer.innerHTML = '<div class="results-grid"></div>';
      const grid = resultsContainer.querySelector('.results-grid');
      
      results.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'result-item';
        questionDiv.innerHTML = `<div class="result-question">Pytanie ${qIndex + 1}</div>`;
        
        const answersData = question.map((votes, aIndex) => ({
          answer: aIndex + 1,
          votes
        })).sort((a, b) => b.votes - a.votes);
        
        answersData.forEach((item, index) => {
          const answerDiv = document.createElement('div');
          answerDiv.className = `result-option ${index === 0 ? 'top-answer' : ''}`;
          answerDiv.innerHTML = `
            <span>Odpowiedź ${item.answer}</span>
            <span>${item.votes} ${item.votes === 1 ? 'głos' : 'głosów'}</span>
          `;
          questionDiv.appendChild(answerDiv);
        });
        
        grid.appendChild(questionDiv);
      });
      
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