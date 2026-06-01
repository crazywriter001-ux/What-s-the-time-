
const canvas=document.getElementById("clock");
const ctx=canvas.getContext("2d");

let currentHour=3;
let currentMinute=15;
let validAnswers=[];

let correct=0;
let incorrect=0;

const nums=["twelve","one","two","three","four","five","six","seven","eight","nine","ten","eleven"];

function drawClock(hour,minute){
ctx.clearRect(0,0,300,300);

ctx.beginPath();
ctx.arc(150,150,140,0,Math.PI*2);
ctx.stroke();

for(let n=1;n<=12;n++){
let ang=n*Math.PI/6;
ctx.fillText(n,150+110*Math.sin(ang),150-110*Math.cos(ang));
}

let minuteAngle=(minute*Math.PI/30);
let hourAngle=((hour%12)+minute/60)*Math.PI/6;

ctx.beginPath();
ctx.moveTo(150,150);
ctx.lineTo(150+60*Math.sin(hourAngle),150-60*Math.cos(hourAngle));
ctx.lineWidth=5;
ctx.stroke();

ctx.beginPath();
ctx.moveTo(150,150);
ctx.lineTo(150+90*Math.sin(minuteAngle),150-90*Math.cos(minuteAngle));
ctx.lineWidth=3;
ctx.stroke();

ctx.lineWidth=1;
}

function generateAnswers(h,m){
const answers=[];

let digital=`it is ${timeWords(h,m)}`;
answers.push(digital);
answers.push(digital.replace("it is","it's"));

if(m===15){
answers.push(`it is a quarter past ${nums[h%12]}`);
}
if(m===30){
answers.push(`it is half past ${nums[h%12]}`);
}
if(m===45){
answers.push(`it is a quarter to ${nums[(h+1)%12]}`);
}
return answers.map(x=>normalize(x));
}

function timeWords(h,m){
let hword=nums[h%12];
if(m===0) return `${hword} o'clock`;

const minuteWords={
0:"zero",1:"one",2:"two",3:"three",4:"four",5:"five",6:"six",7:"oh seven",
8:"eight",9:"oh nine",10:"ten",11:"eleven",12:"twelve",13:"thirteen",
14:"fourteen",15:"fifteen",16:"sixteen",17:"seventeen",18:"eighteen",
19:"nineteen",20:"twenty",21:"twenty one",22:"twenty two",23:"twenty three",
24:"twenty four",25:"twenty five",26:"twenty six",27:"twenty seven",
28:"twenty eight",29:"twenty nine",30:"thirty",31:"thirty one",
32:"thirty two",33:"thirty three",34:"thirty four",35:"thirty five",
36:"thirty six",37:"thirty seven",38:"thirty eight",39:"thirty nine",
40:"forty",41:"forty one",42:"forty two",43:"forty three",44:"forty four",
45:"forty five",46:"forty six",47:"forty seven",48:"forty eight",
49:"forty nine",50:"fifty",51:"fifty one",52:"fifty two",53:"fifty three",
54:"fifty four",55:"fifty five",56:"fifty six",57:"fifty seven",
58:"fifty eight",59:"fifty nine"
};
return `${hword} ${minuteWords[m]}`;
}

function normalize(text){
return text.toLowerCase()
.replace(/[.,!?']/g,"")
.replace(/\s+/g," ")
.trim();
}

function newTime(){
currentHour=Math.floor(Math.random()*12)+1;
currentMinute=Math.floor(Math.random()*60);

validAnswers=generateAnswers(currentHour,currentMinute);

drawClock(currentHour,currentMinute);

document.getElementById("answer").value="";
document.getElementById("feedback").innerHTML="";
document.getElementById("answers").innerHTML="";
}

function checkAnswer(){
let user=normalize(document.getElementById("answer").value);

if(validAnswers.includes(user)){
correct++;
document.getElementById("feedback").innerHTML="✅ Correct";
document.getElementById("correct").innerText=correct;
}else{
incorrect++;
document.getElementById("feedback").innerHTML="❌ Incorrect";
document.getElementById("incorrect").innerText=incorrect;
}
}

function showAnswer(){
document.getElementById("answers").innerHTML=validAnswers.join("<br>");
}

function speakAnswer(){
let utter=new SpeechSynthesisUtterance(validAnswers[0]);
speechSynthesis.speak(utter);
}

newTime();
