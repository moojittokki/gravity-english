document.addEventListener('DOMContentLoaded', () => {
    const expressionEl = document.getElementById('expression');
    const answerInputEl = document.getElementById('answer-input');
    const checkButtonEl = document.getElementById('check-button');
    const xpEl = document.getElementById('xp-count');

    let words = [];
    let currentWord = null;
    let gravityXp = localStorage.getItem('gravity_xp') || 0;

    const updateXpDisplay = () => {
        if (xpEl) {
            xpEl.textContent = gravityXp;
        }
    };

    const getRandomWord = () => {
        if (words.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    };

    const displayNewWord = () => {
        currentWord = getRandomWord();
        if (currentWord && expressionEl) {
            expressionEl.textContent = currentWord.expression;
        }
        if (answerInputEl) {
            answerInputEl.value = '';
            answerInputEl.focus();
        }
    };

    const checkAnswer = () => {
        if (!currentWord || !answerInputEl) return;

        const userAnswer = answerInputEl.value.trim().toLowerCase();
        const correctAnswer = currentWord.meaning.toLowerCase();

        if (userAnswer === correctAnswer) {
            gravityXp = parseInt(gravityXp) + 10;
            localStorage.setItem('gravity_xp', gravityXp);
            updateXpDisplay();
            alert('Correct! +10 XP');
            displayNewWord();
        } else {
            // Do nothing on wrong answer as per instructions.
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
            displayNewWord();
        })
        .catch(error => {
            console.error('Failed to load word data:', error);
            if (expressionEl) {
                expressionEl.textContent = 'Failed to load words. Please check the data file.';
            }
        });

    if (checkButtonEl) {
        checkButtonEl.addEventListener('click', checkAnswer);
    }

    if (answerInputEl) {
        answerInputEl.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                checkAnswer();
            }
        });
    }

    // Initial display of XP
    updateXpDisplay();
});