const letters = document.querySelectorAll(".letter");
const comment = document.getElementById("comment");
let currentGuess = "";
let currentRow = 0;
let wordGuessed = [];
const WORD_LENGTH = 5;
let state = false;
let dailyWord;

async function initialize() {
  // console.log(await validateWord('aodne'));
  dailyWord = await getWord();
  handleKeyboardInput();
}
//retrieve daily word
async function getWord() {
  const dailyWordAPI = await fetch(
    "https://words.dev-apis.com/word-of-the-day"
  );
  const wordFetched = await dailyWordAPI.json();
  let dailyWord = wordFetched.word;
  dailyWord = dailyWord.toUpperCase();
  return dailyWord;
}
//keyboard event
function handleKeyboardInput() {
  document.addEventListener("keydown", function (e) {
    let key = e.key;
    if (key === "Enter") {
      if (wordGuessed.length == WORD_LENGTH) {
        commit();
      }
    } else if (key === "Backspace") {
      backspace();
    } else if (isLetter(key)) {
      addLetter(key.toUpperCase());
    }
  });
}
//create word
async function commit() {
  if (currentGuess.length !== WORD_LENGTH) {
    return;
  }
  if (await validateWord(currentGuess)) {
    await checkWord();
    currentRow++;
    currentGuess = "";
    if (!state) {
      wordGuessed = [];
    }
  } else {
    comment.textContent = "Invalid word! Try Again!";
  }
}
//add letter
function addLetter(letter) {
  if (currentGuess.length < WORD_LENGTH) {
    currentGuess += letter;
    wordGuessed.push(letter.toUpperCase());
  } else {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
  }
  letters[WORD_LENGTH * currentRow + currentGuess.length - 1].innerText =
    letter;
}

//check correct word
async function checkWord() {
  console.log(dailyWord);
  console.log(wordGuessed);
  let joinedWord = wordGuessed.join("");
  //map the guessed word to the daily word
  //validate each character with loop
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (dailyWord[i] === wordGuessed[i]) {
      letters[WORD_LENGTH * currentRow + i].style.backgroundColor = "green";
      letters[WORD_LENGTH * currentRow + i].style.color = "white";
      comment.textContent = "Getting Closer!";
    } else if (dailyWord.includes(wordGuessed[i])) {
      letters[WORD_LENGTH * currentRow + i].style.backgroundColor = "rgb(231, 96, 33)";
      letters[WORD_LENGTH * currentRow + i].style.color = "white";
      comment.textContent = "You might be onto something!";
    } else {
      letters[WORD_LENGTH * currentRow + i].style.backgroundColor = "rgb(175, 28, 28)";
      letters[WORD_LENGTH * currentRow + i].style.color = "white";
    }
  }
  if (joinedWord === dailyWord) {
    state = true;
    comment.textContent = "Correct!";
  } else {
    state = false;
    console.log("Incorrect!");
    if (currentRow == 5) {
      comment.textContent = `Game Over! The word was ${dailyWord}`;
    }
  }
}
//backspace
function backspace() {
  if (currentGuess.length > 0) {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    wordGuessed.pop();
  }
  letters[WORD_LENGTH * currentRow + currentGuess.length].innerText = "";
}

//only accept letters
function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}
// validate word with API
async function validateWord(inputWord) {
  const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({ word: inputWord }),
  });
  const respObj = await res.json();
  const isValid = respObj.validWord;
  return isValid;
}
initialize();
