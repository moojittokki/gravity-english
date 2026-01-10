document.addEventListener('DOMContentLoaded', () => {
    const questionEl = document.getElementById('question');
    const answerButtons = document.querySelectorAll('.btn');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');

    let xp = localStorage.getItem('gravity_xp') || 0;
    let words = [];
    let currentWord = null;
    let questionCount = 1;
    const totalQuestions = 10;

    // Fetch word data
    fetch('data/lv1_beginner.json')
        .then(response => response.json())
        .then(data => {
            words = data;
            displayNewQuestion();
        })
        .catch(error => {
            console.error('Failed to load words:', error);
            questionEl.textContent = 'Failed to load questions.';
        });

    function displayNewQuestion() {
        if (questionCount > totalQuestions) {
            questionCount = 1; // Reset after 10 questions
        }

        updateProgress();

        // Enable buttons and remove previous result styles
        answerButtons.forEach(button => {
            button.disabled = false;
            button.classList.remove('correct', 'wrong');
        });

        if (words.length === 0) {
            questionEl.textContent = "No words loaded.";
            return;
        }

        // 1. Select a new random word
        currentWord = words[Math.floor(Math.random() * words.length)];
        
        // 4. Use 'currentWord.word' for the question
        questionEl.textContent = currentWord.word;

        // 2. Assign Correct Meaning to one button and Random Wrong Meanings to others
        const correctMeaning = currentWord.meaning;
        
        // Get 3 random wrong meanings
        const wrongMeanings = words
            .filter(word => word.meaning !== correctMeaning) // Exclude the correct answer
            .sort(() => 0.5 - Math.random()) // Shuffle the array
            .slice(0, 3) // Get the first 3
            .map(word => word.meaning);

        const allAnswers = [correctMeaning, ...wrongMeanings];
        
        // Shuffle answers
        const shuffledAnswers = allAnswers.sort(() => 0.5 - Math.random());

        answerButtons.forEach((button, index) => {
            button.textContent = shuffledAnswers[index];
            button.onclick = () => handleAnswer(button, correctMeaning);
        });
    }

    function handleAnswer(selectedButton, correctMeaning) {
        // Disable all buttons to prevent multiple clicks
        answerButtons.forEach(button => button.disabled = true);

        if (selectedButton.textContent === correctMeaning) {
            // Correct answer
            selectedButton.classList.add('correct');
            xp = parseInt(xp) + 10;
            localStorage.setItem('gravity_xp', xp); 
        } else {
            // Wrong answer
            selectedButton.classList.add('wrong');
            // Highlight the correct answer
            answerButtons.forEach(button => {
                if (button.textContent === correctMeaning) {
                    button.classList.add('correct');
                }
            });
        }

        questionCount++;

        // Wait 1 second before showing the next question
        setTimeout(() => {
            displayNewQuestion();
        }, 1000);
    }

    function updateProgress() {
        // Update progress text
        progressText.textContent = `Question ${questionCount}/${totalQuestions}`;
        
        // Update progress bar
        const progressPercentage = ((questionCount -1) / totalQuestions) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
});