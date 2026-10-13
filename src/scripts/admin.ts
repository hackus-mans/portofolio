/**
 * Static-site editorial console. No credential is shipped or persisted.
 * A fine-grained GitHub PAT (Contents: read/write, selected repository only)
 * is held in memory and sent directly to https://api.github.com over TLS.
 * The /admin HTML is PUBLIC: only GitHub authorizes write operations.
 */
type Section = "dashboard"|"writeups"|"labs"|"notes"|"projects"|"achievements"|"certifications"|"media";
type EntryKind = Exclude<Section,"dashboard"|"media">;
type Status = "draft"|"published";
type ContentFile = {name:string;path:string;sha:string;type:string};
type ManagedItem = Record<string,unknown> & {slug:string;title:string;status:Status;summary?:string};
type AdminData = {projects:ManagedItem[];achievements:ManagedItem[];certifications:ManagedItem[]};
type GithubFile = {sha:string;content:string;path:string;encoding:string};
type EditorState = {path?:string;sha?:string;slug?:string;kind?:EntryKind};
const $ = <T extends HTMLElement=HTMLElement>(id:string):T=>{
  const node=document.getElementById(id);
  if(!node)throw new Error("Admin interface incomplete: "+id);
  return node as T;
};
const owner=document.body.dataset.repoOwner||"";
const repository=document.body.dataset.repoName||"";
const repoRoot="/repos/"+encodeURIComponent(owner)+"/"+encodeURIComponent(repository);
const existingProjectSlugs=(document.body.dataset.existingProjects||"").split(",").filter(Boolean);
const apiRoot="https://api.github.com";
const sectionNames:Record<Section,string>={
 dashboard:"Tableau de bord",writeups:"Writeups",labs:"Laboratoires",
 notes:"Notes",projects:"Projets",achievements:"CTF & distinctions",
 certifications:"Certifications",media:"Images & médias"
};
const sectionDescriptions:Record<Section,string>={
 dashboard:"Rédige, publie et organise les contenus de ton portfolio.",
 writeups:"Tes comptes rendus de challenges autorisés et leur méthodologie.",
 labs:"Tes expérimentations pratiques et laboratoires documentés.",
 notes:"Les concepts, commandes et découvertes que tu souhaites conserver.",
 projects:"Créer de nouveaux projets avec leur étude de cas détaillée.",
 achievements:"Tes compétitions et distinctions avec leurs justificatifs.",
 certifications:"Tes qualifications et objectifs, avec un statut explicite.",
 media:"Téléverser des captures pour tes writeups et dossiers."
};
const articleKinds=["writeups","labs","notes"] as const;
const managedKinds=["projects","achievements","certifications"] as const;
const isArticle=(section:Section):section is typeof articleKinds[number]=>articleKinds.includes(section as any);
const isManaged=(section:Section):section is typeof managedKinds[number]=>managedKinds.includes(section as any);
let token="";
let currentSection:Section="dashboard";
let editor:EditorState={};
let adminData:AdminData={projects:[],achievements:[],certifications:[]};
let adminJsonSha="";
let filesCache:Record<string,ContentFile[]>={};
let items:ManagedItem[]=[];
let editing=false;
let notificationTimer:number|undefined;
const input=(name:string)=>(document.querySelector<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>('#admin-editor-form [name="'+name+'"]'))!;
const value=(name:string)=>input(name)?.value.trim()||"";
const setValue=(name:string,value:unknown)=>{const node=input(name);if(node)node.value=String(value??"");};
const delay=()=>new Promise<void>(resolve=>window.setTimeout(resolve,50));
const slugify=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,75).replace(/-$/,"");
const sanitizeUrl=(value:string)=>{if(!value)return "";let parsed:URL;try{parsed=new URL(value)}catch{throw Error("Lien invalide : utilise une adresse complète en https://.");}if(!["https:","http:"].includes(parsed.protocol))throw Error("Seuls les liens HTTP(S) sont acceptés.");return parsed.toString()};
const parseTags=(value:string)=>value.split(",").map(s=>s.trim()).filter(Boolean).slice(0,30);
const encodeUtf8=(str:string)=>btoa(Array.from(new TextEncoder().encode(str),b=>String.fromCharCode(b)).join(""));
const decodeUtf8=(data:string)=>new TextDecoder().decode(Uint8Array.from(atob(data.replace(/\s/g,"")),c=>c.charCodeAt(0)));
function notify(text:string,isError=false){
  const box=$("admin-toast");box.textContent=text;box.classList.toggle("is-error",isError);box.hidden=false;
  if(notificationTimer)clearTimeout(notificationTimer);
  notificationTimer=window.setTimeout(()=>{box.hidden=true;},7500);
}
function busy(button:HTMLButtonElement,working:boolean,label:string){
  button.disabled=working;
  if(working){button.dataset.oldLabel=button.textContent||"";button.textContent=label;}
  else{button.textContent=button.dataset.oldLabel||button.textContent||"";}
}
async function api<T=any>(path:string,method="GET",body?:unknown):Promise<T>{
  if(!token)throw Error("Session expirée : reconnecte-toi.");
  const response=await fetch(apiRoot+path,{
    method,
    headers:{
      "Accept":"application/vnd.github+json",
      "Authorization":"Bearer "+token,
      "X-GitHub-Api-Version":"2022-11-28",
      ...(body!==undefined?{"Content-Type":"application/json"}:{})
    },
    cache:"no-store",
    credentials:"omit",
    referrerPolicy:"no-referrer",
    body:body!==undefined?JSON.stringify(body):undefined
  });
  const text=await response.text();
  let json:any;
  try{json=text?JSON.parse(text):{};}catch{json={message:text.slice(0,200)}}
  if(!response.ok){
    if(response.status===401)throw Error("Jeton invalide ou expiré. Crée un nouveau jeton GitHub.");
    if(response.status===403)throw Error("GitHub a refusé l'opération (droits insuffisants ou limite d'API). Vérifie Contents: Read and write.");
    if(response.status===404)throw Error("Dossier introuvable ou non autorisé. Vérifie que le jeton cible le dépôt "+owner+"/"+repository+".");
    if(response.status===409||response.status===422)throw Error("Conflit GitHub : "+String(json.message||"un fichier a été modifié. Recharge et réessaie.").slice(0,220));
    throw Error("GitHub API "+response.status+" : "+String(json.message||"réponse inattendue").slice(0,180));
  }
  return json as T;
}
const pathUrl=(path:string)=>repoRoot+"/contents/"+path.split("/").map(encodeURIComponent).join("/")+"?ref=main";
const getFile=(path:string)=>api<GithubFile>(pathUrl(path));
const getText=async(path:string)=>decodeUtf8((await getFile(path)).content);
const putFile=(path:string,content:string,sha?:string)=>api(
  repoRoot+"/contents/"+path.split("/").map(encodeURIComponent).join("/"),"PUT",{
    message:"content(admin): "+(sha?"mettre à jour ":"publier ")+path,
    content:encodeUtf8(content),branch:"main",...(sha?{sha}:{})
  }
);
const deleteFile=(path:string,sha:string)=>api(
  repoRoot+"/contents/"+path.split("/").map(encodeURIComponent).join("/"),"DELETE",{
    message:"content(admin): retirer "+path,sha,branch:"main"
  }
);
async function fetchManaged(){
  const file=await getFile("src/data/adminContent.json");
  const parsed=JSON.parse(decodeUtf8(file.content));
  for(const kind of managedKinds)if(!Array.isArray(parsed[kind]))throw Error("Contenu CMS invalide : "+kind);
  adminData=parsed;adminJsonSha=file.sha;
}
async function fetchFiles(kind:typeof articleKinds[number],force=false){
  if(!force&&filesCache[kind])return filesCache[kind];
  const listing=await api<any[]>(pathUrl("src/content/"+kind));
  filesCache[kind]=(Array.isArray(listing)?listing:[]).filter(item=>item.type==="file"&&item.name.endsWith(".md")).map(item=>({name:item.name,path:item.path,sha:item.sha,type:item.type}));
  return filesCache[kind];
}
async function refreshDashboard(){
  await Promise.all([fetchManaged(),...articleKinds.map(kind=>fetchFiles(kind,true))]);
  for(const key of articleKinds)$("stat-"+key).textContent=String(filesCache[key].length);
  $("stat-projects").textContent=String(adminData.projects.length);
}
function showSection(section:Section){
  currentSection=section;
  editing=false;
  $("admin-section-title").textContent=sectionNames[section];
  $("admin-section-desc").textContent=sectionDescriptions[section];
  $("admin-dashboard").hidden=section!=="dashboard";
  $("admin-library").hidden=section==="dashboard"||section==="media";
  $("admin-media").hidden=section!=="media";
  $("admin-editor").hidden=true;
  $("admin-create").hidden=section==="dashboard"||section==="media";
  if(section!=="dashboard"&&section!=="media")$("admin-create").textContent="+ "+(section==="projects"?"Nouveau projet":section==="certifications"?"Nouvelle certification":section==="achievements"?"Nouveau résultat":"Nouvel article");
  document.querySelectorAll<HTMLButtonElement>(".admin-nav-item").forEach(item=>{
    const active=item.dataset.section===section;
    item.classList.toggle("is-active",active);
    if(active)item.setAttribute("aria-current","page");else item.removeAttribute("aria-current");
  });
  $("admin-mobile-section").setAttribute("value",section);
  ($("admin-mobile-section") as HTMLSelectElement).value=section;
  if(section!=="dashboard"&&section!=="media")void openLibrary(section as EntryKind).catch(error=>notify(message(error),true));
}
const message=(err:unknown)=>err instanceof Error?err.message:"Opération impossible.";
function listItem(title:string,subtitle:string,status:Status,index:number){
  const button=document.createElement("button");
  button.type="button";button.className="admin-list-item";
  const copy=document.createElement("span");copy.className="admin-list-item-copy";
  const name=document.createElement("strong");name.textContent=title;
  const desc=document.createElement("small");desc.textContent=subtitle;
  copy.append(name,desc);
  const badge=document.createElement("span");badge.className="admin-label"+(status==="published"?" is-published":"");
  badge.textContent=status==="published"?"Publié":"Brouillon";
  const arrow=document.createElement("span");arrow.textContent="↗";
  button.append(copy,badge,arrow);
  button.addEventListener("click",()=>{void editItem(index).catch(error=>notify(message(error),true))});
  return button;
}
async function openLibrary(kind:EntryKind){
  const box=$("admin-list");box.replaceChildren();
  const loading=document.createElement("p");loading.className="admin-list-empty";loading.textContent="Chargement des contenus…";box.append(loading);
  if(isArticle(kind)){
    const files=await fetchFiles(kind,true);
    items=files.map(file=>({slug:file.name.replace(/\.md$/,""),title:file.name.replace(/\.md$/,"").replace(/-/g," "),summary:file.path,status:"draft",path:file.path,sha:file.sha}));
  }else{
    await fetchManaged();
    items=[...adminData[kind]];
  }
  renderList();
}
function renderList(){
  const box=$("admin-list");box.replaceChildren();
  const query=($<HTMLInputElement>("admin-filter").value||"").normalize("NFD").toLowerCase().trim();
  const filtered=items.map((item,index)=>({item,index})).filter(({item})=>[item.title,item.summary,item.slug].join(" ").normalize("NFD").toLowerCase().includes(query));
  $("admin-list-total").textContent=filtered.length+" entrée(s)";
  if(filtered.length===0){
    const empty=document.createElement("div");empty.className="admin-list-empty";
    const strong=document.createElement("strong");strong.textContent=query?"Aucun résultat":"C'est encore vide.";
    const p=document.createElement("p");p.textContent=query?"Essaie un autre terme.":"Clique sur « Nouvelle publication » pour commencer.";
    empty.append(strong,p);box.append(empty);
    return;
  }
  for(const {item,index} of filtered)box.append(listItem(item.title,item.summary||String(item.path||""),item.status,index));
}
function showEditor(kind:EntryKind,record?:ManagedItem,meta?:EditorState){
  editing=true;
  editor={kind,...meta,slug:record?.slug||meta?.slug};
  const form=$<HTMLFormElement>("admin-editor-form");form.reset();
  $("admin-library").hidden=true;$("admin-dashboard").hidden=true;$("admin-editor").hidden=false;
  $("admin-create").hidden=true;$("admin-delete").hidden=!record && !meta?.path;
  $("admin-editor-heading").textContent=record||meta?.path?"Modifier la publication":"Nouvelle publication";
  $("admin-editor-kicker").textContent=sectionNames[kind].toUpperCase();
  document.querySelectorAll<HTMLElement>("[data-form-kind]").forEach(element=>{
    const group=element.dataset.formKind;
    element.hidden=(group==="article"?!isArticle(kind):group!==kind);
  });
  document.querySelectorAll<HTMLElement>("[data-article-field]").forEach(element=>element.hidden=element.dataset.articleField!==kind);
  const slugInput=input("slug");
  slugInput.readOnly=Boolean(record||meta?.path);
  slugInput.value=record?.slug||meta?.slug||"";
  if(record){
    for(const [key,v] of Object.entries(record))if(key!=="slug")setValue(key,Array.isArray(v)?v.join(", "):v);
    setValue("title",record.title);setValue("summary",record.summary);
  }else{
    setValue("status","draft");setValue("publishedAt",new Date().toISOString().slice(0,10));
  }
  refreshPreview();
  $("admin-editor").scrollIntoView({behavior:"smooth",block:"start"});
}
function refreshPreview(){
  $("admin-preview-title").textContent=value("title")||"Titre de la publication";
  $("admin-preview-summary").textContent=value("summary")||"Ton résumé apparaîtra ici.";
}
function frontmatter(src:string){
  const m=src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if(!m)throw Error("Cet article ne contient pas de frontmatter Markdown valide.");
  const fields:Record<string,any>={};
  for(const line of m[1].split(/\r?\n/)){
    const index=line.indexOf(":");if(index<0)continue;
    const key=line.slice(0,index).trim();const raw=line.slice(index+1).trim();
    if(!raw)continue;
    try{fields[key]=JSON.parse(raw)}
    catch{fields[key]=raw.replace(/^['"]|['"]$/g,"");}
  }
  return {fields,body:src.slice(m[0].length)};
}
async function editItem(index:number){
  const item=items[index];if(!item)return;
  if(isArticle(currentSection)){
    const raw=await getFile(String(item.path));
    const {fields,body}=frontmatter(decodeUtf8(raw.content));
    const name=String(item.path).split("/").pop()||"article.md";
    const slug=name.replace(/\.md$/,"");
    showEditor(currentSection,undefined,{kind:currentSection,path:raw.path,sha:raw.sha,slug});
    for(const [key,v] of Object.entries(fields))setValue(key,Array.isArray(v)?v.join(", "):v);
    setValue("body",body);
  }else if(isManaged(currentSection)){
    showEditor(currentSection,item,{kind:currentSection,slug:item.slug});
  }
  refreshPreview();
}
async function saveEntry(event:SubmitEvent){
  event.preventDefault();
  if(!editor.kind)return;
  const kind=editor.kind;
  const title=value("title");const summary=value("summary");
  if(!title||!summary)throw Error("Le titre et le résumé sont obligatoires.");
  if(title.length>160||summary.length>400)throw Error("Le titre ou le résumé dépasse la limite autorisée.");
  const slug=editor.slug||slugify(value("slug")||title);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))throw Error("L'identifiant URL doit utiliser a-z, 0-9 et des tirets.");
  const status=value("status")==="published"?"published":"draft";
  const today=new Date().toISOString().slice(0,10);
  if(isArticle(kind)){
    const text=value("body");
    if(status==="published"&&!text)throw Error("Le contenu d'un article publié ne peut pas être vide.");
    const fields=[
      "---",
      "title: "+JSON.stringify(title),"summary: "+JSON.stringify(summary),
      "publishedAt: "+(value("publishedAt")||today),
      "tags: "+JSON.stringify(parseTags(value("tags"))),
      "status: "+JSON.stringify(status)
    ];
    if(kind==="writeups")fields.push("platform: "+JSON.stringify(value("platform")),"difficulty: "+JSON.stringify(value("difficulty")));
    if(kind==="labs")fields.push("domain: "+JSON.stringify(value("domain")||"Cybersécurité"),"state: "+JSON.stringify(value("state")||"active"));
    if(kind==="notes")fields.push("topic: "+JSON.stringify(value("topic")||"Journal"));
    const source=fields.join("\n")+"\n---\n\n"+(text||"## Brouillon à compléter\n")+"\n";
    const path=editor.path||"src/content/"+kind+"/"+slug+".md";
    if(source.length>900000)throw Error("Article trop long pour cet éditeur. Utilise GitHub pour les gros fichiers.");
    await putFile(path,source,editor.sha);
    delete filesCache[kind];
  }else{
    if(kind==="projects" && !editor.slug && existingProjectSlugs.includes(slug))throw Error("Ce slug appartient déjà à un projet historique.");
    if(!editor.slug && adminData[kind].some(item=>item.slug===slug))throw Error("Cet identifiant existe déjà. Choisis un autre titre ou slug.");
    const base={slug,title,summary,status,updatedAt:today};
    let entry:ManagedItem=base;
    if(kind==="projects")entry={
      ...base,category:value("category"),stage:value("stage"),
      technologies:parseTags(value("technologies")),
      problem:value("problem"),approach:value("approach"),results:value("results"),
      next:value("next"),link:sanitizeUrl(value("link"))
    };
    if(kind==="achievements")entry={
      ...base,result:value("result"),event:value("event"),
      year:value("year"),description:summary,proofUrl:sanitizeUrl(value("proofUrl"))
    };
    if(kind==="certifications")entry={
      ...base,issuer:value("issuer"),credentialState:value("credentialState")==="preparing"?"preparing":"earned",
      date:value("date"),verificationUrl:sanitizeUrl(value("verificationUrl"))
    };
    const list=adminData[kind];
    const position=list.findIndex(item=>item.slug===slug);
    if(position>=0)list[position]=entry;else list.unshift(entry);
    const updated=JSON.stringify(adminData,null,2)+"\n";
    await putFile("src/data/adminContent.json",updated,adminJsonSha);
    await fetchManaged();
  }
  notify("Enregistré dans GitHub. Le site sera actualisé après le déploiement.");
  $("admin-editor").hidden=true;
  $("admin-create").hidden=false;
  $("admin-library").hidden=false;
  await openLibrary(kind);
  await refreshDashboard();
}
async function deleteEntry(){
  if(!editor.kind||(!editor.path&&!editor.slug))return;
  const name=value("title")||editor.slug||"cette publication";
  if(!window.confirm('Retirer définitivement « '+name+' » du dépôt principal ? L’historique GitHub permettra une récupération.'))return;
  const kind=editor.kind;
  if(isArticle(kind)){
    if(!editor.path||!editor.sha)throw Error("Fichier impossible à identifier.");
    await deleteFile(editor.path,editor.sha);
    delete filesCache[kind];
  }else{
    const index=adminData[kind].findIndex(item=>item.slug===editor.slug);
    if(index<0)throw Error("Publication introuvable.");
    adminData[kind].splice(index,1);
    await putFile("src/data/adminContent.json",JSON.stringify(adminData,null,2)+"\n",adminJsonSha);
    await fetchManaged();
  }
  notify("Publication retirée. Le site sera actualisé après le déploiement.");
  showSection(kind);
  await refreshDashboard();
}
async function uploadImage(event:SubmitEvent){
  event.preventDefault();
  const file=$<HTMLInputElement>("media-file").files?.[0];
  if(!file)throw Error("Sélectionne une image.");
  if(!["image/png","image/jpeg","image/webp"].includes(file.type))throw Error("Formats autorisés : PNG, JPEG, WebP.");
  if(file.size>1500000)throw Error("Image trop volumineuse (maximum 1,5 Mo). Compresse-la avant l'envoi.");
  const ext=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg";
  const original=file.name.replace(/\.[^.]+$/,"");
  const name=slugify(original)||"capture";
  const fileName=name+"-"+new Date().toISOString().replace(/[-:TZ.]/g,"").slice(0,14)+"."+ext;
  const bytes=new Uint8Array(await file.arrayBuffer());
  const imageBase64=btoa(Array.from(bytes,b=>String.fromCharCode(b)).join(""));
  const path="public/images/"+fileName;
  await api(repoRoot+"/contents/"+path,"PUT",{
    message:"media(admin): add "+fileName,branch:"main",content:imageBase64
  });
  const sitePath="/portofolio/images/"+fileName;
  const alt=$<HTMLInputElement>("media-alt").value.trim()||name.replace(/-/g," ");
  $("admin-upload-markdown").textContent="!["+alt.replace(/[\[\]]/g,"")+"]("+sitePath+")";
  $("admin-upload-result").hidden=false;
  notify("Image ajoutée à GitHub. Elle sera publique après déploiement.");
}
function signout(){
  token="";
  adminData={projects:[],achievements:[],certifications:[]};adminJsonSha="";
  filesCache={};items=[];editor={};editing=false;
  $("admin-login-form").removeAttribute("hidden");
  $("admin-auth").hidden=false;$("admin-shell").hidden=true;
  $("admin-signout").hidden=true;
  $("admin-connection").classList.remove("is-connected");$("admin-connection").textContent="● Déconnecté";
  $<HTMLInputElement>("github-token").value="";
  showSection("dashboard");
}
const wrap=async(fn:()=>Promise<unknown>,button?:HTMLButtonElement)=>{
  if(button)busy(button,true,"Opération en cours…");
  try{await fn();}
  catch(error){notify(message(error),true);}
  finally{if(button)busy(button,false,"");}
};
$<HTMLFormElement>("admin-login-form").addEventListener("submit",event=>{
  event.preventDefault();
  const loginButton=$<HTMLButtonElement>("admin-login");
  void wrap(async()=>{
    const submitted=$<HTMLInputElement>("github-token").value.trim();
    $<HTMLInputElement>("github-token").value="";
    if(!submitted)throw Error("Saisis ton jeton GitHub.");
    token=submitted;
    try{
      const user=await api<{login:string}>("/user");
      if(user.login.toLowerCase()!==owner.toLowerCase())throw Error("Ce portail est réservé au compte GitHub "+owner+".");
      await refreshDashboard();
      $("admin-auth").hidden=true;$("admin-shell").hidden=false;
      $("admin-signout").hidden=false;
      const connected=$("admin-connection");connected.textContent="● Connecté";connected.classList.add("is-connected");
      $("admin-account-name").textContent="@"+user.login;
      showSection("dashboard");
      notify("Connexion réussie. Bienvenue dans ton studio de publication.");
    }catch(error){token="";throw error;}
  },loginButton);
});
$("admin-toggle-token").addEventListener("click",()=>{
 const node=$<HTMLInputElement>("github-token");node.type=node.type==="password"?"text":"password";
 $("admin-toggle-token").textContent=node.type==="password"?"Voir":"Masquer";
});
$("admin-signout").addEventListener("click",signout);
document.querySelectorAll<HTMLButtonElement>("[data-section]").forEach(button=>button.addEventListener("click",()=>showSection(button.dataset.section as Section)));
$<HTMLSelectElement>("admin-mobile-section").addEventListener("change",event=>showSection((event.target as HTMLSelectElement).value as Section));
document.querySelectorAll<HTMLButtonElement>("[data-quick]").forEach(button=>button.addEventListener("click",()=>{
 const kind=button.dataset.quick as EntryKind;showSection(kind);showEditor(kind);
}));
$("admin-create").addEventListener("click",()=>showEditor(currentSection as EntryKind));
$("admin-cancel").addEventListener("click",()=>showSection(currentSection));
$<HTMLFormElement>("admin-editor-form").addEventListener("submit",event=>void wrap(()=>saveEntry(event),$<HTMLButtonElement>("admin-save")));
$("admin-delete").addEventListener("click",()=>void wrap(deleteEntry,$<HTMLButtonElement>("admin-delete")));
$<HTMLInputElement>("admin-filter").addEventListener("input",renderList);
input("title").addEventListener("input",()=>{
  if(!editor.slug)setValue("slug",slugify(value("title")));
  refreshPreview();
});
input("summary").addEventListener("input",refreshPreview);
$<HTMLFormElement>("admin-image-form").addEventListener("submit",event=>void wrap(()=>uploadImage(event)));
$("admin-copy-image").addEventListener("click",()=>{
 void navigator.clipboard.writeText($("admin-upload-markdown").textContent||"")
   .then(()=>notify("Markdown copié."),()=>notify("Impossible de copier : sélectionne le texte manuellement.",true));
});
window.addEventListener("pagehide",()=>{token="";});
