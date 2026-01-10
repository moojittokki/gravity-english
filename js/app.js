document.addEventListener('DOMContentLoaded', () => {
  const wordDisplay = document.getElementById('word-display');
  const answerInput = document.getElementById('answer-input');
  const submitButton = document.getElementById('submit-button');
  const xpDisplay = document.getElementById('xp-display');

  let words = [];
  let currentWord = null;
  let xp = localStorage.getItem('gravity_xp') ? parseInt(localStorage.getItem('gravity_xp'), 10) : 0;

  const updateXpDisplay = () => {
    if (xpDisplay) {
      xpDisplay.textContent = `XP: ${xp}`;
    }
  };

  const showRandomWord = () => {
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      currentWord = words[randomIndex];
      wordDisplay.textContent = currentWord.meaning;
      answerInput.value = '';
      answerInput.focus();
    }
  };

  const checkAnswer = () => {
    if (!currentWord) return;

    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = currentWord.word.toLowerCase();

    if (userAnswer === correctAnswer) {
      xp += 10;
      localStorage.setItem('gravity_xp', xp);
      alert('Correct!');
      updateXpDisplay();
      showRandomWord();
    } else {
      alert(`Wrong! The correct answer was "${currentWord.word}".`);
    }
  };

  fetch('data/lv1_beginner.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      words = data;
      updateXpDisplay();
      showRandomWord();
    })
    .catch(error => {
      console.error('Error loading word data:', error);
      wordDisplay.textContent = 'Failed to load words. Please check the console.';
    });

  if (submitButton) {
    submitButton.addEventListener('click', checkAnswer);
  }

  if (answerInput) {
    answerInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        checkAnswer();
      }
    });
  }
});