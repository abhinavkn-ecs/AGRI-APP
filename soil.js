const input = document.getElementById("soilInput");
const btn = document.getElementById("analyzeBtn");
const resEl = document.getElementById("soilResult");
const preview = document.getElementById("samplePreview");

// average RGB
function avgRGB(img, sample=6){
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const w = img.width, h = img.height;
  const scale = Math.min(1, 800/Math.max(w,h));
  canvas.width = Math.floor(w*scale);
  canvas.height = Math.floor(h*scale);
  ctx.drawImage(img,0,0,canvas.width,canvas.height);
  const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;

  let r=0,g=0,b=0,count=0;
  for(let i=0;i<data.length;i+=4*sample){ r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++; }
  return {r:Math.round(r/count), g:Math.round(g/count), b:Math.round(b/count)};
}

// map RGB -> soil label
function rgbToSoilLabel({r,g,b}){
  if(r>200 && g>180 && b>140) return "Sandy / Light Soil";
  if(r>160 && g>140 && b<120) return "Brown Soil";
  if(r>100 && g>50 && b<50) return "Red Soil";
  if((r+g+b)/3 < 80) return "Dark Soil";
  return "Mixed / Neutral Soil";
}

function showPreview(img){
  preview.innerHTML="";
  img.style.maxWidth="260px"; img.style.borderRadius="8px";
  preview.appendChild(img);
}

btn.addEventListener("click",()=>{
  const file = input.files[0];
  if(!file){ resEl.textContent="Please choose an image first."; return; }
  const img = new Image();
  img.src = URL.createObjectURL(file);
  img.onload = ()=>{
    showPreview(img);
    const avg = avgRGB(img,8);
    const label = rgbToSoilLabel(avg);
    resEl.innerHTML=`Detected color: rgb(${avg.r},${avg.g},${avg.b}) → <strong>${label}</strong>`;
  };
});
