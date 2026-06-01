const canvas = document.getElementById("clock");
const ctx = canvas.getContext("2d");

let currentHour = 3;
let currentMinute = 15;
let validAnswers = [];

let correct = 0;
let incorrect = 0;

const nums = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];

function drawClock(hour, minute) {
  ctx.clearRect(0, 0, 300, 300);

  // Draw clock circle
  ctx.beginPath();
  ctx.arc(150, 150, 140, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw center dot
  ctx.beginPath();
  ctx.arc(150, 150, 5, 0, Math.PI * 2);
  ctx.fill();

  // Draw numbers
  ctx.font = "bold 16px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";

  for (let n = 1; n <= 12; n++) {
    let ang = n * Math.PI / 6;
    ctx.fillText(n, 150 + 110 * Math.sin(ang), 150 - 110 * Math.cos(ang));
  }

  // Draw hour markers
  ctx.strokeStyle = "#000";
  for (let i = 0; i < 12; i++) {
    let ang = i * Math.PI / 6;
    let x1 = 150 + 130 * Math.sin(ang);
    let y1 = 150 - 130 * Math.cos(ang);
    let x2 = 150 + 120 * Math.sin(ang);
    let y2 = 150 - 120 * Math.cos(ang);
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Calculate angles
  let minuteAngle = (minute * Math.PI / 30);
  let hourAngle = ((hour % 12) + minute / 60) * Math.PI / 6;

  // Draw hour hand (shorter, thicker)
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(150, 150);
  ctx.lineTo(150 + 60 * Math.sin(hourAngle), 150 - 60 * Math.cos(hourAngle));
  ctx.stroke();

  // Draw minute hand (longer, thinner)
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(150, 150);
  ctx.lineTo(150 + 90 * Math.sin(minuteAngle), 150 - 90 * Math.cos(minuteAngle));
  ctx.stroke();

  ctx.lineWidth = 1;
}

function generateAnswers(h, m) {
  const answers = [];

  // Main format: "it is 7 twenty" or "it's 7 twenty"
  let timeString = timeWords(h, m);
  let digital = `it is ${timeString}`;
  answers.push(digital);
  answers.push(digital.replace("it is", "it's"));

  // Special cases for quarters and half
  if (m === 15) {
    answers.push(`it is a quarter past ${nums[h % 12]}`);
    answers.push(`it's a quarter past ${nums[h % 12]}`);
  } else if (m === 30) {
    answers.push(`it is half past ${nums[h % 12]}`);
    answers.push(`it's half past ${nums[h % 12]}`);
  } else if (m === 45) {
    answers.push(`it is a quarter to ${nums[(h + 1) % 12]}`);
    answers.push(`it's a quarter to ${nums[(h + 1) % 12]}`);
    answers.push(`it is fifteen to ${nums[(h + 1) % 12]}`);
    answers.push(`it's fifteen to ${nums[(h + 1) % 12]}`);
  }

  // Past/To formats for other minutes
  if (m > 0 && m < 30 && m !== 15) {
    // "X past Y" format for 1-29 minutes
    answers.push(`it is ${minuteWord(m)} past ${nums[h % 12]}`);
    answers.push(`it's ${minuteWord(m)} past ${nums[h % 12]}`);
  } else if (m > 30 && m !== 45) {
    // "X to Y" format for 31-59 minutes
    let minutesTo = 60 - m;
    let nextHour = (h + 1) % 12;
    answers.push(`it is ${minuteWord(minutesTo)} to ${nums[nextHour]}`);
    answers.push(`it's ${minuteWord(minutesTo)} to ${nums[nextHour]}`);
  }

  return answers.map(x => normalize(x));
}

function minuteWord(m) {
  const words = {
    1: "one minute", 2: "two minutes", 3: "three minutes", 4: "four minutes",
    5: "five minutes", 6: "six minutes", 7: "seven minutes", 8: "eight minutes",
    9: "nine minutes", 10: "ten minutes", 11: "eleven minutes", 12: "twelve minutes",
    13: "thirteen minutes", 14: "fourteen minutes", 15: "fifteen minutes", 16: "sixteen minutes",
    17: "seventeen minutes", 18: "eighteen minutes", 19: "nineteen minutes", 20: "twenty minutes",
    21: "twenty one minutes", 22: "twenty two minutes", 23: "twenty three minutes", 24: "twenty four minutes",
    25: "twenty five minutes", 26: "twenty six minutes", 27: "twenty seven minutes", 28: "twenty eight minutes",
    29: "twenty nine minutes"
  };
  return words[m] || `${m} minutes`;
}

function timeWords(h, m) {
  let hword = nums[h % 12];
  if (m === 0) return `${hword} o'clock`;

  const minuteWords = {
    0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "oh seven",
    8: "eight", 9: "oh nine", 10: "ten", 11: "eleven", 12: "twelve", 13: "thirteen",
    14: "fourteen", 15: "fifteen", 16: "sixteen", 17: "seventeen", 18: "eighteen",
    19: "nineteen", 20: "twenty", 21: "twenty one", 22: "twenty two", 23: "twenty three",
    24: "twenty four", 25: "twenty five", 26: "twenty six", 27: "twenty seven",
    28: "twenty eight", 29: "twenty nine", 30: "thirty", 31: "thirty one",
    32: "thirty two", 33: "thirty three", 34: "thirty four", 35: "thirty five",
    36: "thirty six", 37: "thirty seven", 38: "thirty eight", 39: "thirty nine",
    40: "forty", 41: "forty one", 42: "forty two", 43: "forty three", 44: "forty four",
    45: "forty five", 46: "forty six", 47: "forty seven", 48: "forty eight",
    49: "forty nine", 50: "fifty", 51: "fifty one", 52: "fifty two", 53: "fifty three",
    54: "fifty four", 55: "fifty five", 56: "fifty six", 57: "fifty seven",
    58: "fifty eight", 59: "fifty nine"
  };
  return `${hword} ${minuteWords[m]}`;
}

function normalize(text) {
  return text.toLowerCase()
    .replace(/[.,!?'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function newTime() {
  // Generate random hour (0-11, where 0 = 12 o'clock)
  currentHour = Math.floor(Math.random() * 12);
  currentMinute = Math.floor(Math.random() * 60);

  validAnswers = generateAnswers(currentHour, currentMinute);

  drawClock(currentHour, currentMinute);

  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("answers").innerHTML = "";
  document.getElementById("answer").focus();
}

function checkAnswer() {
  let user = normalize(document.getElementById("answer").value);

  if (user === "") {
    document.getElementById("feedback").innerHTML = "⚠️ Please type an answer";
    return;
  }

  if (validAnswers.includes(user)) {
    correct++;
    document.getElementById("feedback").innerHTML = "✅ Correct";
    document.getElementById("correct").innerText = correct;
  } else {
    incorrect++;
    document.getElementById("feedback").innerHTML = "❌ Incorrect";
    document.getElementById("incorrect").innerText = incorrect;
  }

  document.getElementById("answer").value = "";
}

function showAnswer() {
  document.getElementById("answers").innerHTML = "Acceptable answers:<br>" + validAnswers.join("<br>");
}

function speakAnswer() {
  let utter = new SpeechSynthesisUtterance(validAnswers[0]);
  utter.rate = 0.9;
  speechSynthesis.cancel(); // Stop any ongoing speech
  speechSynthesis.speak(utter);
}

function resetScore() {
  correct = 0;
  incorrect = 0;
  document.getElementById("correct").innerText = "0";
  document.getElementById("incorrect").innerText = "0";
}

// Allow pressing Enter to check answer and get next time
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("answer").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      checkAnswer();
      newTime();
    }
  });
});

// Initialize
newTime();
