let currentHour = 3;
let currentMinute = 15;
let validAnswers = [];

let correct = 0;
let incorrect = 0;

const nums = ["twelve", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven"];

function updateDigitalClock(hour, minute) {
  // Pad with zeros
  const h = String(hour === 0 ? 12 : hour).padStart(2, '0');
  const m = String(minute).padStart(2, '0');
  document.getElementById("digitalClock").textContent = `${h}:${m}`;
}

function generateAnswers(h, m) {
  const answers = [];

  // Main format: "it is 7 twenty" or "it's 7 twenty"
  let timeString = timeWords(h, m);
  let digital = `it is ${timeString}`;
  answers.push(digital);
  answers.push(digital.replace("it is", "it's"));
  answers.push(digital.replace("it is", "its"));
  answers.push(digital.replace("it is", "it´s")); // Acute accent

  // Special cases for quarters and half
  if (m === 15) {
    answers.push(`it is a quarter past ${nums[h % 12]}`);
    answers.push(`it's a quarter past ${nums[h % 12]}`);
    answers.push(`its a quarter past ${nums[h % 12]}`);
    answers.push(`it´s a quarter past ${nums[h % 12]}`);
  } else if (m === 30) {
    answers.push(`it is half past ${nums[h % 12]}`);
    answers.push(`it's half past ${nums[h % 12]}`);
    answers.push(`its half past ${nums[h % 12]}`);
    answers.push(`it´s half past ${nums[h % 12]}`);
  } else if (m === 45) {
    answers.push(`it is a quarter to ${nums[(h + 1) % 12]}`);
    answers.push(`it's a quarter to ${nums[(h + 1) % 12]}`);
    answers.push(`its a quarter to ${nums[(h + 1) % 12]}`);
    answers.push(`it´s a quarter to ${nums[(h + 1) % 12]}`);
    answers.push(`it is fifteen to ${nums[(h + 1) % 12]}`);
    answers.push(`it's fifteen to ${nums[(h + 1) % 12]}`);
    answers.push(`its fifteen to ${nums[(h + 1) % 12]}`);
    answers.push(`it´s fifteen to ${nums[(h + 1) % 12]}`);
  }

  // Past/To formats for other minutes (WITHOUT the word "minutes")
  if (m > 0 && m < 30 && m !== 15) {
    // "X past Y" format for 1-29 minutes
    answers.push(`it is ${minuteWord(m)} past ${nums[h % 12]}`);
    answers.push(`it's ${minuteWord(m)} past ${nums[h % 12]}`);
    answers.push(`its ${minuteWord(m)} past ${nums[h % 12]}`);
    answers.push(`it´s ${minuteWord(m)} past ${nums[h % 12]}`);
  } else if (m > 30 && m !== 45) {
    // "X to Y" format for 31-59 minutes
    let minutesTo = 60 - m;
    let nextHour = (h + 1) % 12;
    answers.push(`it is ${minuteWord(minutesTo)} to ${nums[nextHour]}`);
    answers.push(`it's ${minuteWord(minutesTo)} to ${nums[nextHour]}`);
    answers.push(`its ${minuteWord(minutesTo)} to ${nums[nextHour]}`);
    answers.push(`it´s ${minuteWord(minutesTo)} to ${nums[nextHour]}`);
  }

  return answers.map(x => normalize(x));
}

function minuteWord(m) {
  const words = {
    1: "one", 2: "two", 3: "three", 4: "four",
    5: "five", 6: "six", 7: "seven", 8: "eight",
    9: "nine", 10: "ten", 11: "eleven", 12: "twelve",
    13: "thirteen", 14: "fourteen", 15: "fifteen", 16: "sixteen",
    17: "seventeen", 18: "eighteen", 19: "nineteen", 20: "twenty",
    21: "twenty one", 22: "twenty two", 23: "twenty three", 24: "twenty four",
    25: "twenty five", 26: "twenty six", 27: "twenty seven", 28: "twenty eight",
    29: "twenty nine"
  };
  return words[m] || `${m}`;
}

function timeWords(h, m) {
  let hword = nums[h % 12];
  if (m === 0) return `${hword} o'clock`;

  const minuteWords = {
    0: "oh zero", 1: "oh one", 2: "oh two", 3: "oh three", 4: "oh four", 5: "oh five", 6: "oh six", 7: "oh seven",
    8: "oh eight", 9: "oh nine", 10: "ten", 11: "eleven", 12: "twelve", 13: "thirteen",
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
    .replace(/[´']/g, "'")  // Normalize both acute accent and apostrophe to standard apostrophe
    .replace(/[.,!?"\-]/g, "")  // Remove punctuation including hyphens
    .replace(/\s+/g, " ")
    .trim();
}

function newTime() {
  // Generate random hour (0-11, where 0 = 12 o'clock)
  currentHour = Math.floor(Math.random() * 12);
  currentMinute = Math.floor(Math.random() * 60);

  validAnswers = generateAnswers(currentHour, currentMinute);
  // Remove duplicates after normalization
  validAnswers = [...new Set(validAnswers)];

  updateDigitalClock(currentHour, currentMinute);

  document.getElementById("answer").value = "";
  document.getElementById("feedback").innerHTML = "";
  document.getElementById("answers").innerHTML = "";
  document.getElementById("answer").focus();
}

function checkAnswer() {
  let user = normalize(document.getElementById("answer").value);

  if (user === "") {
    document.getElementById("feedback").innerHTML = "⚠️ Please type an answer";
    return false;
  }

  if (validAnswers.includes(user)) {
    correct++;
    document.getElementById("feedback").innerHTML = "✅ Correct";
    document.getElementById("correct").innerText = correct;
    return true;
  } else {
    incorrect++;
    document.getElementById("feedback").innerHTML = "❌ Incorrect";
    document.getElementById("incorrect").innerText = incorrect;
    return false;
  }
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

// Allow pressing Enter to check answer only (no auto-advance)
document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("answer").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      checkAnswer();
      // Answer input stays visible - student must click "New Time" to proceed
    }
  });
});

// Initialize
newTime();
