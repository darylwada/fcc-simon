let on = false;
let started = false;
let count = 1;
let squares = ['t-l', 't-r', 'b-l', 'b-r'];
let colors = ['green', 'red', 'yellow', 'blue'];
let colorsLight = ['green-light', 'red-light', 'yellow-light', 'blue-light'];
let sequence = [];
let userSequence = [];
let userCount = 0;
let strict = false;

Number.prototype.leadingZero = function() {
  if (this < 10) {
    return '0' + this;
  } else {
    return this;
  }
}

function playAudio(id) {
  let audioId = id + '-audio';
  document.getElementById(audioId).play();
}

function resetUser() {
  userCount = 0;
  userSequence = [];
}

function resetSequence() {
  sequence = [];
  count = 1;
}

function checkWin() {
  if (userCount === count) {
    preventUser();
    for (let i = 0; i < userSequence.length; i++) {
      // wrong
      if (userSequence[i] !== sequence[i]) {
        // alert('wrong');
        document.getElementById('counter').innerHTML = '!!';
        if (strict) {
          startGame();
        }
        resetUser();
        setTimeout(() => {
          playSequence();
        }, 1000)
        return;
      }
    }
    // alert('correct');
    if (count === 20) {
      alert('You Won!');
      startGame();
    }
    document.getElementById('counter').innerHTML = ':)';
    // correct
    resetUser();
    count++;
    setTimeout(() => {
      generateSequence();
    }, 1000)
  }
}

function userInput() {
  playAudio(this.id);
  document.getElementById(this.id).classList.add(colorsLight[squares.indexOf(this.id)]);
  setTimeout(() => {
    document.getElementById(this.id).classList.remove(colorsLight[squares.indexOf(this.id)]);
  }, 100)
  userSequence.push(this.id);
  userCount++;
  checkWin();
}

function allowUser() {
  Array.from(document.getElementsByClassName('btn-game')).forEach(function(element) {
    element.addEventListener('click', userInput)
  });
  Array.from(document.getElementsByClassName('btn-game')).forEach(function(element) {
    element.classList.add('clickable');
  });
}

function preventUser() {
  Array.from(document.getElementsByClassName('btn-game')).forEach(function(element) {
    element.removeEventListener('click', userInput)
  });
  Array.from(document.getElementsByClassName('btn-game')).forEach(function(element) {
    element.classList.remove('clickable');
  });
}

function playSequence() {
  preventUser();
  (function loop(i) {
    let sequenceId = sequence[i];
    setTimeout(() => {
      document.getElementById(sequenceId).classList.add(colorsLight[squares.indexOf(sequenceId)]);
      playAudio(sequenceId);
    }, 300)
    setTimeout(() => {
      document.getElementById(sequenceId).classList.remove(colorsLight[squares.indexOf(sequenceId)]);
      if (i < sequence.length - 1) {
        i++;
        loop(i);
      } else {
        allowUser();
      }
    }, 1000)
  })(0);
}

function generateSequence() {
  document.getElementById('counter').innerHTML = count.leadingZero();
  let randomSquare = squares[Math.floor(Math.random() * squares.length)];
  sequence.push(randomSquare);
  console.log(sequence);
  playSequence();
}

// game switches
document.getElementById('start').addEventListener('click', startGame);
document.getElementById('strict').addEventListener('click', strictPress);


function strictPress() {
  if (strict) {
    document.getElementById('strict-light').style.backgroundColor = '';
  } else if (!strict) {
    document.getElementById('strict-light').style.backgroundColor = 'red';
  }
  strict = !strict;
}

function startGame() {
  if (!on) {
    return;
  }
  if (started) {
    resetSequence();
    resetUser();
  }
  started = true;
  setTimeout(() => {
    generateSequence();
  }, 1000)
}

function switchClick() {
  if (on) {
    on = false;
    resetSequence();
    resetUser();
    document.getElementById('counter').innerHTML = '--';
    Array.from(document.getElementsByClassName('btn-game')).forEach(function(element) {
      element.classList.remove('clickable');
    });
    document.getElementById('counter').classList.remove('red-light-text');
  } else if (!on) {
    on = true;
    document.getElementById('counter').classList.add('red-light-text');
  }
}

// on/off switch
Array.from(document.getElementsByName("switch")).forEach(function(element) {
  element.addEventListener('click', switchClick);
});
