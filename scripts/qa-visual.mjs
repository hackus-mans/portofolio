import {chromium} from "playwright-core";
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||"/usr/bin/google-chrome",args:["--no-sandbox","--disable-dev-shm-usage","--disable-gpu"]});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const root="http://127.0.0.1:4173/portofolio/";
const errors=[];page.on("pageerror",e=>errors.push(e.message));
const check=(value,msg)=>{if(!value)throw Error(msg)};
await page.goto(root,{waitUntil:"networkidle"});
await page.locator("#hero-title").waitFor();
check((await page.locator("#hero-title").innerText()).includes("NAKORE"),"Homepage identity missing");
check(await page.locator(".ed-terminal").count()===1,"Hero terminal missing");
check(await page.locator(".ed-honor-card").count()===3,"CTF results missing");
check(await page.locator(".ed-project-card").count()===5,"Projects not preserved");
check(await page.locator(".ed-approach-card").count()===4,"Learning workflow missing");
check(await page.locator(".ed-skill-card").count()===4,"Skills missing");
check(await page.locator(".ed-publication-card").count()===0,"Expected empty writeups and notes");
check(await page.locator(".ed-empty-card").count()===1,"Empty Journal message missing");
check(await page.locator(".ed-desktop-links a").count()===7,"Navigation links missing");
await page.screenshot({path:"qa-desktop.jpg",fullPage:true,type:"jpeg",quality:80});
const widths=[320,360,375,390,430,600,650,768,820,1024,1280,1440,1920,2560];
const failures=[];
for(const width of widths){
 await page.setViewportSize({width,height:Math.max(760,Math.round(width*.7))});
 await page.waitForTimeout(80);
 const info=await page.evaluate(()=>({
   full:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth,
   header:document.querySelector(".ed-header")?.getBoundingClientRect().right,
   terminal:document.querySelector(".ed-terminal")?.getBoundingClientRect().width
 }));
 if(info.full>width+3|| (info.header||0)>width+3)failures.push(width+"px: "+JSON.stringify(info));
 if((info.terminal||0)<195)failures.push(width+"px: terminal too narrow "+JSON.stringify(info));
 if([320,390,768,1440,1920].includes(width))await page.screenshot({path:"qa-"+width+".jpg",fullPage:true,type:"jpeg",quality:78});
}
check(failures.length===0,"Homepage overflow:\n"+failures.join("\n"));
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:"qa-mobile.jpg",fullPage:true,type:"jpeg",quality:82});
check(await page.locator(".ed-mobile-menu summary").isVisible(),"Mobile menu absent");
await page.locator(".ed-mobile-menu summary").click();
check(await page.locator(".ed-mobile-panel").isVisible(),"Mobile menu did not open");
await page.locator('.ed-mobile-panel a[href$="contact/"]').click();
check(page.url().includes("/contact/"),"Mobile contact link broken");
for(const path of ["projects/","projects/cybermind-x/","projects/honeyshield/","ctf/","certifications/","contact/","writeups/","labs/","notes/","journal/","about/","roadmap/"]){
 await page.goto(root+path,{waitUntil:"domcontentloaded"});
 check(await page.locator(".ed-header").count()===1,"Missing shared navigation: "+path);
 check(await page.locator(".ed-footer").count()===1,"Missing shared footer: "+path);
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+3);
 if(overflow)failures.push("Inner route overflow: "+path);
}
check(failures.length===0,failures.join("\n"));
check(errors.length===0,"JavaScript error(s): "+errors.join("; "));
console.log("EDITORIAL UI QA PASS",JSON.stringify({viewports:widths.length,pages:12,projects:5,results:3,errors:0}));
await browser.close();
