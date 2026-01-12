
const statusText=document.getElementById("statusText");
const progress=document.getElementById("progress");
const preview=document.getElementById("preview");

function setStatus(t,p){
 statusText.innerText=t;
 progress.style.width=p+"%";
}

async function cmd(action){
 switch(action){
  case "init":
    setStatus("🟡 เริ่มต้นระบบ...",10);
    break;

  case "fetch":
    setStatus("🟡 ดึงข้อมูลสินค้า (จำลอง)...",20);
    break;

  case "image":
    setStatus("🟡 สร้างภาพ AI...",40);
    const r=await fetch('/api/image',{method:'POST'});
    const d=await r.json();
    preview.innerHTML='<img src="'+d.url+'">';
    setStatus("🟢 สร้างภาพเสร็จ",60);
    break;

  case "prompt":
    setStatus("🟡 สร้าง Prompt วิดีโอ...",75);
    break;

  case "export":
    setStatus("🟡 Export สำหรับ Veo...",90);
    const ex=await fetch('/api/export',{method:'POST'});
    const ez=await ex.json();
    window.location=ez.zip;
    setStatus("🟢 Export เสร็จ",100);
    break;

  case "stop":
    setStatus("⛔ ระบบหยุดการทำงาน",0);
    break;
 }
}
