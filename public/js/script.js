document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const questionsContainer = document.getElementById('questionsContainer');
    const messageDiv = document.getElementById('message');

    // Generuj 15 pytań z 10 odpowiedziami
    for (let i = 1; i <= 15; i++) {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question';
        
        const questionText = document.createElement('div');
        questionText.className = 'question-text';
        questionText.textContent = `Pytanie ${i}: Która odpowiedź jest najlepsza?`;
        questionDiv.appendChild(questionText);
        
        for (let j = 1; j <= 10; j++) {
            const optionDiv = document.createElement('div');
            optionDiv.className = 'option';
            
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question_${i}`;
            input.value = j;
            input.id = `q${i}_a${j}`;
            input.required = true;
            
            const label = document.createElement('label');
            label.htmlFor = `q${i}_a${j}`;
            label.textContent = `Odpowiedź ${j}`;
            
            optionDiv.appendChild(input);
            optionDiv.appendChild(label);
            questionDiv.appendChild(optionDiv);
        }
        
        questionsContainer.appendChild(questionDiv);
    }

    // Generuj unikalne ID ciasteczka
    function getOrCreateCookieId() {
        let cookieId = localStorage.getItem('familiada_vote_cookie');
        if (!cookieId) {
            cookieId = 'vote-' + Math.random().toString(36).substr(2, 16) + '-' + Date.now();
            localStorage.setItem('familiada_vote_cookie', cookieId);
        }
        return cookieId;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const answers = [];
        for (let i = 1; i <= 15; i++) {
            const selectedOption = document.querySelector(`input[name="question_${i}"]:checked`);
            if (selectedOption) {
                answers.push({
                    questionId: i,
                    answerId: parseInt(selectedOption.value)
                });
            }
        }
        
        try {
            const response = await fetch('/api/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    answers,
                    cookieId: getOrCreateCookieId()
                }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                messageDiv.textContent = 'Dziękujemy za udział w ankiecie!';
                messageDiv.className = 'success';
                messageDiv.classList.remove('hidden');
                form.classList.add('hidden');
                
                localStorage.setItem('familiada_voted', 'true');
            } else {
                throw new Error(result.message || 'Wystąpił błąd');
            }
        } catch (error) {
            messageDiv.textContent = error.message || 'Wystąpił błąd połączenia z serwerem.';
            messageDiv.className = 'error';
            messageDiv.classList.remove('hidden');
        }
    });

    // Sprawdź czy już głosowano
    if (localStorage.getItem('familiada_voted')) {
        form.classList.add('hidden');
        messageDiv.textContent = 'Już głosowałeś w tej ankiecie. Dziękujemy!';
        messageDiv.className = 'success';
        messageDiv.classList.remove('hidden');
    }
});