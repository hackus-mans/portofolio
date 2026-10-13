import {chromium} from "playwright-core";
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"]});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const base="http://127.0.0.1:4173/portofolio/";
const failures=[];page.on("pageerror",e=>failures.push(e.message));
const check=(condition,label)=>{if(!condition)throw Error(label)};
const encode=text=>Buffer.from(text,"utf8").toString("base64");
const decode=text=>Buffer.from(text,"base64").toString("utf8");
let authorized=false;
let db={projects:[],achievements:[],certifications:[]};
let dbSha="initial_sha";
let mediaCount=0;
const articles={writeups:[],labs:[],notes:[]};
const responses=[];
await page.route("https://api.github.com/**",async route=>{
  const request=route.request(),method=request.method(),uri=new URL(request.url());
  const pathname=decodeURIComponent(uri.pathname);
  const headers={
    "access-control-allow-origin":"*",
    "access-control-allow-methods":"GET,PUT,DELETE,OPTIONS",
    "access-control-allow-headers":"authorization,content-type,accept,x-github-api-version",
    "content-type":"application/json"
  };
  const send=(json,status=200)=>route.fulfill({status,headers,body:JSON.stringify(json)});
  if(method==="OPTIONS")return route.fulfill({status:204,headers});
  const auth=request.headers()["authorization"]||"";
  if(!auth.startsWith("Bearer "))return send({message:"Unauthorized"},401);
  if(pathname==="/user")return send({login:authorized?"hackus-mans":"not-the-owner"});
  const prefix="/repos/hackus-mans/portofolio/contents/";
  if(!pathname.startsWith(prefix))return send({message:"Unknown API "+pathname},404);
  const file=pathname.slice(prefix.length);
  if(file==="src/data/adminContent.json"){
    if(method==="GET")return send({sha:dbSha,content:encode(JSON.stringify(db)),encoding:"base64",path:file});
    if(method==="PUT"){
      const body=request.postDataJSON();
      if(body.sha!==dbSha)return send({message:"Conflict"},409);
      db=JSON.parse(decode(body.content));dbSha="new_sha_"+Date.now();
      responses.push({method,file,body:db});
      return send({content:{sha:dbSha},commit:{sha:"commitMock"}});
    }
  }
  const catMatch=file.match(/^src\/content\/(writeups|labs|notes)(?:\/(.*))?$/);
  if(catMatch){
    const cat=catMatch[1],name=catMatch[2];
    if(!name){
      if(method!=="GET")return send({message:"Wrong method"},405);
      return send([{name:".gitkeep",path:"src/content/"+cat+"/.gitkeep",sha:"x",type:"file"},...articles[cat].map(entry=>({name:entry.name,path:entry.path,sha:entry.sha,type:"file"}))]);
    }
    const path="src/content/"+cat+"/"+name, index=articles[cat].findIndex(x=>x.name===name);
    if(method==="GET"&&index>=0)return send({sha:articles[cat][index].sha,path,encoding:"base64",content:articles[cat][index].content});
    if(method==="PUT"){
      const body=request.postDataJSON();
      if(index>=0 && body.sha!==articles[cat][index].sha)return send({message:"File conflict"},409);
      const item={name,path,sha:"sha_"+Date.now(),content:body.content};
      if(index>=0)articles[cat][index]=item;else articles[cat].push(item);
      responses.push({method,file,body:decode(body.content)});
      return send({content:{sha:item.sha},commit:{sha:"commitMock"}});
    }
    if(method==="DELETE"&&index>=0){
      articles[cat].splice(index,1);responses.push({method,file});
      return send({commit:{sha:"commitMock"}});
    }
  }
  if(file.startsWith("public/images/")&&method==="PUT"){
    mediaCount++;responses.push({method,file});
    return send({content:{sha:"image_"+mediaCount},commit:{sha:"commitMock"}});
  }
  return send({message:"Unmocked "+method+" "+file},404);
});
await page.goto(base+"admin/",{waitUntil:"networkidle"});
check(await page.locator("#admin-auth").isVisible(),"Admin login screen missing");
check(await page.locator("#admin-shell").isHidden(),"Admin should start locked");
check((await page.locator('meta[name="robots"]').getAttribute("content")).includes("noindex"),"Admin is indexed");
check((await page.locator("#github-token").getAttribute("type"))==="password","Token must be password-masked");
await page.locator("#github-token").fill("fake_token_for_QA");
await page.locator("#admin-login").click();
await page.getByText("Ce portail est réservé au compte GitHub").waitFor();
check(await page.locator("#admin-shell").isHidden(),"Non-owner could enter!");
authorized=true;
await page.locator("#github-token").fill("fake_token_for_QA");
await page.locator("#admin-login").click();
await page.locator("#admin-shell").waitFor({state:"visible"});
check((await page.locator("#admin-account-name").innerText())==="@hackus-mans","Wrong account admitted");
const ls=await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}));
check(!ls.includes("fake_token_for_QA"),"Token leaked into browser storage");
await page.screenshot({path:"qa-admin-desktop.jpg",fullPage:true,type:"jpeg",quality:82});

