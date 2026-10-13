import fs from "node:fs";
const file="dist/index.html";
if(!fs.existsSync(file)){console.error("FAIL: dist/index.html absent");process.exit(1)}
const html=fs.readFileSync(file,"utf8");
for(const required of ["Mon portfolio","En construction. Le contenu sera ajouté prochainement."]){
 if(!html.includes(required)){console.error("FAIL: élément absent : "+required);process.exit(1)}
}
for(const legacy of ["CyberMind X","HoneyShield","Security Constellation","Joseph NAKORE","NAKORE.","CTF / DISTINCTIONS"]){
 if(html.includes(legacy)){console.error("FAIL: ancien contenu visible : "+legacy);process.exit(1)}
}
console.log("OK: page d'attente vierge compilée, aucun ancien projet affiché.");
