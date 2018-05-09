let on = false;
let started = false;
let count = 1;
const squares = ['t-l', 't-r', 'b-l', 'b-r'];
const colors = ['green', 'red', 'yellow', 'blue'];
const colorsLight = ['green-light', 'red-light', 'yellow-light', 'blue-light'];
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
  // check if wrong
  for (let i = 0; i < userSequence.length; i++) {
    if (userSequence[i] !== sequence[i]) {
      document.getElementById('counter').innerHTML = ':(';
      if (strict) {
        startClick();
      }
      resetUser();
      setTimeout(() => {
        document.getElementById('counter').innerHTML = count.leadingZero();
        playSequence();
      }, 1000)
      return;
    }
  }
  // check if won game
  if (count === 20) {
    alert('You Won!');
    startClick();
  }
  // if not wrong and not won game, go on to next count
  document.getElementById('counter').innerHTML = ':)';
  resetUser();
  count++;
  setTimeout(() => {
    generateSequence();
  }, 1000)
}

function userInput() {
  playAudio(this.id);
  document.getElementById(this.id).classList.add(colorsLight[squares.indexOf(this.id)]);
  setTimeout(() => {
    document.getElementById(this.id).classList.remove(colorsLight[squares.indexOf(this.id)]);
  }, 100)
  userSequence.push(this.id);
  userCount++;
  if (userCount === count) {
    preventUser();
    checkWin();
  }
}

function allowUser() {
  Array.from(document.getElementsByClassName('btn-game')).forEach(function(element) {
    element.addEventListener('click', userInput)
    element.classList.add('clickable');
  });
}

function preventUser() {
  Array.from(document.getElementsByClassName('btn-game')).forEach(function(element) {
    element.removeEventListener('click', userInput)
    element.classList.remove('clickable');
  });
}

function getSpeed(count) {
  if (count < 5) {
    return 1000;
  } else if (count < 10) {
    return 900;
  } else if (count < 15) {
    return 800;
  } else if (count <= 20) {
    return 700;
  }
}

function playSequence() {
  preventUser();
  (function loop(i) {
    setTimeout(() => {
      document.getElementById(sequence[i]).classList.add(colorsLight[squares.indexOf(sequence[i])]);
      playAudio(sequence[i]);
    }, 300)
    setTimeout(() => {
      document.getElementById(sequence[i]).classList.remove(colorsLight[squares.indexOf(sequence[i])]);
      if (i < sequence.length - 1) {
        i++;
        loop(i);
      } else {
        allowUser();
      }
    }, getSpeed(count))
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
document.getElementById('start').addEventListener('click', startClick);
document.getElementById('strict').addEventListener('click', strictClick);


function strictClick() {
  if (strict) {
    document.getElementById('strict-light').style.backgroundColor = '';
  } else if (!strict) {
    document.getElementById('strict-light').style.backgroundColor = 'red';
  }
  strict = !strict;
}

function startClick() {
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

// on/off switch click handler
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

// on/off switch event listener
Array.from(document.getElementsByName("switch")).forEach(function(element) {
  element.addEventListener('click', switchClick);
});