await page.locator('[data-quick="writeups"]').click();
await page.locator("#field-title").fill("HTB - Premier laboratoire");
await page.locator("#field-summary").fill("Comprendre une procédure de découverte de services.");
await page.locator("#field-body").fill("## Observation\n\nScan de laboratoire autorisé.\n\n## Résultat\n\nContrôle terminé.");
await page.locator("#field-platform").fill("Hack The Box");
await page.locator("#field-tags").fill("HTB, Linux, Enumeration");
await page.locator("#field-status").selectOption("published");
await page.locator("#admin-save").click();
await page.getByText("Enregistré dans GitHub").first().waitFor();
check(articles.writeups.length===1,"Writeup was not created via GitHub API");
check(decode(articles.writeups[0].content).includes('status: "published"'),"Writeup wasn't published");
check(decode(articles.writeups[0].content).includes('platform: "Hack The Box"'),"Writeup metadata missing");

await page.locator('[data-quick="projects"]').click();
await page.locator("#field-title").fill("Mon Projet de Recherche");
await page.locator("#field-summary").fill("Dossier créé et administré depuis le portail.");
await page.locator("#project-category").fill("Security Engineering");
await page.locator("#project-stage").fill("Prototype");
await page.locator("#project-tech").fill("Python, Docker");
await page.locator("#project-problem").fill("Corréler des données de laboratoire.");
await page.locator("#project-approach").fill("Collecte et analyse.");
await page.locator("#project-results").fill("Architecture documentée.");
await page.locator("#field-status").selectOption("published");
await page.locator("#admin-save").click();
await page.getByText("Enregistré dans GitHub").first().waitFor();
check(db.projects.length===1,"Managed project wasn't saved");
check(db.projects[0].slug==="mon-projet-de-recherche","Project slug incorrect");
check(db.projects[0].status==="published","Project status not published");

await page.locator('[data-section="certifications"]').click();
await page.locator("#admin-create").click();
await page.locator("#field-title").fill("Formation de test");
await page.locator("#field-summary").fill("Préparation en cours");
await page.locator("#credential-state").selectOption("preparing");
await page.locator("#field-status").selectOption("published");
await page.locator("#admin-save").click();
await page.getByText("Enregistré dans GitHub").first().waitFor();
check(db.certifications.length===1&&db.certifications[0].credentialState==="preparing","Certification management failed");

await page.setViewportSize({width:390,height:844});
await page.screenshot({path:"qa-admin-mobile.jpg",fullPage:true,type:"jpeg",quality:81});
check(await page.locator("#admin-mobile-section").isVisible(),"Mobile navigation missing");
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3);
check(!overflow,"Admin page overflows at 390px");
await page.locator("#admin-mobile-section").selectOption("media");
await page.locator("#media-file").setInputFiles({
 name:"test-image.png",mimeType:"image/png",buffer:Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9FcnsUwAAAAASUVORK5CYII=","base64")
});
await page.locator("#admin-image-form button[type=submit]").click();
await page.getByText("Image enregistrée !").waitFor();
check(mediaCount===1,"Media upload failed");

await page.locator("#admin-signout").click();
check(await page.locator("#admin-shell").isHidden(),"Sign out failed");
check(await page.locator("#github-token").inputValue()==="","Token input not cleared after signout");
check(failures.length===0,"Runtime failures: "+failures.join("; "));
console.log("ADMIN QA PASSED",JSON.stringify({ownerCheck:true,tokenStorage:false,writeups:articles.writeups.length,projects:db.projects.length,certs:db.certifications.length,images:mediaCount,mobile:true,apiRequests:responses.length,pageErrors:failures.length}));
await browser.close();
