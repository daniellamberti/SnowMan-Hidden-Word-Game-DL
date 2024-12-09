// DOM Elements:

const keyboardContainer = document.getElementById('keyboard-container');
const guessContainer = document.getElementById('guess-container');
const snowmanParts = document.getElementsByClassName('snowman-part');
const startBtn = document.getElementById("start-btn");
const message = document.getElementById("message");

/* ------------------------------------------------------------------------------------------------------------ */

// Variables:

let randomChristmasWord = {};
let currentGuess = "";
let clickedLetter = null;
let guessCount = 6;
let guessedLetters = []; // Track guessed letters

// Letters for keyboard
const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 
    't', 'u', 'v', 'w', 'x', 'y', 'z'];

// Christmas words and tips array:

const christmasWords = [
    { word: "gift", tip: "Something that everybody likes to receive" },
    { word: "tree", tip: "A festive decoration that often has lights and ornaments" },
    { word: "snow", tip: "White and fluffy, it covers the ground during winter in colder regions" },
    { word: "santa", tip: "The jolly man who delivers presents on Christmas Eve" },
    { word: "stocking", tip: "Hung by the fireplace, it's filled with small surprises" },
    { word: "reindeer", tip: "Santa's sleigh is pulled by these magical creatures" },
    { word: "elf", tip: "Santa's little helpers who make toys" },
    { word: "chimney", tip: "Santa's way of entering houses to deliver gifts" },
    { word: "bell", tip: "It rings to spread the sound of Christmas cheer" },
    { word: "wreath", tip: "A circular decoration made of greenery, often hung on doors" }
];

/* ------------------------------------------------------------------------------------------------------------ */

// Functions:

// Generate a random word from the array:

const getRandomWord = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Update the message:

const updateMessage = (text) => {
    message.textContent = text;
};

// Render the keyboard:

const renderKeyboard = () => {
    const keyBoardHtml = letters.map((letter) => {
        // Disable the button if the letter has already been guessed
        const isDisabled = guessedLetters.includes(letter) ? 'disabled' : '';
        return `<button class="letter" aria-label="Guess letter ${letter}" id=${letter} ${isDisabled}>${letter}</button>`;
    }).join('');
    keyboardContainer.innerHTML = keyBoardHtml;

    currentGuess = "-".repeat(randomChristmasWord.word.length);
    guessContainer.innerHTML = `<p class="word-display">${currentGuess}</p>`;
};

// Check game status:

const checkGameStatus = () => {
    if (currentGuess === randomChristmasWord.word) {
        startBtn.disabled = false;
        updateMessage("You guessed the word! Congratulations!");
    } else if (guessCount <= 0) {
        startBtn.disabled = false;
        updateMessage(`You lost! The word was: ${randomChristmasWord.word}`);
    }
};

// Check if clicked letter is correct:

const checkLetter = (letter) => {
    if (randomChristmasWord.word.includes(letter)) {
        let updatedGuess = "";
        for (let i = 0; i < randomChristmasWord.word.length; i++) {
            updatedGuess += randomChristmasWord.word[i] === letter ? letter : currentGuess[i];
        }

        currentGuess = updatedGuess;
        guessContainer.innerHTML = `<p class="word-display">${currentGuess}</p>`;

        if (!currentGuess.includes("-")) {
            updateMessage("Congratulations! You guessed the word!");
            checkGameStatus();
        } else {
            updateMessage("Correct letter!");
        }

        // Mark the letter as guessed and disable the button:

        guessedLetters.push(letter);
        document.getElementById(letter).disabled = true;
    } else {
        updateMessage(`Wrong letter! You have ${guessCount - 1} wrong guesses left.`);

        if (guessCount > 0) {
            guessCount--;
            if (snowmanParts[6 - guessCount - 1]) {
                snowmanParts[6 - guessCount - 1].style.display = "none";
            }
        }

        if (guessCount === 3) {
            updateMessage(`Hint: ${randomChristmasWord.tip}`);
        }

        if (guessCount === 0) {
            updateMessage("Game Over! You lost!");
            checkGameStatus();
        }

        // Disable the button on incorrect guess:

        guessedLetters.push(letter);
        document.getElementById(letter).disabled = true;
    }
};

/* ------------------------------------------------------------------------------------------------------------ */

// Event Listeners

// Start Button click event:

startBtn.addEventListener("click", () => {
    startBtn.disabled = true;

    // Reset snowman parts
    for (let part of snowmanParts) {
        part.style.display = "block";
    }

    // Reset game state
    randomChristmasWord = getRandomWord(christmasWords);
    guessCount = 6; // Reset the guess count
    renderKeyboard();
    updateMessage("Start guessing the hidden word!");
});


// Keyboard letter click event:

keyboardContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('letter') && !event.target.disabled) {
        clickedLetter = event.target.id;
        checkLetter(clickedLetter);
    }
});
