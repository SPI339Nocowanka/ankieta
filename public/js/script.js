document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('surveyForm');
  const questionsDiv = document.getElementById('questions');
  const messageDiv = document.getElementById('message');

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
      options: ["Minecraft", "CS2", "Roblox", "Fortnie", "League of Legends", 
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
               "Żelazko", "Patelnia", "Grzejnik", "Woda", "Pizza"]
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

  // Generuj pytania na stronie
  questions.forEach((qData, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question';
    questionDiv.innerHTML = `<h3>${index + 1}. ${qData.question}</h3>`;
    
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
          a: parseInt(selected.value)
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
        messageDiv.textContent = 'Dzięki za udział w ankiecie! 🎉';
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

  if (localStorage.getItem('hasVoted')) {
    form.style.display = 'none';
    messageDiv.textContent = 'Już brałeś udział w naszej ankiecie. Dzięki! ❤️';
    messageDiv.className = 'success';
  }
});
