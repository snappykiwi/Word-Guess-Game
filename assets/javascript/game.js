// sets array of possible words for the game
let marvelWords = ["Iron Man", "Stan Lee", "Thor", "Drax", "Peter Parker", "Tony Stark", "comics", "Thanos", "Avengers", "Green Goblin", "Loki", "Spiderman", "Hulk", "Captain America", "Black Widow", "Fantastic Four", "X Men", "Ant Man",
  "Deadpool", "Black Panther", "Wakanda", "Daredevil", "The Punisher", "Elektra", "Asgard", "Odin", "Wolverine", "Doctor Strange", "Infinity Stones", "Tesseract", "Steve Rogers", "SHIELD", "Nick Fury", "Hydra", "Ultron",
  "Nebula", "Rocket Raccoon", "Captain Marvel", "Kree", "Mystique", "Hawkeye", "Hank Pym", "Bucky Barnes", "mjolnir", "War Machine", "Xandar", "Peter Quill", "Gamora", "Groot", "Endgame", "Scarlet Witch", "Vision",
  "Stark Industries", "Magneto", "Venom", "Kingpin", "Mysterio", "Doc Oc", "Hela", "Taskmaster", "Juggernaut", "vibranium", "infinity gauntlet", "arc reactor", "web shooters", "Bruce Banner"];

let guessText = $("p#guess");
let guessesLeftText = $("p#guesses-left");
let lettersGuessedText = $("p#guessed-letters");
let winsText = $("span#wins");
let lossesText = $("span#losses");
let youWinText = $("h2.you-win");
let youLoseText = $("h2.you-lose");

function animateCSS(element, animationName, callback) {
  const node = document.querySelector(element)
  node.classList.add('animated', animationName)

  function handleAnimationEnd() {
    node.classList.remove('animated', animationName)
    node.removeEventListener('animationend', handleAnimationEnd)

    if (typeof callback === 'function') callback()
  }
  node.addEventListener('animationend', handleAnimationEnd)
}



// game object
let game = {

  scorecard: {
    wins: 0,
    losses: 0
  },

  user: {
    guessesLeft: 12,
    lettersGuessed: [],
    userGuess: [],
    letterIndex: -1
  },

  computer: {
    word: "",
    wordsUsed: []
  },

  // resets values to begin new game
  resetValues: function () {
    this.user.guessesLeft = 12;
    guessesLeftText.text(this.user.guessesLeft);
    this.user.lettersGuessed = [];
    lettersGuessedText.text(this.user.lettersGuessed);
    this.computer.word = "";
    this.user.userGuess = [];
  },

  // picks new random word for user to guess
  newWord: function () {
    let wordChoice = marvelWords[Math.floor(Math.random() * marvelWords.length)];
    this.computer.word = wordChoice.toUpperCase();
    // checks if word has been used yet
    if (game.computer.wordsUsed.length < marvelWords.length) {
      if (game.computer.wordsUsed.includes(this.computer.word)) {
        this.newWord();
      }
      else {
        this.computer.wordsUsed.push(this.computer.word);
      }
    } else {
      game.computer.wordsUsed = [];
      this.newWord();
    }
  },

  // sets word to be guessed to underscores 
  setBlanks: function () {
    for (i = 0; i < this.computer.word.length; i++) {
      if (this.computer.word[i] == " ") {
        game.user.userGuess.push("  ");
      }
      else {
        game.user.userGuess.push("_");
      }
    }
    guessText.text(game.user.userGuess.join(""));
  },

  newGame: function () {
    this.resetValues();
    this.newWord();
    this.setBlanks();
  },

  revealWord: function() {
    guessText.text(this.computer.word);
    animateCSS('p#guess', 'pulse', function() {
      console.log(guessText.text);
    });
  },

  checkWin: function () {
    if (this.user.userGuess.indexOf("_") == -1) {
      this.scorecard.wins++;
      winsText.text(this.scorecard.wins);
      youWinText.show("slow");
      animateCSS('h2.you-win', 'fadeInUp', function () {
        animateCSS('h2.you-win', 'fadeOut', function () {
          youWinText.hide("fast");
          animateCSS('p#guess', 'pulse', function () {
            game.newGame();
          });
        });
      });
    }
  },

  checkLoss: function () {
    if (this.user.guessesLeft == 0) {
      game.scorecard.losses++;
      lossesText.text(game.scorecard.losses);
      youLoseText.show("slow");
      animateCSS('h2.you-lose', 'rubberBand', function () {
        animateCSS('h2.you-lose', 'fadeOut', function () {
          youLoseText.hide("fast");
          game.revealWord();
          animateCSS('p#guess', 'tada', function () {
            game.newGame()
          });
        });
      });
    };
  },

    isLetter: function (event) {
      let key = event.keyCode;
      if ((key > 64 && key < 91) || (key > 96 && key < 123)) {
        return true;
      }
    }
  }

  // jquery
  $(document).ready(function () {
    
    guessesLeftText.text(game.user.guessesLeft);
    winsText.text(game.scorecard.wins);
    lossesText.text(game.scorecard.losses);
    
    //pressing the play button - hide instructions and play button
    $("button.playButton").on("click", function () {
      game.newGame();
      $("h2").addClass("inline")
      $(".logo").animate({ width: "80px" }, "slow");
      $(".show-init").hide("fast");
      $(".hide-init").show("slow");
    });

    // // when user presses a key...
    $(document).keyup(function (event) {
      // if key is a letter...
      if (game.isLetter(event)) {
        // set user's guess to uppercase letter
        let letterGuess = event.key.toUpperCase();

        // set variable for the letter guessed's position in the word
        let letterIndex = game.computer.word.indexOf(letterGuess);

        // checks if user's guess is in the word or not
        if (letterIndex != -1) {
          game.user.userGuess[letterIndex] = letterGuess;
          guessText.text(game.user.userGuess.join(""));

          // checks for another instance of that letter in the word
          for (i = letterIndex; i < game.computer.word.length; i++) {
            let letterFind = game.computer.word.indexOf(letterGuess, (i + 1));

            // if there is another instance...
            if (letterFind != -1) {
              // replace _ with letter user guessed and set it on the page
              game.user.userGuess[letterFind] = letterGuess;
              guessText.text(game.user.userGuess.join(""));
              i = letterFind;
            }

            // otherwise end the for loop
            else {
              i = game.computer.word.length;
            }
          }
          game.checkWin();
        }

        // if user's guess is not in the word, check for game loss 
        // otherwise add it to the array of letters guessed wrong
        else {
          if (game.user.lettersGuessed.indexOf(letterGuess) == -1) {
            game.user.lettersGuessed.push(letterGuess);
            game.user.guessesLeft--;
            guessesLeftText.text(game.user.guessesLeft);
            lettersGuessedText.text(game.user.lettersGuessed.join(", "));
            game.checkLoss();
          }
        }
      }
    });
  });
