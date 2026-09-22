/* Astra reference design. Presentation reads the existing plan; it never writes it. */
(function () {
  'use strict';
  var paths = {
    home:'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
    calendar:'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 10h2m4 0h2m-8 4h2',
    bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
    grid:'M3 3h7v7H3Zm11 0h7v7h-7ZM3 14h7v7H3Zm11 0h7v7h-7Z',
    coffee:'M4 9h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5Zm13 1h2a3 3 0 0 1 0 6h-2M7 2v3m5-3v3',
    route:'M5 18a3 3 0 1 0 0 .1Zm14-12a3 3 0 1 0 0 .1ZM5 15V7a3 3 0 0 1 3-3h3m8 5v8a3 3 0 0 1-3 3h-3',
    arrow:'m9 5 7 7-7 7',
    sun:'M12 3V1m0 22v-2M3 12H1m22 0h-2M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
    search:'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0'
  };
  function icon(name){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+'<path d="'+paths[name]+'"/></svg>';}
  var screen=document.getElementById('s-dash');
  var scroll=screen.querySelector('.scroll');
  var oldHeader=screen.querySelector('.hdr');
  oldHeader.hidden=true;
  oldHeader.classList.add('astra-legacy');
  var legacy=document.createElement('div');legacy.hidden=true;legacy.className='astra-legacy';
  while(scroll.firstChild)legacy.appendChild(scroll.firstChild);
  scroll.classList.add('astra-scroll');
  scroll.innerHTML='<section class="astra-hero" aria-label="Willkommen">'+
    '<header class="astra-brand-row"><a class="astra-brand" href="#" aria-label="HCR Astra 6 – Übersicht"><span class="astra-logo">H</span><span><strong>HCR <small>ASTRA 6</small></strong><em>FÜR FAHRER. FÜR MORGEN.</em></span></a><button class="astra-icon-button" id="astra-theme" aria-label="Farbschema wechseln">'+icon('sun')+'</button></header>'+
    '<div class="astra-date" id="astra-date"></div><div class="astra-welcome"><p id="astra-greeting">Guten Tag,</p><h1>gute Fahrt.</h1><span>Sicher fahren. Gut ankommen.</span></div><div class="astra-motto">MENSCHEN<br><b>VERBINDEN.</b><br>REGION<br><b>BEWEGEN.</b></div></section>'+
    '<div class="astra-content"><section class="astra-duty" aria-labelledby="astra-duty-label"><div class="astra-duty-heading"><h2 id="astra-duty-label">AKTUELLER DIENST</h2><span id="astra-status" class="astra-status"></span></div>'+
    '<div class="astra-duty-main"><div class="astra-duty-info"><div id="astra-code"></div><div id="astra-times"></div><div id="astra-service-meta"></div></div><div class="astra-ring" id="astra-ring" role="img"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="astra-ring-track" cx="60" cy="60" r="53"/><circle id="astra-ring-progress" cx="60" cy="60" r="53" pathLength="100"/></svg><div class="astra-ring-copy"><span id="astra-ring-top">NOCH</span><strong id="astra-countdown">—</strong><span id="astra-ring-bottom">BIS DIENSTENDE</span></div></div></div>'+
    '<div class="astra-progress" id="astra-progress" role="progressbar" aria-label="Dienstfortschritt" aria-valuemin="0" aria-valuemax="100"><span id="astra-progress-fill"></span></div><div class="astra-progress-labels"><span id="astra-start"></span><span id="astra-percent"></span><span id="astra-end"></span></div>'+
    '<div class="astra-duty-footer"><div class="astra-route">'+icon('route')+'<div><span>Dienststrecke</span><strong id="astra-route"></strong></div></div><button class="astra-detail-button" id="astra-details">Dienst ansehen '+icon('arrow')+'</button></div></section>'+
    '<div class="astra-secondary"><section class="astra-small-card astra-break">'+icon('coffee')+'<div><h2 id="astra-break-title">Nächste Pause</h2><strong id="astra-break-time">Keine Pausendaten</strong><p id="astra-break-description">Die genauen Zeiten findest du in deiner Fahrerkarte.</p></div></section><button class="astra-small-card astra-next" id="astra-next">'+icon('calendar')+'<div><h2>NÄCHSTER DIENST</h2><strong id="astra-next-code">Kein Eintrag</strong><p id="astra-next-date"></p><p id="astra-next-time"></p></div>'+icon('arrow')+'</button></div>'+
    '<aside class="astra-quote"><span aria-hidden="true">“</span><p>Jeder Kilometer<br>bringt Menschen weiter.</p><div class="astra-quote-line"></div><small>HCR<br>ASTRA 6</small></aside>'+
    '<details class="astra-week"><summary>Deine Woche <span>Dienstplan im Überblick</span></summary><div id="astra-week-content"></div></details></div>';
  var week=scroll.querySelector('#astra-week-content');
  var days=legacy.querySelector('#ov-days-list');
  var weekNav=days.previousElementSibling;
  var total=days.nextElementSibling;
  week.appendChild(weekNav);week.appendChild(days);week.appendChild(total);
  screen.appendChild(legacy);
  document.getElementById('astra-theme').onclick=function(){toggleTheme();};
  scroll.querySelector('.astra-brand').onclick=function(e){e.preventDefault();scroll.scrollTo({top:0,behavior:'smooth'});};
  var navIcons=['home','calendar','bell','grid'];
  document.querySelectorAll('.nav').forEach(function(nav){nav.querySelectorAll('.nb').forEach(function(button,i){var ic=button.querySelector('.ic');if(ic&&navIcons[i])ic.innerHTML=icon(navIcons[i]);if(i===3){button.querySelector('.lb').textContent='Mehr';}});});
  function put(id,value){document.getElementById(id).textContent=value;}
  function isDuty(entry){return entry&&entry.s&&!/^(F|KRANK|Urlaub|AZK|MF)$/i.test(entry.s);}
  function entryDate(entry,now){
    var bits=(entry.d||'').split('.');
    return new Date(Number(entry.y)||(bits[2]?Number(bits[2]):now.getFullYear()),Number(bits[1])-1,Number(bits[0]));
  }
  function clockDate(date,time){
    if(!/^\d{1,2}:\d{2}$/.test(time||''))return null;
    var p=time.split(':');if(+p[0]>23||+p[1]>59)return null;
    return new Date(date.getFullYear(),date.getMonth(),date.getDate(),+p[0],+p[1]);
  }
  function duty(entry,now){
    var svc=getSvc(entry.s),date=entryDate(entry,now);
    var bounds=getDutyTimes(svc,entry);
    var startText=bounds.start,endText=bounds.end;
    var start=clockDate(date,startText),end=clockDate(date,endText);
    if(start&&end&&end<=start)end.setDate(end.getDate()+1);
    return {entry:entry,svc:svc,date:date,start:start,end:end,startText:startText,endText:endText};
  }
  function countdown(ms){var seconds=Math.max(0,Math.floor(ms/1000));return Math.floor(seconds/3600)+':'+pad(Math.floor(seconds%3600/60))+':'+pad(seconds%60);}
  function render(){
    var now=new Date(),all=getPlanAll(),midnight=new Date(now.getFullYear(),now.getMonth(),now.getDate());
    var today=all.find(function(e){return +entryDate(e,now)===+midnight;});
    var duties=all.filter(isDuty).map(function(e){return duty(e,now);}).sort(function(a,b){return (a.start||a.date)-(b.start||b.date);});
    var current=duties.find(function(d){return d.start&&d.end&&d.start<=now&&now<d.end;}) || (isDuty(today)?duty(today,now):null);
    var next=duties.find(function(d){return (d.start||d.date)>now&&(!current||d.entry!==current.entry);});
    put('astra-date',now.toLocaleDateString('de-DE',{weekday:'long',day:'numeric',month:'short',year:'numeric'}));
    put('astra-greeting',now.getHours()<11?'Guten Morgen,':now.getHours()<18?'Guten Tag,':'Guten Abend,');
    var status='KEIN EINTRAG',code='Dein Tag',times='Noch kein Dienstplan',meta='Trage deinen Dienst ein, um loszulegen.',pct=0,remaining='—',top='DEIN TAG',bottom='GUT GEPLANT',route='Noch keine Dienstdaten',mode='empty';
    put('astra-start','');put('astra-end','');put('astra-percent','Plan hinzufügen');
    put('astra-break-title','Nächste Pause');put('astra-break-time','Keine Pausendaten');put('astra-break-description','Die genauen Zeiten findest du in deiner Fahrerkarte.');
    if(current){
      var svc=current.svc;code=current.entry.s;times=(current.startText||'—')+' → '+(current.endText||'—');
      meta=svc&&svc.lg?'Linie '+svc.lg:'Linie nicht hinterlegt';
      if(current.start&&current.end){
        var minutes=Math.round((current.end-current.start)/60000);meta+=' · '+Math.floor(minutes/60)+'h '+pad(minutes%60)+'min';
        pct=Math.max(0,Math.min(100,(now-current.start)/(current.end-current.start)*100));
        status=now<current.start?'VOR DIENST':now>=current.end?'BEENDET':'IM DIENST';mode=now>=current.end?'done':now<current.start?'upcoming':'active';
        remaining=now>=current.end?'✓':countdown((now<current.start?current.start:current.end)-now);
        top=now>=current.end?'GUT GEFAHREN':'NOCH';bottom=now<current.start?'BIS DIENSTBEGINN':now>=current.end?'FEIERABEND':'BIS DIENSTENDE';
        put('astra-start',current.startText);put('astra-end',current.endText);put('astra-percent',Math.floor(pct)+' % geschafft');
      }else{status='GEPLANT';remaining='—';top='ZEITEN';bottom='NICHT HINTERLEGT';put('astra-percent','Zeiten ergänzen');}
      route=svc&&svc.bs&&svc.be?svc.bs+' → '+svc.be:'Siehe Fahrerkarte';
      // Only explicit service parts are reliable pause data. genParts contains estimates.
      var breaks=(svc&&Array.isArray(svc.parts)?svc.parts:[]).filter(function(p){return p.t==='pau';}).map(function(p){
        var begin=clockDate(current.date,p.h0),end=clockDate(current.date,p.h1);
        if(begin&&current.start&&begin<current.start)begin.setDate(begin.getDate()+1);
        if(end&&begin&&end<=begin)end.setDate(end.getDate()+1);
        return {part:p,start:begin,end:end};
      }).filter(function(p){return p.start&&p.end&&p.end>now;}).sort(function(a,b){return a.start-b.start;});
      if(breaks.length){var pause=breaks[0],running=pause.start<=now;put('astra-break-title',running?'Aktuelle Pause':'Nächste Pause');put('astra-break-time',pause.part.h0+' – '+pause.part.h1);put('astra-break-description',(running?'Noch ':'In ')+countdown((running?pause.end:pause.start)-now));if(running){status='IN PAUSE';mode='pause';}}
    }else if(today&&today.s){
      status=today.s==='F'?'DIENSTFREI':today.s.toUpperCase();code=today.s==='F'?'Frei':today.s;times='Zeit für dich.';meta='Heute ist kein Fahrdienst eingetragen.';top='DURCHATMEN';bottom='GUTE ERHOLUNG';route='Kein Fahrdienst heute';mode='free';put('astra-percent','Dein freier Tag');
    }
    put('astra-code',code);put('astra-times',times);put('astra-service-meta',meta);put('astra-status',status);put('astra-countdown',remaining);put('astra-ring-top',top);put('astra-ring-bottom',bottom);put('astra-route',route);
    document.querySelector('.astra-duty').dataset.state=mode;
    document.getElementById('astra-ring-progress').style.strokeDasharray=pct+' 100';
    document.getElementById('astra-ring').setAttribute('aria-label',status+(remaining==='—'?'':': '+remaining)+' · '+Math.floor(pct)+' Prozent');
    document.getElementById('astra-progress-fill').style.width=pct+'%';document.getElementById('astra-progress').setAttribute('aria-valuenow',Math.floor(pct));
    var details=document.getElementById('astra-details');details.innerHTML=(current?'Dienst ansehen':'Plan bearbeiten')+icon('arrow');details.onclick=function(){if(current){curDet=current.entry.s;go('det');}else go('edit');};
    put('astra-next-code',next?next.entry.s:'Plan ergänzen');put('astra-next-date',next?next.date.toLocaleDateString('de-DE',{weekday:'short',day:'numeric',month:'short'}):'Kein weiterer Dienst');put('astra-next-time',next?(next.startText||'—')+' → '+(next.endText||'—'):'Dienstplan öffnen');
    document.getElementById('astra-next').onclick=function(){if(next){curDet=next.entry.s;go('det');}else go('edit');};
  }
  // Keep the existing planning and driver-card workflows, with the same visual language.
  var oldPlan=window.renderPlan;
  window.renderPlan=function(){
    oldPlan();
    document.querySelectorAll('#wk-grid .day-row[onclick]').forEach(function(row){
      row.setAttribute('role','button');row.tabIndex=0;
      row.onkeydown=function(event){if(event.key==='Enter'||event.key===' '){event.preventDefault();row.click();}};
    });
    var footer=document.createElement('div');footer.className='astra-plan-footer';
    footer.innerHTML='<strong>HCR</strong><span>Gemeinsam unterwegs.</span>';
    document.getElementById('wk-grid').appendChild(footer);
  };
  document.getElementById('dtab-fk').textContent='Fahrerkarte';
  document.getElementById('det-inp').setAttribute('aria-label','Dienstnummer suchen');
  document.querySelector('#s-det .hdr button').setAttribute('aria-label','Zur Übersicht');
  var oldRefresh=window.refreshDash;
  window.refreshDash=function(){oldRefresh();render();};
  render();
  setInterval(function(){if(screen.classList.contains('on'))render();},1000);
  document.addEventListener('visibilitychange',function(){if(!document.hidden)render();});
  window.astraDesignRender=render;
})();
