document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('passwordInput');
    const showResultsBtn = document.getElementById('showResultsBtn');
    const passwordError = document.getElementById('passwordError');
    const resultsContainer = document.getElementById('resultsContainer');

    showResultsBtn.addEventListener('click', async () => {
        const password = passwordInput.value.trim();
        
        if (!password) {
            passwordError.textContent = 'Proszę wprowadzić hasło';
            passwordError.classList.remove('hidden');
            return;
        }
        
        try {
            const response = await fetch('/api/results', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
            
            const result = await response.json();
            
            if (result.success) {
                passwordError.classList.add('hidden');
                displayResults(result.results);
                resultsContainer.classList.remove('hidden');
            } else {
                passwordError.textContent = result.message || 'Nieprawidłowe hasło';
                passwordError.classList.remove('hidden');
            }
        } catch (error) {
            passwordError.textContent = 'Wystąpił błąd połączenia z serwerem';
            passwordError.classList.remove('hidden');
            console.error('Error:', error);
        }
    });
    
    function displayResults(results) {
        resultsContainer.innerHTML = '';
        
        results.forEach(question => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'result-item';
            
            const questionTitle = document.createElement('div');
            questionTitle.className = 'result-question';
            questionTitle.textContent = question.questionText;
            questionDiv.appendChild(questionTitle);
            
            question.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = `result-option ${index === 0 ? 'top-answer' : ''}`;
                
                const optionText = document.createElement('span');
                optionText.textContent = option.text;
                
                const votesSpan = document.createElement('span');
                votesSpan.className = 'votes';
                votesSpan.textContent = `${option.votes} głosów`;
                
                optionDiv.appendChild(optionText);
                optionDiv.appendChild(votesSpan);
                questionDiv.appendChild(optionDiv);
            });
            
            resultsContainer.appendChild(questionDiv);
        });
    }
});