import {chromium} from "playwright-core";
const base="http://127.0.0.1:4173/portofolio/";
const chrome=process.env.CHROME_BIN||"/usr/bin/google-chrome";
const browser=await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"]});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const errors=[];
page.on("pageerror",error=>errors.push(error.message));
const check=(condition,message)=>{if(!condition)throw Error(message)};
const goto=async(path="")=>page.goto(base+path,{waitUntil:"domcontentloaded"});
await goto();
await page.locator("#cc-title").waitFor();
check((await page.locator("h1").innerText()).includes("Comprendre. Construire."),"Hero not rendered");
check((await page.locator("[data-orbit-index]").count())===5,"Five real projects not visible in constellation");
check((await page.locator(".ws-current-row").count())===5,"Project progress panel missing");
check((await page.locator(".ws-focus-row").count())===4,"Real expertise domains missing");
check((await page.locator(".ws-journal-module").count())===1,"Dynamic Journal module missing");
check((await page.locator(".ws-featured").count())===1,"Featured case study missing");
check((await page.locator(".ws-quote").count())===1,"Hero quote missing");
check((await page.locator("[data-ws-panel=orbit]").isVisible()),"Orbit should be default view");
await page.screenshot({path:"qa-desktop.jpg",fullPage:true,type:"jpeg",quality:82});
await page.locator('[data-orbit-index="1"]').click();
check((await page.locator("[data-case-title]").innerText()).includes("HoneyShield"),"Orbit selection did not update case study");
check((await page.locator("[data-case-link]").getAttribute("href")).includes("honeyshield"),"Orbit case study link broken");
await page.locator('[data-project-index="2"]').click();
check((await page.locator('[data-orbit-index="2"]').getAttribute("aria-pressed"))==="true","Project list not synchronized with constellation");
await page.locator('[data-ws-view="list"]').click();
check((await page.locator("[data-ws-panel=list]").isVisible()),"Project list mode not shown");
check((await page.locator(".ws-directory-entry").count())===5,"List mode should display five project links");
await page.locator('[data-ws-view="graph"]').click();
check((await page.locator("[data-ws-panel=graph]").isVisible()),"Technical investigation mode missing");
check((await page.locator("[data-graph-node]").count())>=25,"Legacy technical graph missing");
await page.locator('[data-graph-node="honeyshield"]').click();
check((await page.locator("[data-inspector-title]").innerText()).includes("HoneyShield"),"Technical inspector failed");
check((await page.locator("[data-inspector-relations] li").count())>=1,"Meaningful relations missing");
await page.locator('[data-map-filter="project"]').click();
check(!(await page.locator('[data-graph-node="threat-1"]').isVisible()),"Graph category filter broken");
await page.locator('[data-map-filter="all"]').click();
await page.locator('[data-ws-view="orbit"]').click();
await page.locator('[data-signal-index="0"]').click();
check(await page.locator("#cc-signal-dialog").isVisible(),"Guided scenario failed");
check((await page.locator("[data-dialog-observables] li").count())>=2,"Investigation evidence checklist missing");
check((await page.locator("[data-dialog-steps] li").count())>=3,"Investigation method missing");
await page.locator("[data-dialog-locate]").click();
check((await page.locator("[data-ws-panel=graph]").isVisible()),"Locate scenario did not reveal graph");
check((await page.locator("[data-inspector-title]").innerText()).includes("Brute force"),"Scenario node not located");
await page.locator("[data-inspector-close]").click();
await page.locator("[data-preferences-open]").first().click();
await page.locator('[data-pref="compact"]').check();
check(await page.locator("body").evaluate(el=>el.classList.contains("cc-compact")),"Display preference failed");
await page.locator("[data-pref-reset]").click();
await page.locator("[data-preferences-close]").click();
await page.locator("#cc-search").fill("Honey");
check(!(await page.locator('[data-project-index="0"]').isVisible()),"Search did not filter projects");
await page.locator("#cc-search").fill("");
const widths=[320,360,375,390,430,600,650,768,820,1024,1280,1440,1920,2560];
const failures=[];
for(const width of widths){
  await page.setViewportSize({width,height:Math.max(760,Math.round(width*.68))});
  await page.waitForTimeout(120);
  const layout=await page.evaluate(()=>{
    const orbit=document.querySelector(".ws-orbit-viewport");
    const bar=document.querySelector(".cc-topbar");
    const main=document.querySelector(".cc-main");
    return {
      documentWidth:document.documentElement.scrollWidth,
      innerWidth:innerWidth,
      orbitPan:!!orbit&&orbit.scrollWidth>orbit.clientWidth+15,
      headerRight:bar?.getBoundingClientRect().right,
      mainRight:main?.getBoundingClientRect().right
    };
  });
  if(layout.documentWidth>width+4)failures.push(width+"px document overflow "+JSON.stringify(layout));
  if((layout.headerRight||0)>width+4)failures.push(width+"px header overflow "+JSON.stringify(layout));
  if((layout.mainRight||0)>width+4)failures.push(width+"px main overflow "+JSON.stringify(layout));
  if(width<=430&&!layout.orbitPan)failures.push(width+"px orbit not pannable");
  if([320,390,768,1440,1920].includes(width)){
    await page.locator('[data-ws-view="orbit"]').click();
    await page.screenshot({path:"qa-"+width+".jpg",fullPage:true,type:"jpeg",quality:80});
  }
}
check(failures.length===0,"Responsive issues: "+failures.join("\n"));
await page.setViewportSize({width:390,height:844});
await page.locator('[data-ws-view="orbit"]').click();
await page.locator('[data-orbit-index="1"]').evaluate(el=>el.scrollIntoView({block:"center",inline:"center"}));
await page.locator('[data-orbit-index="1"]').click();
check((await page.locator("[data-case-title]").innerText()).includes("HoneyShield"),"Mobile orbit action failed");
await page.locator("[data-sidebar-toggle]").click();
check(await page.locator("body").evaluate(el=>el.classList.contains("cc-sidebar-open")),"Mobile navigation did not open");
await page.locator("[data-sidebar-close]").first().click();
check(!(await page.locator("body").evaluate(el=>el.classList.contains("cc-sidebar-open"))),"Mobile navigation did not close");
for(const path of ["projects/","projects/cybermind-x/","labs/","writeups/","notes/","journal/","roadmap/","about/"]){
  await goto(path);
  check(!(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4)),"Internal route overflow: "+path);
}
check(errors.length===0,"JavaScript errors: "+errors.join("; "));
console.log("VISUAL QA PASSED",JSON.stringify({screens:widths.length,orbitNodes:5,realJournal:true,graph:true,filters:true,caseStudies:true,mobile:true,errors:0}));
await browser.close();
