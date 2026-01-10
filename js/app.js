document.addEventListener('DOMContentLoaded', () => {
    const quizCard = document.querySelector('.quiz-card');
    let words = [];
    let shuffledWords = [];
    let questionCount = 0;
    const totalQuestions = 10;
    let xp = localStorage.getItem('gravity_xp') || 0;

    // --- DOM Elements (will be re-queried after UI rebuilds) ---
    let questionEl, answerButtons, progressBar, progressText;

    // --- Data Fetching ---
    fetch('data/lv1_beginner.json')
        .then(response => response.json())
        .then(data => {
            words = data;
            if (words && words.length > 0) {
                startQuiz();
            } else {
                showError("No questions found in data file.");
            }
        })
        .catch(error => {
            console.error('Failed to load words:', error);
            showError('Failed to load the quiz questions.');
        });

    // --- Core Quiz Logic ---

    function startQuiz() {
        questionCount = 0;
        shuffledWords = shuffleArray([...words]).slice(0, totalQuestions);
        
        if (shuffledWords.length === 0) {
            showError("Not enough words to start the quiz.");
            return;
        }
        
        rebuildQuizUI();
        displayNewQuestion();
    }

    function displayNewQuestion() {
        questionCount++;

        if (questionCount > shuffledWords.length) {
            endQuiz();
            return;
        }

        updateProgress();

        const currentWord = shuffledWords[questionCount - 1];
        questionEl.textContent = currentWord.word;

        const correctMeaning = currentWord.meaning;
        
        // Get 3 unique wrong meanings
        const wrongMeanings = words
            .filter(word => word.meaning !== correctMeaning)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(word => word.meaning);

        const allAnswers = shuffleArray([correctMeaning, ...wrongMeanings]);

        answerButtons.forEach((button, index) => {
            if (allAnswers[index]) {
                button.textContent = allAnswers[index];
                button.style.display = 'block';
                button.className = 'btn'; // Reset classes
                button.disabled = false;
                button.onclick = (event) => checkAnswer(event, correctMeaning);
            } else {
                button.style.display = 'none'; // Hide button if not enough answers
            }
        });
    }

    function checkAnswer(event, correctMeaning) {
        const selectedButton = event.target;
        const isCorrect = selectedButton.textContent === correctMeaning;

        answerButtons.forEach(button => {
            button.disabled = true; // Disable all buttons
            if (button.textContent === correctMeaning) {
                button.classList.add('correct'); // Always show the correct one
            }
        });
        
        document.body.style.transition = 'background-color 0.3s';

        if (isCorrect) {
            xp = parseInt(xp) + 10;
            localStorage.setItem('gravity_xp', xp);
            selectedButton.classList.add('correct');
            document.body.style.backgroundColor = '#d4edda'; // Light green
        } else {
            selectedButton.classList.add('incorrect');
            document.body.style.backgroundColor = '#f8d7da'; // Light red
        }

        setTimeout(() => {
            document.body.style.backgroundColor = ''; // Revert to original
            displayNewQuestion();
        }, 1500);
    }

    function endQuiz() {
        quizCard.innerHTML = `
            <div class="quiz-complete-container">
                <h1>Quiz Complete!</h1>
                <p>You have finished this round.</p>
                <button id="restart-btn" class="btn">Restart Quiz</button>
            </div>
        `;
        document.getElementById('restart-btn').addEventListener('click', startQuiz);
    }

    // --- UI & Utility Functions ---

    function rebuildQuizUI() {
        quizCard.innerHTML = `
            <h2 id="question">Loading...</h2>
            <div class="answer-buttons">
                <button class="btn"></button>
                <button class="btn"></button>
                <button class="btn"></button>
                <button class="btn"></button>
            </div>
            <div class="progress-container">
                <div class="progress-bar" id="progress-bar"></div>
            </div>
            <p id="progress-text">Question 1 of ${shuffledWords.length}</p>
        `;
        
        // Re-assign DOM element variables
        questionEl = document.getElementById('question');
        answerButtons = quizCard.querySelectorAll('.btn');
        progressBar = document.getElementById('progress-bar');
        progressText = document.getElementById('progress-text');
    }
    
    function updateProgress() {
        const progressPercentage = ((questionCount -1) / shuffledWords.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressText.textContent = `Question ${questionCount} of ${shuffledWords.length}`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function showError(message) {
        quizCard.innerHTML = `<div class="error-message"><h1>Error</h1><p>${message}</p></div>`;
    }
});