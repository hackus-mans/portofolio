import { chromium } from "playwright-core";
import fs from "node:fs";
const base="http://127.0.0.1:4173/portofolio/";
const chrome=process.env.CHROME_BIN||"/usr/bin/google-chrome";
const browser=await chromium.launch({headless:true,executablePath:chrome,args:["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"]});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
page.on("pageerror",e=>errors.push(e.message));
// Visitor-facing portfolio and editorial routes.
await page.goto(base,{waitUntil:"networkidle"});
if(!(await page.locator("h1").innerText()).includes("NAKORE"))throw Error("Personal hero missing");
await page.locator('[data-domain="defense"]').click();
if(!await page.locator("#panel-defense").isVisible())throw Error("Domain switch failed");
await page.locator('[data-domain="defense"]').press("ArrowRight");
if(!await page.locator("#panel-engineering").isVisible())throw Error("Keyboard domain navigation failed");
await page.locator('[data-domain="offense"]').click();
await page.locator('[data-command-open]').click();
await page.locator('[data-command-query]').fill("journal");
await page.locator('[data-command-item]:visible').click();
if(!(await page.locator("h1").innerText()).includes("Journal"))throw Error("Journal navigation failed");
await page.goto(base,{waitUntil:"networkidle"});
for(const width of [320,360,390,520,768,820,1024,1440,1920,2560]){
  await page.setViewportSize({width,height:900});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3))throw Error("Portfolio overflow at "+width);
  if(width===390||width===1440)await page.screenshot({path:width===390?"qa-mobile.jpg":"qa-desktop.jpg",type:"jpeg",quality:85,fullPage:true});
}
await page.setViewportSize({width:390,height:844});
await page.locator('[data-pf-menu]').click();
if(!await page.locator('#pf-navigation').isVisible())throw Error("Portfolio mobile menu missing");
await page.locator('#pf-navigation a').filter({hasText:"Projets"}).click();
if(!(await page.locator("h1").innerText()).includes("Projets"))throw Error("Mobile project navigation failed");
for(const path of ["about/","contact/","journal/","notes/workflow-pentest/"]){
 await page.goto(base+path,{waitUntil:"domcontentloaded"});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3))throw Error("Portfolio subpage overflow: "+path);
}
await page.setViewportSize({width:1440,height:900});
await page.goto(base+"atlas/",{waitUntil:"networkidle"});
await page.locator("h1").waitFor();
if(!(await page.locator("h1").innerText()).includes("Explorer les liens."))throw Error("Dashboard hero missing");
const nodes=await page.locator("[data-graph-node]").count();
if(nodes<25)throw Error("Network nodes missing: "+nodes);
const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4);
if(overflow)throw Error("Desktop horizontal overflow");
await page.screenshot({path:"qa-atlas-desktop.jpg",type:"jpeg",quality:78,fullPage:true});
await page.locator('[data-graph-node="honeyshield"]').click();
if(!(await page.locator("[data-inspector-title]").innerText()).includes("HoneyShield"))throw Error("Graph node interaction failed");
if(!(await page.locator("[data-inspector-link]").getAttribute("href")).includes("honeyshield"))throw Error("Graph case study link failed");
if((await page.locator("[data-inspector-relations] li").count())<1)throw Error("Relations not documented in inspector");
if(!(await page.locator("[data-inspector-kind]").innerText()).includes("PROJET"))throw Error("Node category unexplained");
await page.locator('[data-map-filter="project"]').click();
if((await page.locator("[data-map-stage]").getAttribute("data-filter"))!=="project")throw Error("Filter failed");
if(await page.locator('[data-graph-node="threat-1"]').isVisible())throw Error("Project filter did not actually hide scenario nodes");
if(await page.locator('[data-graph-node="threat-1"]').getAttribute("tabindex")!=="-1")throw Error("Filtered scenario remains in keyboard tab order");
await page.locator('[data-project-index="2"]').click();
if(!(await page.locator("[data-case-title]").innerText()).includes("Lumina Academy"))throw Error("Project panel not reactive");
if(!(await page.locator("[data-inspector-title]").innerText()).includes("Lumina Academy"))throw Error("Project selector not synchronized with graph");
await page.locator('[data-signal-index="0"]').click();
if(!(await page.locator("#cc-signal-dialog").isVisible()))throw Error("Signal dialog failed");
if((await page.locator("[data-dialog-observables] li").count())<2)throw Error("Evidence checklist missing");
if((await page.locator("[data-dialog-steps] li").count())<3)throw Error("Investigation procedure missing");
if(await page.locator(".cc-floating-card").count())throw Error("Decorative map overlays remain");
if(await page.locator(".cc-case-art").count())throw Error("Fake graph art remains");
if(await page.locator(".cc-metric-grid").count())throw Error("Redundant KPI cards remain");
if(!(await page.locator("[data-dialog-project]").getAttribute("href")).includes("cybermind"))throw Error("Scenario not linked to project");
await page.locator("[data-dialog-close]").click();
await page.locator("[data-preferences-open]").click();
await page.locator('[data-pref="compact"]').check();
if(!(await page.locator("body").evaluate(el=>el.classList.contains("cc-compact"))))throw Error("Compact preference not applied");
await page.locator('[data-pref="glow"]').uncheck();
if(!(await page.locator("body").evaluate(el=>el.classList.contains("cc-glow-reduced"))))throw Error("Glow preference not applied");
await page.locator("[data-pref-reset]").click();
await page.locator("[data-preferences-close]").click();
await page.locator("#cc-search").fill("Honey");
if(await page.locator('[data-project-index="0"]').isVisible())throw Error("Search filtering failed");
await page.locator("#cc-search").fill("");
await page.locator('[data-map-filter="all"]').click();
await page.locator('[data-graph-node="threat-2"]').click();
await page.locator("[data-inspector-scenario]").click();
if(!(await page.locator("[data-dialog-title]").innerText()).includes("IDOR"))throw Error("Graph scenario link not connected");
await page.locator("[data-dialog-locate]").click();
if(!(await page.locator("[data-inspector-title]").innerText()).includes("Access control"))throw Error("Scenario locate action not functional");
await page.locator("[data-inspector-close]").click();
await page.goto(base+"projects/",{waitUntil:"domcontentloaded"});
if(!(await page.title()).includes("Projets"))throw Error("Project archive inaccessible");
await page.goto(base+"atlas/",{waitUntil:"networkidle"});
await page.setViewportSize({width:390,height:844});
await page.waitForTimeout(550);
await page.screenshot({path:"qa-atlas-mobile.jpg",type:"jpeg",quality:82,fullPage:true});
const overflowMobile=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+4);
if(overflowMobile)throw Error("Mobile horizontal overflow");
await page.locator("[data-sidebar-toggle]").click();
if(!(await page.locator(".cc-sidebar").isVisible()))throw Error("Mobile menu missing");
if(!(await page.locator("body").evaluate(el=>el.classList.contains("cc-sidebar-open"))))throw Error("Mobile drawer did not open");
await page.locator("[data-sidebar-close]").first().click();
if(await page.locator("body").evaluate(el=>el.classList.contains("cc-sidebar-open")))throw Error("Mobile drawer did not close");

