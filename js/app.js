document.addEventListener('DOMContentLoaded', () => {
    const questionEl = document.getElementById('question');
    const answerButtons = document.querySelectorAll('.btn');
    let xp = localStorage.getItem('gravity_xp') || 0;

    let words = [];
    let currentWord = null;

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
            button.onclick = () => {
                // 3. On button click, check if the text matches the correct meaning
                if (button.textContent === correctMeaning) {
                    // Correct answer
                    xp = parseInt(xp) + 10;
                    // 5. Keep XP saving logic
                    localStorage.setItem('gravity_xp', xp); 
                    alert('Correct! +10 XP');
                } else {
                    // Wrong answer
                    alert(`Wrong! The correct answer for "${currentWord.word}" is "${correctMeaning}".`);
                }
                // Load the next question
                displayNewQuestion();
            };
        });
    }
});