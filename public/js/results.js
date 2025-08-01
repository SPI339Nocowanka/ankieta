document.addEventListener('DOMContentLoaded', async () => {
  const passwordInput = document.getElementById('passwordInput');
  const showResultsBtn = document.getElementById('showResultsBtn');
  const resultsContainer = document.getElementById('resultsContainer');

  const questions = [
    {
      question: "Co można znaleźć w łazience",
      options: ["Wanna", "Toaleta", "Umywalka", "Przysznic", "Papier Toaletowy", 
               "Szczoteczka do zębów", "Chemikalia", "Ręcznik", "Suszarka", "Lustro"]
    },
    {
      question: "sss",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 3",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 4",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 5",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 6",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 7",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 8",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 9",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 10",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 11",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 12",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 13",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 14",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 15",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    }
  ];

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
        questionDiv.innerHTML = `<div class="result-question">${questions[qIndex].question}</div>`;
        
        const answersData = question.map((votes, aIndex) => ({
          text: questions[qIndex].options[aIndex],
          votes: votes || 0
        })).sort((a, b) => b.votes - a.votes);
        
        const maxVotes = answersData[0]?.votes || 1;
        let questionPoints = 0;
        
        const pointValues = [
          Math.round(maxVotes * 1.0),
          Math.round(maxVotes * 0.7),
          Math.round(maxVotes * 0.5),
          Math.round(maxVotes * 0.3),
          Math.round(maxVotes * 0.1)
        ];
        
        answersData.slice(0, 5).forEach((item, index) => {
          const points = pointValues[index] || 0;
          questionPoints += points;
          
          const answerDiv = document.createElement('div');
          answerDiv.className = `result-option ${index < 3 ? 'top-answer' : ''}`;
          
          answerDiv.innerHTML = `
            <span>${item.text}: ${item.votes} ${item.votes === 1 ? 'głos' : 'głosów'}</span>
            <span class="points">+${points}pkt</span>
          `;
          questionDiv.appendChild(answerDiv);
        });

        totalPoints += questionPoints;

        questionDiv.innerHTML += `
          <div class="question-points">
            Suma punktów: <strong>${questionPoints}pkt</strong>
          </div>
        `;

        grid.appendChild(questionDiv);
      });

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
