const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const recognized = document.getElementById("recognized");
const actionLog = document.getElementById("actionLog");

let recognition=null;
if(window.SpeechRecognition || window.webkitSpeechRecognition){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = "ml-IN";
  recognition.interimResults=false;
  recognition.continuous=false;
} else recognized.textContent="Browser does not support Web Speech API.";

function logAction(txt){ actionLog.textContent=`${new Date().toLocaleTimeString()}: ${txt}\n` + actionLog.textContent; }

if(recognition){
  recognition.onresult = (evt)=>{
    let txt="";
    for(let i=evt.resultIndex;i<evt.results.length;i++) txt+=evt.results[i][0].transcript;
    recognized.textContent=txt;
    const low=txt.toLowerCase();
    if(low.includes("മഴ") || low.includes("കാലാവസ്ഥ") || low.includes("weather")){
      logAction("Detected WEATHER → opening weather page");
      window.location.href="weather.html";
    } else if(low.includes("മണ്ണ്") || low.includes("soil") || low.includes("വളം")){
      logAction("Detected SOIL → opening soil page");
      window.location.href="soil.html";
    } else logAction("Could not infer intent. Recognized: " + txt);
  };
  recognition.onerror=(err)=>{ logAction("STT error: "+(err.error||"unknown")); }
  recognition.onend=()=>{ startBtn.disabled=false; stopBtn.disabled=true; logAction("Listening stopped"); }
}

startBtn.onclick=()=>{ if(!recognition) return; recognized.textContent="Listening…"; recognition.start(); startBtn.disabled=true; stopBtn.disabled=false; logAction("Listening started"); }
stopBtn.onclick=()=>{ if(!recognition) return; recognition.stop(); }
