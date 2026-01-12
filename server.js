
import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import archiver from "archiver";
import dotenv from "dotenv";

dotenv.config();
const app=express();
app.use(express.json());
app.use(express.static("."));

let lastImage=null;

app.post("/api/image", async(req,res)=>{
 const prompt="high conversion product image, cinematic lighting";
 const ai=await fetch("https://api.openai.com/v1/images/generations",{
  method:"POST",
  headers:{
   "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`,
   "Content-Type":"application/json"
  },
  body:JSON.stringify({model:"gpt-image-1",prompt,size:"1024x1024"})
 });
 const data=await ai.json();
 const buf=Buffer.from(data.data[0].b64_json,"base64");
 lastImage=`image_${Date.now()}.png`;
 fs.writeFileSync(lastImage,buf);
 res.json({url:"/"+lastImage});
});

app.post("/api/export", async(req,res)=>{
 const zipName=`export_for_veo_${Date.now()}.zip`;
 const output=fs.createWriteStream(zipName);
 const archive=archiver('zip');
 archive.pipe(output);

 if(lastImage) archive.file(lastImage,{name:"image.png"});

 archive.append(
`Create a short vertical product video.
Aspect ratio 9:16.
Duration 9 seconds.
Use uploaded image as reference.
High conversion style.
No text.`,
 {name:"veo_prompt.txt"}
 );

 await archive.finalize();
 output.on('close',()=>res.json({zip:"/"+zipName}));
});

app.listen(3000,"0.0.0.0",()=>console.log("RUN v4"));
