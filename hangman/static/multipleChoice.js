
const questions = [
    {
        question: "What is the capital of France?",
        choices: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        choices: ["Mars", "Venus", "Jupiter", "Saturn"],
        correctAnswer: 0
    },
    // Add more questions as needed
];

let currentQuestionIndex = 0;

function displayQuestion() {
    const questionElement = document.getElementById('question');
    const choicesElement = document.getElementById('choices');
    const currentQuestion = questions[currentQuestionIndex];

    if (questionElement && choicesElement) {
        questionElement.textContent = currentQuestion.question;
        choicesElement.innerHTML = '';

        currentQuestion.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.textContent = choice;
            button.onclick = () => checkAnswer(index);
            choicesElement.appendChild(button);
        });
    } else {
        console.error('Question or choices element not found');
    }
}

// Make sure to call this function when the page loads
window.addEventListener('load', displayQuestion);

function checkAnswer(choiceIndex) {
    const currentQuestion = questions[currentQuestionIndex];
    if (choiceIndex === currentQuestion.correctAnswer) {
        alert('Correct!');
        // You can add more logic here, like updating the race track
    } else {
        alert('Incorrect. Try again!');
    }
    currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    displayQuestion();
}

// Call this function when the page loads
displayQuestion();