// Responsive matrix: page, graph and navigation must fit without document overflow.
const viewports=[320,360,375,390,430,600,650,768,820,1024,1280,1440,1920,2560];
const failures=[];
for(const width of viewports){
  await page.setViewportSize({width,height:Math.max(740,Math.round(width*.73))});
  await page.waitForTimeout(65);
  const state=await page.evaluate(()=>{
    const app=document.querySelector(".cc-app");
    const pageWidth=document.documentElement.scrollWidth;
    const viewport=document.documentElement.clientWidth;
    const graph=document.querySelector("[data-map-viewport]");
    const graphLayer=document.querySelector("[data-graph-layer]");
    const legend=document.querySelector(".cc-map-legend");
    const header=document.querySelector(".cc-topbar");
    return {
      pageWidth,viewport,graphScrollable:!!graph&&graph.scrollWidth>graph.clientWidth+15,
      graphW:graph?.clientWidth,graphContentW:graphLayer?.getBoundingClientRect().width,
      legendInside:!legend||legend.getBoundingClientRect().right<=innerWidth+3,
      headerInside:!header||header.getBoundingClientRect().right<=innerWidth+3,
      appWidth:app?.getBoundingClientRect().width
    };
  });
  if(state.pageWidth>width+3)failures.push(width+": document overflow "+JSON.stringify(state));
  if(!state.legendInside||!state.headerInside)failures.push(width+": misplaced chrome "+JSON.stringify(state));
  if(width<=430&&!state.graphScrollable)failures.push(width+": map not pannable "+JSON.stringify(state));
  if(width===320||width===768||width===1440||width===1920){
    await page.screenshot({path:"qa-"+width+".jpg",type:"jpeg",quality:80,fullPage:true});
  }
}
if(failures.length)throw Error("Responsive failures:\n"+failures.join("\n"));
await page.setViewportSize({width:390,height:844});
await page.locator('[data-graph-node="honeyshield"]').evaluate(el=>el.scrollIntoView({block:"center",inline:"center"}));
await page.locator('[data-graph-node="honeyshield"]').click({timeout:5000});
if(!(await page.locator("[data-inspector-title]").innerText()).includes("HoneyShield"))throw Error("Mobile node selection inaccessible");
await page.goto(base+"projects/",{waitUntil:"domcontentloaded"});
const subOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3);
if(subOverflow)throw Error("Projects archive overflows at 390px");
await page.goto(base+"projects/cybermind-x/",{waitUntil:"domcontentloaded"});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3))throw Error("Case study overflows at 390px");
await page.goto(base+"notes/",{waitUntil:"domcontentloaded"});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3))throw Error("Notes archive overflows at 390px");
await page.goto(base+"journal/",{waitUntil:"domcontentloaded"});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3))throw Error("Journal archive overflows at 390px");
if(errors.length)throw Error("JS errors: "+errors.join("; "));
console.log("VISUAL QA OK",JSON.stringify({nodeCount:nodes,viewports,errors:errors.length,archive:true,mapPan:true,interactions:"graph/filter/project/search/dialog/preferences/mobile navigation"}));
await browser.close();
