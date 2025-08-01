document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surveyForm');
  const questionsDiv = document.getElementById('questions');
  const messageDiv = document.getElementById('message');

  // Generuj pytania
  for (let q = 1; q <= 15; q++) {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `<h3>Pytanie ${q}</h3>`;
    
    for (let a = 1; a <= 10; a++) {
      questionDiv.innerHTML += `
        <label class="option">
          <input type="radio" name="q${q}" value="${a}" required>
          <span class="checkmark"></span>
          Odpowiedź ${a}
        </label>
      `;
    }
    questionsDiv.appendChild(questionDiv);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = 'user-' + Math.random().toString(36).substr(2, 9);
    const answers = [];
    let answeredCount = 0;
    
    for (let q = 1; q <= 15; q++) {
      const selected = document.querySelector(`input[name="q${q}"]:checked`);
      if (selected) {
        answers.push({ q, a: parseInt(selected.value) });
        answeredCount++;
      }
    }

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
        messageDiv.textContent = 'Dzięki za udział w naszej nocowankowej ankiecie! 🎉';
        messageDiv.className = 'success';
        form.style.display = 'none';
        localStorage.setItem('hasVoted', 'true');
      } else {
        throw new Error(result.error || 'Coś poszło nie tak...');
      }
    } catch (err) {
      messageDiv.textContent = err.message;
      messageDiv.className = 'error';
    }
  });

  // Blokuj jeśli już głosowano
  if (localStorage.getItem('hasVoted')) {
    form.style.display = 'none';
    messageDiv.textContent = 'Już brałeś udział w naszej ankiecie. Dzięki! ❤️';
    messageDiv.className = 'success';
  }
});