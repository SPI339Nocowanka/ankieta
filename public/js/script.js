document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surveyForm');
  const questionsDiv = document.getElementById('questions');
  const messageDiv = document.getElementById('message');

  // Wszystkie 15 pytań z 10 odpowiedziami każdy
  const questions = [
    {
      question: "Pytanie 1",
      options: ["Odpowiedź 1", "Odpowiedź 2", "Odpowiedź 3", "Odpowiedź 4", "Odpowiedź 5", 
               "Odpowiedź 6", "Odpowiedź 7", "Odpowiedź 8", "Odpowiedź 9", "Odpowiedź 10"]
    },
    {
      question: "Pytanie 2",
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

  // Generuj pytania na stronie
  questions.forEach((qData, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `<h3>${qData.question}</h3>`;
    
    qData.options.forEach((option, optionIndex) => {
      questionDiv.innerHTML += `
        <label class="option">
          <input type="radio" name="q${index + 1}" value="${optionIndex + 1}" required>
          <span class="checkmark"></span>
          ${option}
        </label>
      `;
    });
    
    questionsDiv.appendChild(questionDiv);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = 'user-' + Math.random().toString(36).substr(2, 9);
    const answers = [];
    let answeredCount = 0;
    
    questions.forEach((_, index) => {
      const selected = document.querySelector(`input[name="q${index + 1}"]:checked`);
      if (selected) {
        answers.push({ 
          q: index + 1, 
          a: parseInt(selected.value),
          question: questions[index].question,
          answer: questions[index].options[selected.value - 1]
        });
        answeredCount++;
      }
    });

    if (answeredCount === 0) {
      messageDiv.textContent = 'Proszę odpowiedzieć na co najmniej jedno pytanie!';
      messageDiv.className = 'error';
      return;
    }

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers })
      });
      
      const result = await response.json();
      if (result.success) {
        messageDiv.textContent = 'Dziękujemy za udział w ankiecie!';
        messageDiv.className = 'success';
        form.style.display = 'none';
        localStorage.setItem('hasVoted', 'true');
      } else {
        throw new Error(result.error || 'Wystąpił błąd');
      }
    } catch (err) {
      messageDiv.textContent = err.message;
      messageDiv.className = 'error';
    }
  });

  if (localStorage.getItem('hasVoted')) {
    form.style.display = 'none';
    messageDiv.textContent = 'Już uczestniczyłeś w tej ankiecie. Dziękujemy!';
    messageDiv.className = 'success';
  }
});
