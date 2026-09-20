/* Run against a locally served copy. Requires Playwright in the developer environment. */
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const artifactDir=path.resolve('output/playwright');
fs.mkdirSync(artifactDir,{recursive:true});
async function checkDesign(page) {
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 function check(ok,label){if(!ok)throw new Error(label);}
 await page.reload();
 await page.clock.setFixedTime(new Date('2026-09-19T11:00:00Z'));
 await page.evaluate(()=>{plan={w1:[{j:'Sa',d:'19.09',y:2026,s:'G204',h0:'',h1:''},{j:'So',d:'20.09',y:2026,s:'F',h0:'',h1:''},{j:'Di',d:'22.09',y:2026,s:'B125',h0:'',h1:''}],w2:[]};go('dash');});
 check(await page.locator('#astra-status').textContent()==='IM DIENST','active service');
 check(await page.locator('#astra-countdown').textContent()==='2:21:00','countdown');
 check(await page.locator('#astra-next-code').textContent()==='B125','next service');
 const before=await page.evaluate(()=>JSON.stringify(localStorage));
 const sizes=[320,390,768,1440];
 for(const width of sizes){
   await page.setViewportSize({width,height:width>=700?1000:844});
   await page.waitForTimeout(1200);
   const fits=await page.evaluate(()=>{const s=document.querySelector('#s-dash .scroll');return s.scrollWidth<=s.clientWidth&&document.documentElement.scrollWidth<=innerWidth;});
   check(fits,'overflow at '+width);
   if(width===390||width===1440)await page.waitForTimeout(400); await page.screenshot({path:artifactDir+'/'+(width===390?'mobile':'desktop')+'-final.png'});
 }
 check(await page.evaluate(()=>JSON.stringify(localStorage))===before,'render must not mutate storage');
 await page.locator('#astra-details').click();check(await page.locator('#s-det').evaluate(e=>e.classList.contains('on')),'open service');
 check(await page.locator('#det-title').textContent()==='G204','correct service detail');
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(400); await page.screenshot({path:artifactDir+'/service-final.png'});
 await page.locator('#dtab-fk').click();check((await page.locator('#det-body').textContent()).length>100,'driver card content');
 await page.locator('#s-det .nb').nth(1).click();check(await page.locator('#s-plan').evaluate(e=>e.classList.contains('on')),'planning navigation');
 await page.waitForTimeout(400); await page.screenshot({path:artifactDir+'/planning-final.png'});
 await page.locator('#wk-grid .day-row[role=button]').first().focus();await page.keyboard.press('Enter');
 check(await page.locator('#s-det').evaluate(e=>e.classList.contains('on')),'keyboard opens duty');
 await page.locator('#s-det .nb').first().click();
 await page.locator('#astra-next').click();check(await page.locator('#det-title').textContent()==='B125','next duty details');
 await page.locator('#s-det .nb').first().click();
 await page.locator('#astra-theme').click();check(await page.locator('body').evaluate(e=>e.classList.contains('light')),'light theme');
 await page.waitForTimeout(400); await page.screenshot({path:artifactDir+'/light-final.png'});
 await page.locator('#astra-theme').click();
 await page.clock.setFixedTime(new Date('2026-09-20T10:00:00Z'));await page.evaluate(()=>astraDesignRender());
 check(await page.locator('#astra-code').textContent()==='Frei','free day');
 await page.evaluate(()=>{plan={w1:[],w2:[]};go('dash');});
 check(await page.locator('#astra-status').textContent()==='KEIN EINTRAG','empty plan');
 await page.locator('#astra-details').click();check(await page.locator('#s-edit').evaluate(e=>e.classList.contains('on')),'empty plan edit action');
 await page.evaluate(()=>{plan={w1:[{d:'19.09',y:2026,j:'Sa',s:'CUSTOM',h0:'23:00',h1:'02:00'}],w2:[]};go('dash');});
 await page.clock.setFixedTime(new Date('2026-09-19T23:00:00Z'));await page.evaluate(()=>astraDesignRender());
 check(await page.locator('#astra-code').textContent()==='CUSTOM','overnight selected from yesterday');
 check(await page.locator('#astra-countdown').textContent()==='1:00:00','overnight countdown');
 check(await page.locator('#astra-break-time').textContent()==='Keine Pausendaten','no invented breaks');
 await page.evaluate(()=>{plan={w1:[{d:'20.09',y:2026,j:'So',s:'CUSTOM',h0:'',h1:''}],w2:[]};go('dash');});
 check(await page.locator('#astra-status').textContent()==='GEPLANT','missing times');
 check(await page.locator('#astra-countdown').textContent()==='—','missing times no bogus countdown');
 check(errors.length===0,'runtime errors: '+errors.join(', '));
 return {passed:['responsive 320/390/768/1440','countdown','service and next duty','driver card','planning keyboard','light theme','free day','empty state and edit','overnight duty','missing times','no invented pauses','storage unchanged'],errors};
}
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH||undefined,args:['--no-sandbox']});
 try {
 const context=await browser.newContext({viewport:{width:390,height:844},locale:'de-DE',timezoneId:'Europe/Berlin',serviceWorkers:'block'});
 const page=await context.newPage();
 await page.goto(process.env.HCR_TEST_URL||'http://127.0.0.1:8791/',{waitUntil:'domcontentloaded'});
 console.log(JSON.stringify(await checkDesign(page),null,2));
 } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});

