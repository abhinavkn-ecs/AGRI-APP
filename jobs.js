const jobText=document.getElementById("jobText");
const postBtn=document.getElementById("postJob");
const jobList=document.getElementById("jobList");

function loadJobs(){
  const raw=localStorage.getItem("farmer_jobs");
  const arr=raw?JSON.parse(raw):[];
  jobList.innerHTML=arr.map(j=>`<li><strong>${j.title}</strong><br/><small>${j.time}</small></li>`).join("");
}

postBtn.onclick=()=>{
  const val=jobText.value.trim();
  if(!val) return alert("Enter job text");
  const raw=localStorage.getItem("farmer_jobs");
  const arr=raw?JSON.parse(raw):[];
  arr.unshift({title:val,time:new Date().toLocaleString()});
  localStorage.setItem("farmer_jobs",JSON.stringify(arr));
  jobText.value="";
  loadJobs();
};

loadJobs();
