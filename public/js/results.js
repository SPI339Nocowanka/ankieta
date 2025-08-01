document.addEventListener('DOMContentLoaded', async () => {
  const passwordInput = document.getElementById('passwordInput');
  const showResultsBtn = document.getElementById('showResultsBtn');
  const resultsContainer = document.getElementById('resultsContainer');

  const questions = [
    {
      question: "Co można znaleźć w łazience?",
      options: ["Wanna", "Toaleta", "Umywalka", "Przysznic", "Papier Toaletowy", 
               "Szczoteczka do zębów", "Chemikalia", "Ręcznik", "Suszarka", "Lustro"]
    },
    {
      question: "Czego boją się ludzie?",
      options: ["Pająków", "Wyskości", "Ciemności", "Śmierci", "Węż", 
               "Kartkówka", "Porwania", "Małych przestrzeni", "Duchów / Potworów", "Horrorów"]
    },
    {
      question: "Ulubionny przedmiot w szkole?",
      options: ["J. Polski", "Matematyka", "J. Angielski", "Historia", "Geografia", 
               "Biologia", "Chemia", "Fizyka", "WF", "Informatyka"]
    },
    {
      question: "Najbardziej nie lubiany przedmiot w szkole?",
      options: ["J. Polski", "Matematyka", "J. Angielski", "Historia", "Geografia", 
               "Biologia", "Chemia", "Fizyka", "WF", "Informatyka"]
    },
    {
      question: "Ulubiona gra komputerowa?",
      options: ["Minecraft", "CS2", "Roblox", "Valorant💀", "Fortnie", "League of Legends💀", 
               "Simsy", "Call of Duty", "GTA", "War Thunder", "Wiedzimin", "Among us", "BattleField", "Fallout", "Team Fortress"]
    },
    {
      question: "Podaj przykład czegoś co lata?",
      options: ["Samolot", "Ptak", "Latawiec", "Motyl", "Mucha", 
               "Balon", "Dron", "Helikopter", "Szybowiec", "Komar"]
    },
    {
      question: "Co robimy na urodzinach?",
      options: ["Jemy tort", "Śpiewamy 'Sto lat'", "Dajemy prezenty", "Robimy zdjęcia", "Tańczymy", 
               "Gramy w gry", "Składamy życzenia", "Dekorujemy", "Otwieramy prezenty", "Rozmawiamy"]
    },
    {
      question: "Co zabieramy na plażę?",
      options: ["Ręcznik", "Krem z filtrem", "Parasol", "Klapki", "Strój kąpielowy", 
               "Wodę", "Okulary przeciwsłoneczne", "Książkę", "Piłkę", "Koc"]
    },
    {
      question: "Co znajduje się w plecaku ucznia?",
      options: ["Zeszyty", "Podręczniki", "Piórnik", "Drugie śniadanie", "Telefon", 
               "Bidon", "Strój na WF", "Plastelina", "Linijka", "Kalendarz szkolny"]
    },
    {
      question: "Co robimy rano?",
      options: ["Myjemy zęby", "Ubieramy się", "Jemy śniadanie", "Wstajemy", "Robimy kawę", 
               "Szykujemy się do pracy/szkoły", "Sprawdzamy telefon", "Budzik dzwoni", "Myjemy się", "Pakujemy plecak"]
    },
    {
      question: "Co można znaleźć w kuchni?",
      options: ["Lodówka", "Kuchenka", "Zlew", "Naczynia", "Garnek", 
               "Sztućce", "Kawa", "Czajnik", "Mikrofalówka", "Stół"]
    },
    {
      question: "Co może być gorące?",
      options: ["Kawa", "Zupa", "Słońce", "Piekarnik", "Herbata", 
               "Żelazko", "Patelnia", "Grzejnik", "Woda", "Pizza", "Kolega z ławki"]
    },
    {
      question: "Co robimy na wakacjach?",
      options: ["Odpoczywamy", "Pływamy", "Zwiedzamy", "Opalamy się", "Gramy w gry", 
               "Czytamy książki", "Robimy zdjęcia", "Jemy lody", "Chodzimy po górach", "Śpimy"]
    },
    {
      question: "Co może być zielone?",
      options: ["Trawa", "Liść", "Ogórek", "Zielony groszek", "Jabłko", 
               "Zielone światło", "Papryka", "Szpinak", "Dinozaur (w kreskówkach)", "Kapusta"]
    },
    {
      question: "Co robimy w zimie?",
      options: ["Lepimy bałwana", "Jeździmy na sankach", "Ubieramy się ciepło", "Grzejemy się", "Jemy pierniki", 
               "Pijemy herbatę", "Jeździmy na nartach", "Słuchamy kolęd", "Rzucamy śnieżkami", "Czekamy na święta"]
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
