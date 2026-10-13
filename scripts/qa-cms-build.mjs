import fs from "node:fs";
import {execFileSync} from "node:child_process";
import path from "node:path";

const file="src/data/adminContent.json";
const original=fs.readFileSync(file,"utf8");
const fixture={
 projects:[
  {
   slug:"integration-demo-project",title:"CMS Integration Demo",summary:"Fiche CMS rendue via Astro",
   category:"SECURITY TEST",stage:"Prototype",technologies:["Linux","Python"],
   problem:"Situation de test",approach:"Méthode de test",results:"Résultat fictif du test",
   next:"Mettre à jour",link:"",status:"published",updatedAt:"2026-10-13"
  },
  {
   slug:"integration-draft-hidden",title:"Draft Not Public",summary:"Ne doit pas apparaître",
   category:"SECURITY TEST",stage:"Draft",technologies:[],
   problem:"",approach:"",results:"",next:"",link:"",
   status:"draft",updatedAt:"2026-10-13"
  }
 ],
 achievements:[{
  slug:"integration-ctf-proof",title:"Mock CTF Award",summary:"Prix fictif pour CI",
  result:"Test only",event:"CTF CI",year:"2026",description:"Purely fixture",
  proofUrl:"",status:"published",updatedAt:"2026-10-13"
 }],
 certifications:[{
  slug:"integration-credential",title:"Mock Certificate CI",summary:"Certificate fixture",
  issuer:"Test issuer",credentialState:"preparing",date:"",
  verificationUrl:"",status:"published",updatedAt:"2026-10-13"
 }]
};
const build=()=>execFileSync("npm",["run","build"],{stdio:"pipe",encoding:"utf8",maxBuffer:4*1024*1024});
const exists=filename=>fs.existsSync(path.join("dist",filename));
const source=filename=>fs.readFileSync(path.join("dist",filename),"utf8");
let caught;
try{
 fs.writeFileSync(file,JSON.stringify(fixture,null,2)+"\n");
 build();
 const checks=[
  [exists("projects/integration-demo-project/index.html"),"Published project route not generated"],
  [!exists("projects/integration-draft-hidden/index.html"),"Draft project route leaked"],
  [source("index.html").includes("CMS Integration Demo"),"Published project missing from homepage"],
  [!source("index.html").includes("Draft Not Public"),"Draft project exposed on homepage"],
  [source("projects/index.html").includes("CMS Integration Demo"),"Published project missing from archive"],
  [source("ctf/index.html").includes("Mock CTF Award"),"CTF not integrated"],
  [source("certifications/index.html").includes("Mock Certificate CI"),"Credential not integrated"]
 ];
 for(const [ok,what] of checks)if(!ok)throw Error(what);
 console.log("CMS STATIC BUILD QA PASS",JSON.stringify({newProject:true,draftHidden:true,homepage:true,ctf:true,certifications:true}));
}catch(error){caught=error}
finally{
 fs.writeFileSync(file,original);
 try{build()}catch(error){caught=caught||error}
}
if(caught){console.error("CMS build validation failed:",caught.message);process.exit(1)}
