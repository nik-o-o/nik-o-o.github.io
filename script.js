/* Nikunj Pahwa portfolio. No dependencies. */
(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const reduceMQ=window.matchMedia('(prefers-reduced-motion: reduce)');
const EMAIL='nikunjpahwa2000@gmail.com';
const NS='http://www.w3.org/2000/svg';
const el=(tag,attrs,parent)=>{const n=document.createElementNS(NS,tag);for(const k in attrs)n.setAttribute(k,attrs[k]);if(parent)parent.appendChild(n);return n};
const track=(name,params)=>{try{if(typeof window.gtag==='function')window.gtag('event',name,params||{})}catch(e){}};
const esc0=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------------- toast + copy email ---------------- */
let toastT;
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2600)}
function copyEmail(){
  const done=()=>toast('Email copied: '+EMAIL);
  const fallback=()=>{const e=$('#emailText');if(!e){toast('Copy did not work here. The address is '+EMAIL);return}const r=document.createRange();r.selectNodeContents(e);const s=getSelection();s.removeAllRanges();s.addRange(r);e.scrollIntoView({block:'center'});toast('Email selected. Press Ctrl+C or ⌘C to copy it.')};
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(EMAIL).then(done,fallback)}else fallback()}catch(e){fallback()}
}
$$('[data-copy-email]').forEach(b=>b.addEventListener('click',()=>{copyEmail();track('contact_click',{method:'copy_email'})}));
document.addEventListener('click',e=>{const a=e.target.closest('a[href^="mailto:"]');if(a)track('contact_click',{method:'email'})});

/* ---------------- contact form ---------------- */
/* Messages go through Web3Forms, which emails them to the address its access key belongs to.
   The access key is not a secret: Web3Forms designs it to sit in public page code. */
(function contactForm(){
  const f=$('#msgForm');if(!f)return;
  const ENDPOINT='https://api.web3forms.com/submit';
  const ACCESS_KEY='ddaeb09f-533b-4ab4-8fb3-231d047e337e';
  const status=$('#msgStatus'),btn=$('#msgSend');
  const T0=Date.now();
  const say=(t,kind)=>{status.textContent=t;status.dataset.kind=kind||''};
  f.addEventListener('submit',async e=>{
    e.preventDefault();
    const d={name:f.elements.name.value.trim(),email:f.elements.email.value.trim(),message:f.elements.message.value.trim()};
    if(!d.name||!d.email||!d.message){say('Fill in your name, email and a message first.','bad');return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)){say('Check your email address. It needs to look like name@example.com.','bad');f.elements.email.focus();return}
    /* Invisible traps: a hidden field only bots fill in, and a form completed in under three seconds.
       Both look like success to the sender and send nothing. */
    if(f.elements.website.value||Date.now()-T0<3000){f.reset();say('Message sent. I will reply to the address you gave.','ok');return}
    const openMail=()=>{window.location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('Message from '+d.name+', via your portfolio')+'&body='+encodeURIComponent(d.message+'\n\n'+d.name+'\n'+d.email)};
    btn.disabled=true;say('Sending your message.');
    try{
      if(location.protocol==='file:')throw new Error('local file');
      const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify({access_key:ACCESS_KEY,subject:'Portfolio message from '+d.name,from_name:'nik-o-o.github.io',name:d.name,email:d.email,message:d.message})});
      const j=await r.json().catch(()=>({}));
      if(!r.ok||j.success!==true)throw new Error(j.message||'not accepted');
      f.reset();say('Message sent. I will reply to the address you gave.','ok');track('generate_lead',{method:'contact_form'});
    }catch(err){
      say('This page could not send the message itself, so your email app is opening with it filled in.','bad');openMail();
    }finally{btn.disabled=false}
  });
})();

/* ---------------- top bar ---------------- */
const topBar=$('.top');
const onScroll=()=>topBar.classList.toggle('is-stuck',window.scrollY>8);
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------------- network map ---------------- */
(function networkMap(){
  const svg=$('#map');if(!svg)return;
  const LINES={
    eng:{name:'Blue Line',pts:[[90,380],[250,380],[330,300],[800,300]]},
    ml:{name:'Magenta Line',pts:[[80,130],[380,130],[460,210],[460,360],[520,420],[600,420],[810,210],[1230,210]]},
    ana:{name:'Yellow Line',pts:[[230,380],[230,460],[290,520],[820,520],[880,460],[880,150],[940,90],[1220,90]]}
  };
  const X='experience.html',P='projects.html',A='about.html';
  const S=[
    {id:'pratham',x:80,y:130,lines:['ml'],name:'Pratham',sub:'2021',lab:[80,96,'middle'],
      title:'Pratham, EdTech internship',meta:'ML and AI intern, February to April 2021',txt:'A remote internship on the ML and AI team during the pandemic, finished with a certificate of excellence. The Magenta Line starts here.',href:X+'#x-pratham',cta:'See this internship'},
    {id:'btech',x:90,y:380,lines:['eng'],name:'B.Tech, CSE',hi:'बी.टेक',sub:'2023',lab:[90,430,'middle'],
      title:'B.Tech, Computer Science and Engineering',meta:'Inderprastha Engineering College, 2023',txt:'First division, CGPA 8.45 out of 10. The Blue Line starts here.',href:A+'#education',cta:'See education'},
    {id:'omdena',x:195,y:130,lines:['ml'],name:'Omdena',sub:'2021',lab:[195,96,'middle'],
      title:'Omdena, mapping the Datasphere',meta:'Junior ML Engineer, 2021',txt:'A two-month AI challenge for the Internet and Jurisdiction Policy Network: an NLP pipeline that turns climate text into a knowledge graph with spaCy, BERT and Neo4j.',href:X+'#x-omdena',cta:'See this internship'},
    {id:'dtdl',x:230,y:380,lines:['eng','ana'],name:'Deutsche Telekom',hi:'डॉयचे टेलीकॉम',sub:'Digital Labs, 2022–23',lab:[246,334,'end'],
      title:'Deutsche Telekom Digital Labs',meta:'Data Engineering Intern, 2022 to 2023',txt:'Built a campaign analytics pipeline from NiFi and Kafka through to Redshift and Tableau. Warehouse retrieval got 20% faster and Airflow failures fell 25%.',href:X+'#x-dt',cta:'See this internship'},
    {id:'verify',x:310,y:130,lines:['ml'],name:'Verify News',sub:'2nd place, 2021',lab:[310,96,'middle'],
      title:'Verify News',meta:'Hackathon project, second place',txt:'A Django app that flags likely fake news with logistic regression, an MLP and an SVC. Second place at IPEC Techathlon, an inter-college hackathon, in June 2021.',href:A+'#education',cta:'See awards'},
    {id:'tableau',x:400,y:520,lines:['ana'],name:'Tableau dashboards',lab:[400,552,'middle'],
      title:'Tableau dashboards',meta:'At Deutsche Telekom Digital Labs',txt:'Real-time dashboards that let business stakeholders check campaign performance for themselves. The Yellow Line starts here.',href:X+'#x-dt',cta:'See this internship'},
    {id:'infosys',x:460,y:300,lines:['eng','ml'],name:'Infosys for Microsoft',hi:'इन्फोसिस',sub:'2023–25',lab:[482,260,'start'],
      title:'Infosys, for Microsoft',meta:'Specialist Programmer, Big Data, 2023 to 2025',txt:'Built a PySpark and Azure Synapse data-quality framework that cut manual validation by 75%, and tuned feature pipelines for ML training, with models versioned in MLflow.',href:X+'#x-inf',cta:'See this role'},
    {id:'rag',x:560,y:420,lines:['ml'],name:'Local RAG',lab:[560,452,'middle'],
      title:'Local RAG over scanned German PDFs',meta:'Personal project',txt:'Question answering that never leaves the laptop: OCR, embeddings, hybrid search in OpenSearch and a local LLM through Ollama.',href:P+'#p-rag',cta:'See this project'},
    {id:'rec',x:590,y:300,lines:['eng'],name:'Movie recommender',lab:[590,332,'middle'],
      title:'PySpark movie recommender',meta:'Personal project',txt:'Item-item collaborative filtering on MovieLens, written for Spark: Pearson similarity with a genre boost and quality-filtered ranking.',href:P+'#p-rec',cta:'See this project'},
    {id:'dp600',x:600,y:520,lines:['ana'],name:'DP-600',sub:'Fabric Analytics Engineer',lab:[600,552,'middle'],
      title:'DP-600',meta:'Microsoft Certified: Fabric Analytics Engineer',txt:'Earned in October 2024. One of eight certifications, alongside Salesforce AI Associate and a Kubernetes administrator certificate from Infosys.',href:A+'#education',cta:'See certifications'},
    {id:'bn',x:720,y:300,lines:['eng','ml'],name:'BusinessNext',hi:'बिज़नेसनेक्स्ट',sub:'Noida, 2025 to now',lab:[744,352,'start'],
      title:'BusinessNext',meta:'Data Engineer, October 2025 to now',txt:'I own the PySpark dataflow engine that moves CRM data for banks and insurers. Two 20× speed-ups so far, plus an LLM agent that turns plain English into dataflows.',href:X+'#x-bn',cta:'See this role'},
    {id:'isb',x:880,y:210,lines:['ml','ana'],name:'ISB AMPBA',hi:'आईएसबी',sub:'Expected 2027',lab:[862,168,'end'],
      title:'ISB, Hyderabad',meta:'Business analytics programme, expected 2027',txt:'The Advanced Management Programme in Business Analytics, alongside full-time work. Every station to the right of this one is a project from it.',href:A+'#education',cta:'See education'},
    {id:'wim',x:980,y:90,lines:['ana'],name:'Wimbledon',lab:[988,72,'start',-38],
      title:'Winning the Next Point',meta:'ISB advanced statistics',txt:'A model of who wins the next point at Wimbledon, using only what is known before the serve. Trained on 326,000 service points.',href:P+'#p-wim',cta:'See this project'},
    {id:'ser',x:990,y:210,lines:['ml'],name:'Speech emotion',lab:[990,242,'middle'],
      title:'Hearing the Feeling',meta:'ISB foundation project',txt:'A speech model that flags the upset moments in a sales call. 0.79 macro-F1 on unseen speakers, leaving 8% of segments for a person to review.',href:P+'#p-ser',cta:'See this project'},
    {id:'coke',x:1060,y:90,lines:['ana'],name:'Coke vs Pepsi',lab:[1068,72,'start',-38],
      title:'Price cuts need a sign',meta:'ISB pricing and demand analytics',txt:'Coke’s price elasticity goes from −2.81 to −4.30 when a discount carries a visible deal tag.',href:P+'#p-coke',cta:'See this project'},
    {id:'dl',x:1110,y:210,lines:['ml'],name:'Deep learning',lab:[1110,242,'middle'],
      title:'Four deep-learning studies',meta:'ISB deep learning',txt:'Backprop by hand, churn, spam and logos. On spam, a bag-of-words control beat three recurrent networks.',href:P+'#p-dl',cta:'See this project'},
    {id:'air',x:1140,y:90,lines:['ana'],name:'Air fares',lab:[1148,72,'start',-38],
      title:'Air fares: segment before you model',meta:'ISB supervised learning',txt:'An R² of 0.911 that fell to 0.035 inside Economy, and what rebuilding the model by segment fixed.',href:P+'#p-air',cta:'See this project'},
    {id:'assis',x:1220,y:90,lines:['ana'],name:'AssisTen',lab:[1228,72,'start',-38],
      title:'AssisTen',meta:'ISB digital and social media analytics',txt:'A live elder-care website I built, with analytics wired from first visit to booked home visit. Lighthouse performance went from 74 to 98.',href:P+'#p-assis',cta:'See this project'},
    {id:'nlpl',x:1230,y:210,lines:['ml'],name:'Report RAG',lab:[1230,242,'middle'],
      title:'Page-cited answers from an annual report',meta:'ISB NLP and LLMs',txt:'Retrieval for an assistant that names the page it used: 109 pages, 688 chunks, and citations that land on the right PDF page.',href:P+'#p-nlpl',cta:'See this project'},
    {id:'next',x:1220,y:300,lines:['eng'],name:'Next stop',hi:'अगला स्टेशन',lab:[1238,315,'start'],open:true,
      title:'Next stop',meta:'Under construction',txt:'Open to data engineering, ML engineering and data science roles. If your team needs someone who owns the data end to end, this is where the line goes.',href:'contact.html',cta:'Get in touch'}
  ];

  function rounded(pts,r){
    let d=`M${pts[0][0]},${pts[0][1]}`;
    for(let i=1;i<pts.length-1;i++){
      const p0=pts[i-1],p=pts[i],p1=pts[i+1];
      const a=Math.hypot(p[0]-p0[0],p[1]-p0[1]),b=Math.hypot(p1[0]-p[0],p1[1]-p[1]);
      const ra=Math.min(r,a/2),rb=Math.min(r,b/2);
      const ax=p[0]-(p[0]-p0[0])/a*ra,ay=p[1]-(p[1]-p0[1])/a*ra;
      const bx=p[0]+(p1[0]-p[0])/b*rb,by=p[1]+(p1[1]-p[1])/b*rb;
      d+=` L${ax.toFixed(1)},${ay.toFixed(1)} Q${p[0]},${p[1]} ${bx.toFixed(1)},${by.toFixed(1)}`;
    }
    const l=pts[pts.length-1];return d+` L${l[0]},${l[1]}`;
  }

  /* the Yamuna, as on any Delhi map. Noida, and so BusinessNext, sits on its east bank */
  const river=el('g',{'aria-hidden':'true',class:'river'},svg);
  el('path',{d:'M662,-20 C628,90 706,170 668,300 S 628,470 676,610',fill:'none',stroke:'var(--river)','stroke-width':34,'stroke-linecap':'round'},river);
  const rv=el('text',{x:690,y:36,class:'river-lbl'},river);rv.textContent='Yamuna';
  const rvh=el('text',{x:690,y:19,class:'river-lbl hi'},river);rvh.textContent='यमुना';

  /* legend */
  const key=el('g',{class:'key','aria-hidden':'true'},svg);
  [['eng','Blue Line','engineering'],['ml','Magenta Line','AI and ML'],['ana','Yellow Line','analytics']].forEach(([k,n,what],i)=>{
    const y=478+i*19;
    el('line',{x1:44,y1:y-4,x2:66,y2:y-4,stroke:`var(--${k})`,'stroke-width':7,'stroke-linecap':'round'},key);
    const t=el('text',{x:78,y:y},key);t.innerHTML=`<tspan class="k-n">${n}</tspan>, ${what}`;
  });
  el('circle',{cx:55,cy:534,r:5.5,fill:'#fff',stroke:'var(--ink)','stroke-width':3.2},key);
  el('text',{x:78,y:538},key).textContent='Station';
  el('circle',{cx:55,cy:553,r:7.5,fill:'#fff',stroke:'var(--ink)','stroke-width':4},key);
  el('text',{x:78,y:557},key).textContent='Interchange';
  el('line',{x1:44,y1:572,x2:66,y2:572,stroke:'var(--eng)','stroke-width':6,'stroke-dasharray':'1 11','stroke-linecap':'round'},key);
  el('text',{x:78,y:576},key).textContent='Under construction';

  /* lines */
  const gLines=el('g',{'aria-hidden':'true'},svg);
  const future=el('path',{class:'future',d:'M818,300 H1200'},gLines);
  const paths={};
  ['ana','ml','eng'].forEach(k=>{paths[k]=el('path',{class:'line '+k,d:rounded(LINES[k].pts,26),'data-line':k},gLines)});

  /* trains */
  const gTrains=el('g',{'aria-hidden':'true'},svg);
  const trains={};
  Object.keys(paths).forEach((k,i)=>{
    const g=el('g',{class:'train hide','data-line':k},gTrains);
    el('rect',{x:-17,y:-7.5,width:34,height:15,rx:7.5,stroke:'#fff','stroke-width':2},g);
    const lamp=el('circle',{class:'train-lamp',cx:10,cy:0,r:3},g);
    trains[k]={g,lamp,len:paths[k].getTotalLength(),s:0,dir:1,wait:600+i*900};
    trains[k].s=trains[k].len*[0.55,0.2,0.4][i];
  });

  /* stations */
  const gSt=el('g',{},svg);
  const nodes={};
  S.forEach(st=>{
    const x=st.lines.length>1;
    const g=el('g',{class:'st'+(x?' x':'')+(st.open?' open':''),tabindex:0,role:'button','data-id':st.id,
      'aria-label':st.title+'. '+st.meta+'.'},gSt);
    el('circle',{class:'halo',cx:st.x,cy:st.y,r:x?21:17},g);
    el('circle',{class:'dot',cx:st.x,cy:st.y,r:x?11:7.5},g);
    const [lx,ly,anchor,rot]=st.lab;
    if(st.hi){const h=el('text',{class:'lbl-hi',x:lx,y:ly-19,'text-anchor':anchor},g);h.textContent=st.hi}
    const t=el('text',{class:'lbl',x:lx,y:ly,'text-anchor':anchor},g);t.textContent=st.name;
    if(rot)t.setAttribute('transform',`rotate(${rot} ${lx} ${ly})`);
    if(st.sub){const s=el('text',{class:'sub',x:lx,y:ly+18,'text-anchor':anchor},g);s.textContent=st.sub}
    el('circle',{cx:st.x,cy:st.y,r:24,fill:'transparent'},g);
    nodes[st.id]=g;
  });

  /* station board */
  const board=$('#board');
  let current=null;
  function select(id){
    if(id===current)return;current=id;
    const st=S.find(s=>s.id===id);
    Object.keys(nodes).forEach(k=>nodes[k].classList.toggle('is-on',k===id));
    board.innerHTML=`<div><h3>${st.lines.map(l=>`<i class="bul ${l}" aria-hidden="true"></i>`).join('')}<span>${esc0(st.title)}</span></h3><p class="meta">${esc0(st.meta)}</p></div><p class="txt">${esc0(st.txt)}</p><a href="${st.href}">${esc0(st.cta)}</a>`;
  }
  gSt.addEventListener('click',e=>{const g=e.target.closest('.st');if(g){select(g.dataset.id);track('select_content',{content_type:'station',item_id:g.dataset.id})}});
  gSt.addEventListener('mouseover',e=>{const g=e.target.closest('.st');if(g)select(g.dataset.id)});
  gSt.addEventListener('focusin',e=>{const g=e.target.closest('.st');if(g)select(g.dataset.id)});
  gSt.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const g=e.target.closest('.st');if(!g)return;e.preventDefault();
    const a=$('a',board);select(g.dataset.id);if(a)$('a',board).focus();
  });
  select('bn');

  /* on narrow screens the map pans sideways: start centred on the current station */
  const scroller=$('#mapScroll');
  function centreOnNow(){
    const over=scroller.scrollWidth-scroller.clientWidth;if(over<=0)return;
    const bn=S.find(x=>x.id==='bn');
    scroller.scrollLeft=Math.max(0,Math.min(over,bn.x/1320*scroller.scrollWidth-scroller.clientWidth/2));
  }
  centreOnNow();

  /* line filter */
  let filter='all';
  function setFilter(k){
    filter=k;
    $$('.linekey button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.line===k)));
    Object.keys(paths).forEach(l=>{const off=k!=='all'&&l!==k;paths[l].classList.toggle('dim',off);trains[l].g.classList.toggle('dim',off)});
    future.classList.toggle('dim',k!=='all'&&k!=='eng');
    S.forEach(st=>nodes[st.id].classList.toggle('dim',k!=='all'&&!st.lines.includes(k)));
    if(k!=='all'){const cur=S.find(s=>s.id===current);if(!cur.lines.includes(k)){const pick={eng:'bn',ml:'ser',ana:'wim'}[k];select(pick)}}
  }
  $$('.linekey button').forEach(b=>b.addEventListener('click',()=>setFilter(b.dataset.line)));

  /* trains glide back and forth */
  let running=false,visible=true,last=0;
  function place(t,k){
    const p=paths[k].getPointAtLength(t.s),q=paths[k].getPointAtLength(Math.min(t.len,t.s+2)),q0=paths[k].getPointAtLength(Math.max(0,t.s-2));
    const ang=Math.atan2(q.y-q0.y,q.x-q0.x)*180/Math.PI;
    t.g.setAttribute('transform',`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    t.lamp.setAttribute('cx',t.dir>0?10:-10);
  }
  function tick(now){
    if(!running)return;
    const dt=Math.min(64,now-last);last=now;
    if(visible&&!document.hidden){
      Object.keys(trains).forEach(k=>{const t=trains[k];
        if(t.wait>0){t.wait-=dt;return}
        t.s+=t.dir*dt*0.055;
        if(t.s>=t.len){t.s=t.len;t.dir=-1;t.wait=1400}
        else if(t.s<=0){t.s=0;t.dir=1;t.wait=1400}
        place(t,k);
      });
    }
    requestAnimationFrame(tick);
  }
  function startTrains(){
    if(reduceMQ.matches)return;
    Object.keys(trains).forEach(k=>{place(trains[k],k);trains[k].g.classList.remove('hide')});
    running=true;last=performance.now();requestAnimationFrame(tick);
  }
  if('IntersectionObserver' in window){new IntersectionObserver(es=>{visible=es[0].isIntersecting}).observe(svg)}

  /* the one orchestrated moment: lines draw, stations arrive in order */
  function alongFraction(path,len,x,y){
    let best=0,bd=1e9;for(let s=0;s<=len;s+=6){const p=path.getPointAtLength(s);const d=(p.x-x)**2+(p.y-y)**2;if(d<bd){bd=d;best=s}}
    return best/len;
  }
  if(reduceMQ.matches){return}
  const D=1300,delay={eng:150,ml:420,ana:690};
  future.classList.add('hide');
  Object.keys(paths).forEach(k=>{
    const p=paths[k],len=trains[k].len;
    p.style.strokeDasharray=len;p.style.strokeDashoffset=len;
    S.filter(s=>s.lines[0]===k&&!s.open).forEach(s=>{
      const g=nodes[s.id];g.classList.add('hide');
      const f=alongFraction(p,len,s.x,s.y);
      setTimeout(()=>g.classList.remove('hide'),delay[k]+D*(0.12+0.8*f));
    });
  });
  nodes.next.classList.add('hide');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    Object.keys(paths).forEach(k=>{const p=paths[k];p.style.transition=`stroke-dashoffset ${D}ms cubic-bezier(.6,0,.25,1) ${delay[k]}ms`;p.style.strokeDashoffset=0});
  }));
  setTimeout(()=>{future.classList.remove('hide');nodes.next.classList.remove('hide')},delay.eng+D+80);
  setTimeout(()=>{Object.keys(paths).forEach(k=>{const p=paths[k];p.style.transition='';p.style.strokeDasharray='';p.style.strokeDashoffset=''});startTrains()},delay.ana+D+200);
})();

/* ---------------- results ---------------- */
(function results(){
  const R=[
    {fig:'20×',h:'Faster SQL Server bulk load',how:'Rebuilt the Spark write path for bulk insertion.',at:'BusinessNext',b:['20 h',1200],a:['1 h',60]},
    {fig:'20×',h:'Faster engine image build',how:'Re-layered the Dockerfile and base images, which sped up releases.',at:'BusinessNext',b:['5 h',300],a:['15 min',15]},
    {fig:'−75%',h:'Manual data validation effort',how:'Automated quality checks in PySpark and Azure Synapse.',at:'Infosys, for Microsoft',b:['100%',100],a:['25%',25]},
    {fig:'−40%',h:'Query execution time',how:'Moved legacy PostgreSQL functions into Azure Synapse pipelines.',at:'Infosys, for Microsoft',b:['100%',100],a:['60%',60]},
    {fig:'−25%',h:'Airflow task failures',how:'Redesigned DAG dependencies, retries and sensors.',at:'Deutsche Telekom Digital Labs',b:['100%',100],a:['75%',75]},
    {fig:'+20%',h:'Warehouse retrieval speed',how:'Analytics-ready data models and schemas in Redshift.',at:'Deutsche Telekom Digital Labs',b:['100%',100],a:['120%',120]},
    {fig:'70+',h:'Transformations across 10+ databases',how:'Full and incremental loads, cloud and on-prem.',at:'BusinessNext',plain:'One engine, owned end to end. Its layout is on the <a href="experience.html#x-bn">Experience</a> page.'}
  ];
  const ul=$('#resultList');if(!ul)return;
  ul.innerHTML=R.map(r=>{
    let right;
    if(r.plain){right=`<p class="plain">${r.plain}</p>`}
    else{
      const max=Math.max(r.b[1],r.a[1]);const w=v=>`calc(${(v/max*100).toFixed(1)}% - ${(v/max*5.2).toFixed(2)}rem)`;
      right=`<div class="cmp" role="img" aria-label="Before ${r.b[0]}, after ${r.a[0]}">
        <div class="cmp-row"><span>Before</span><div class="cmp-track"><span class="cmp-bar" style="width:${w(r.b[1])}"></span><span class="cmp-val">${r.b[0]}</span></div></div>
        <div class="cmp-row"><span>After</span><div class="cmp-track"><span class="cmp-bar after" style="width:${w(r.a[1])}"></span><span class="cmp-val">${r.a[0]}</span></div></div>
      </div>`;
    }
    return `<li><p class="fig">${r.fig}</p><div><h3>${r.h}</h3><p class="how">${r.how}</p><p class="at"><i class="bul eng" aria-hidden="true"></i>${r.at}</p></div>${right}</li>`;
  }).join('');
  if(!reduceMQ.matches&&'IntersectionObserver' in window){
    ul.classList.add('is-armed');
    const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){ul.classList.add('is-in');io.disconnect()}},{threshold:.15});
    io.observe(ul);
  }
})();

/* ---------------- agent: plain English to dataflow ---------------- */
(function agent(){
  if(!$('#agentText'))return;

  const PRESETS=[
    'Read customers from SQL Server, keep only active accounts in Mumbai, join with transactions from Oracle on customer_id, sum amount by branch, then save to Iceberg.',
    'Ingest loan applications from Kafka, remove duplicates by application_id, mask pan and phone, then write to Databricks.',
    'Every night load only changed rows from the Postgres accounts table, keep rows where balance is greater than 100000, top 50 by balance, then upsert into Redshift.'
  ];
  const DBS=[[/sql ?server|mssql/i,'mssql','SQL Server'],[/oracle/i,'oracle','Oracle'],[/postgres(?:ql)?/i,'postgres','PostgreSQL'],[/mysql/i,'mysql','MySQL'],[/mongo(?:db)?/i,'mongodb','MongoDB'],[/cassandra/i,'cassandra','Cassandra'],[/clickhouse/i,'clickhouse','ClickHouse'],[/iceberg/i,'iceberg','Iceberg'],[/trino/i,'trino','Trino'],[/redshift/i,'redshift','Redshift'],[/synapse/i,'synapse','Synapse'],[/databricks|delta lake|\bdelta\b/i,'databricks','Databricks'],[/kafka/i,'kafka','Kafka'],[/\bs3\b/i,'s3','S3'],[/azure blob|adls|blob storage/i,'azure_blob','Azure Blob'],[/minio/i,'minio','MinIO'],[/\bhive\b/i,'hive','Hive'],[/\bcsv\b|parquet|\bfiles?\b/i,'files','Files']];
  const DBWORDS=/^(sql|server|oracle|postgres|postgresql|mysql|mongo|mongodb|cassandra|clickhouse|iceberg|trino|redshift|synapse|databricks|delta|kafka|s3|azure|blob|adls|minio|hive|csv|parquet|files?)$/i;
  const STOP=new Set('the a an all only new changed updated rows records data every night nightly daily table from of each some our my this that and then into in to with'.split(' '));
  const findDB=s=>{for(const [re,id,label] of DBS)if(re.test(s))return{id,label};return null};
  const snake=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
  function tableBetween(clause,verbRe){
    const m=clause.match(verbRe);if(!m)return null;
    let rest=clause.slice(m.index+m[0].length);
    const cut=rest.search(/\b(from|on|in|into|to|where|by)\b/i);const seg=(cut>=0?rest.slice(0,cut):rest);
    const words=seg.split(/[^A-Za-z0-9_]+/).filter(w=>w&&!STOP.has(w.toLowerCase())&&!DBWORDS.test(w));
    if(words.length)return snake(words.slice(0,3).join('_'));
    const t=clause.match(/\b([a-z_]\w*)\s+table\b/i);if(t&&!DBWORDS.test(t[1]))return snake(t[1]);
    return null;
  }
  function condition(cl){
    const w=cl.match(/\bwhere\s+(.+)$/i);
    if(w){return w[1].replace(/\.$/,'').replace(/\bis greater than or equal to\b/gi,'>=').replace(/\bis less than or equal to\b/gi,'<=').replace(/\b(is )?(greater than|more than|above|over)\b/gi,'>').replace(/\b(is )?(less than|below|under)\b/gi,'<').replace(/\bis not\b|\bisn't\b/gi,'!=').replace(/\b(is|equals?)\b/gi,'=').replace(/\s+/g,' ').trim()}
    const parts=[];
    const st=cl.match(/\b(active|inactive|closed|dormant|open|pending|failed|approved|rejected)\b/i);if(st)parts.push(`status = '${st[1].toLowerCase()}'`);
    const city=cl.match(/\bin\s+([A-Z][a-zA-Z]+)/);if(city)parts.push(`city = '${city[1]}'`);
    const amt=cl.match(/(?:over|above|more than|greater than|>)\s*(?:rs\.?|₹|\$)?\s*([\d,]+(?:\.\d+)?)/i);if(amt)parts.push(`amount > ${amt[1].replace(/,/g,'')}`);
    const yr=cl.match(/\b(?:since|after)\s+(20\d\d)\b/);if(yr)parts.push(`event_date >= '${yr[1]}-01-01'`);
    const lastN=cl.match(/\blast\s+(\d+)\s+(day|week|month)s?/i);if(lastN)parts.push(`event_date >= current_date - interval '${lastN[1]} ${lastN[2].toLowerCase()}'`);
    const nn=cl.match(/\b(?:missing|null|empty|blank)\s+([a-z_]\w*)/i);if(nn)parts.push(`${snake(nn[1])} IS NOT NULL`);
    return parts.join(' AND ')||cl.replace(/^\s*(filter|keep only|keep|only|exclude)\s*/i,'').replace(/\.$/,'');
  }
  function parse(text){
    const flow={mode:'full',ops:[],warnings:[]};
    if(/\b(changed rows|new rows|incremental|since last run|delta load|only changes)\b/i.test(text)){flow.mode='incremental';flow.watermark='updated_at'}
    if(/\b(every night|nightly|daily|every day)\b/i.test(text))flow.schedule='0 2 * * *';
    else if(/\b(hourly|every hour)\b/i.test(text))flow.schedule='0 * * * *';
    const clauses=text.split(/\s*(?:[,;]|\.(?:\s|$)|\bthen\b|\band then\b|\bafter that\b)\s*/i).map(s=>s.trim()).filter(Boolean);
    let lastTable='data',hasRead=false,agg=null;
    clauses.forEach(cl=>{
      const db=findDB(cl);
      const isWrite=/\b(save|write|store|sink|land|persist|publish|push|load|dump|upsert|merge)\b[^.]*\b(to|into|in)\b/i.test(cl)&&db&&!/\bfrom\b/i.test(cl);
      if(isWrite){
        const mode=/\b(upsert|merge)\b/i.test(cl)?'merge':/\b(overwrite|replace)\b/i.test(cl)?'overwrite':'append';
        const nm=cl.match(/\b(?:as|table)\s+([a-z_]\w*)/i);
        flow.ops.push({type:'write',target:db.id,table:nm?snake(nm[1]):(agg?agg+'_summary':lastTable+'_out'),mode});return;
      }
      if(/\b(join|enrich|combine|match)\b/i.test(cl)){
        const right=tableBetween(cl,/\b(?:join|enrich|combine|match)\b(?:\s+(?:it|them))?\s*(?:with|to|against)?/i)||'lookup';
        const key=(cl.match(/\b(?:on|using|by)\s+([a-z_][\w]*)/i)||[])[1]||'id';
        flow.ops.push({type:'read',source:db?db.id:'mssql',table:right,side:true});
        flow.ops.push({type:'join',right:(db?db.id:'mssql')+'.'+right,on:snake(key),how:/\bleft\b/i.test(cl)?'left':'inner'});return;
      }
      const readVerb=/\b(read|ingest|pull|extract|fetch|stream|load|take|get|start with)\b/i;
      if(!hasRead&&(readVerb.test(cl)||(db&&/\bfrom\b/i.test(cl)))){
        const t=tableBetween(cl,readVerb)||((cl.match(/\b([a-z_]\w*)\s+table\b/i)||[])[1])||'source_table';
        lastTable=snake(t);hasRead=true;
        flow.ops.push({type:'read',source:db?db.id:'mssql',table:lastTable});
        if(/\bwhere\b/i.test(cl))flow.ops.push({type:'filter',condition:condition(cl)});
        return;
      }
      let matched=false;
      if(/\b(filter|keep|only|where|exclude|excluding|drop rows)\b/i.test(cl)&&!/\bduplicate/i.test(cl)){flow.ops.push({type:'filter',condition:condition(cl)});matched=true}
      if(/\b(dedup\w*|de-dup\w*|duplicates?|distinct|unique)\b/i.test(cl)){const k=(cl.match(/\b(?:by|on)\s+([a-z_]\w*)/i)||[])[1];flow.ops.push({type:'dedupe',keys:[k?snake(k):'id']});matched=true}
      if(/\b(mask|hash|anonymi[sz]e|redact|encrypt)\b/i.test(cl)){const m=cl.match(/\b(?:mask|hash|anonymi[sz]e|redact|encrypt)\s+(?:the\s+)?([\w\s,]+)/i);const cols=m?m[1].split(/\s*(?:,|\band\b)\s*/).map(s=>snake(s)).filter(s=>s&&!STOP.has(s)):['pii'];flow.ops.push({type:'mask',columns:cols,method:'sha256'});matched=true}
      const rn=cl.match(/\brename\s+([a-z_]\w*)\s+(?:to|as)\s+([a-z_]\w*)/i);if(rn){flow.ops.push({type:'rename',from:snake(rn[1]),to:snake(rn[2])});matched=true}
      const fnm=cl.match(/\b(sum|total|average|avg|mean|max|maximum|min|minimum|count)\b(?:\s+(?:of|the|up))*\s+([a-z_]\w*)?/i);
      if(fnm&&!/\btop\s+\d+/i.test(cl)){
        const map={sum:'sum',total:'sum',average:'avg',avg:'avg',mean:'avg',max:'max',maximum:'max',min:'min',minimum:'min',count:'count'};
        const fn=map[fnm[1].toLowerCase()];const colm=fnm[2]&&!/^(by|per|of)$/i.test(fnm[2])?snake(fnm[2]):'*';
        const g=(cl.match(/\b(?:by|per|for each)\s+([a-z_]\w*)/i)||[])[1];
        const col=fn==='count'?'*':colm;
        flow.ops.push({type:'aggregate',group_by:g?[snake(g)]:[],metrics:[{fn,column:col,as:fn==='count'?'n_rows':fn+'_'+col}]});
        agg=g?snake(g):'total';matched=true;
      }
      const top=cl.match(/\btop\s+(\d+)(?:\s+(?!by\b)\w+)?(?:\s+by\s+([a-z_]\w*))?/i);
      if(top){flow.ops.push({type:'sort',by:top[2]?snake(top[2]):'value',order:'desc'});flow.ops.push({type:'limit',n:+top[1]});matched=true}
      else if(/\b(sort|order|rank)\b/i.test(cl)){const b=(cl.match(/\b(?:by)\s+([a-z_]\w*)/i)||[])[1];flow.ops.push({type:'sort',by:b?snake(b):'value',order:/\b(desc|descending|highest|largest)\b/i.test(cl)?'desc':'asc'});matched=true}
      const lim=cl.match(/\b(?:limit|first)\s+(\d+)\b/i);if(lim&&!top){flow.ops.push({type:'limit',n:+lim[1]});matched=true}
      if(!matched&&!/\b(every night|nightly|daily|hourly)\b/i.test(cl)&&cl.split(/\s+/).length>1)flow.warnings.push(cl);
    });
    if(!hasRead&&flow.ops.length)flow.warnings.unshift('No source found. Start with something like “Read customers from SQL Server”.');
    if(flow.ops.length&&!flow.ops.some(o=>o.type==='write'))flow.warnings.push('No target found, so the result stays in memory. Add “save to Iceberg” or similar.');
    return flow;
  }
  function toDefinition(flow){
    const ops=[];const edges=[];let prev=null;let n=0;
    const id=()=>'op'+(++n);
    let sideRead=null;
    flow.ops.forEach(o=>{
      if(o.type==='read'&&o.side){sideRead={id:id(),type:'read',source:o.source,table:o.table};ops.push(sideRead);return}
      const node=Object.assign({id:id()},o);delete node.side;
      if(o.type==='read'&&flow.mode==='incremental'){node.load='incremental';node.watermark=flow.watermark}
      if(o.type==='join'&&sideRead){delete node.right;node.inputs=[prev,sideRead.id];edges.push([sideRead.id,node.id]);sideRead=null}
      ops.push(node);if(prev)edges.push([prev,node.id]);prev=node.id;
    });
    const first=flow.ops.find(o=>o.type==='read'&&!o.side),last=flow.ops.filter(o=>o.type==='write').pop();
    const def={dataflow:(first?first.table:'flow')+'_to_'+(last?last.target:'memory'),load_mode:flow.mode};
    if(flow.schedule)def.schedule=flow.schedule;
    def.operators=ops;def.edges=edges;
    return def;
  }
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function highlight(json){return esc(json).replace(/(&quot;[^&]*?&quot;)(\s*:)/g,'<span class="k1">$1</span>$2').replace(/:\s(&quot;[^&]*?&quot;)/g,': <span class="s1">$1</span>')}
  function detail(o){switch(o.type){
    case 'read':return o.source+'.'+o.table+(o.load==='incremental'?', incremental':'');
    case 'filter':return o.condition;case 'join':return o.how+' join on '+o.on;case 'dedupe':return 'keys: '+o.keys.join(', ');
    case 'mask':return o.columns.join(', ')+', '+o.method;case 'aggregate':return o.metrics.map(m=>m.fn+'('+m.column+')').join(', ')+(o.group_by.length?' by '+o.group_by.join(', '):'');
    case 'sort':return o.by+' '+o.order;case 'limit':return 'n = '+o.n;case 'rename':return o.from+' → '+o.to;case 'write':return o.target+'.'+o.table+', '+o.mode;default:return ''}}
  
  function run(){
    const text=$('#agentText').value.trim();const flow=parse(text);const def=toDefinition(flow);
    const out=$('#agentOps');out.innerHTML='';
    let n=0;
    def.operators.forEach(o=>{
      if(o.type==='read'&&def.operators.some(j=>j.type==='join'&&j.inputs&&j.inputs[1]===o.id))return;
      const li=document.createElement('li');
      let d=detail(o);if(o.type==='join'&&o.inputs){const r=def.operators.find(x=>x.id===o.inputs[1]);d+=', with '+r.source+'.'+r.table}
      li.style.animationDelay=(reduceMQ.matches?0:n*60)+'ms';n++;
      li.innerHTML=`<span class="k">${esc(o.type)}</span><span class="d">${esc(d)}</span>`;
      out.appendChild(li);
    });
    const old=$('.agent-out .agent-msg');if(old)old.remove();
    if(flow.warnings.length){const m=document.createElement('p');m.className='agent-msg';m.textContent=flow.warnings.map(w=>w.length>80||/^No /.test(w)?w:'Skipped: “'+w+'”').join(' ');out.after(m)}
    $('#agentSummary').textContent=n?`${n} steps, ${def.load_mode} load${def.schedule?', scheduled':''}`:'Nothing to build yet. Try one of the examples.';
    $('#agentJson').innerHTML=def.operators.length?highlight(JSON.stringify(def,null,2)):'';
  }
  $('#agentRun').addEventListener('click',run);
  $('#agentText').addEventListener('keydown',e=>{if(e.key==='Enter'&&(e.metaKey||e.ctrlKey)){e.preventDefault();run()}});
  $$('[data-preset]').forEach(b=>b.addEventListener('click',()=>{$('#agentText').value=PRESETS[+b.dataset.preset];run()}));
  run();
})();

/* ---------------- speech emotion: model ladder ---------------- */
(function ser(){
  const M=[
    {n:'Hand-made features, 3-model vote (baseline)',f1:.58,lo:.52,hi:.64,rev:56},
    {n:'HuBERT-base, frozen',f1:.69,lo:.63,hi:.74,rev:25},
    {n:'HuBERT-base, fine-tuned',f1:.67,lo:.60,hi:.72,rev:21},
    {n:'WavLM-large, frozen, layer 9',f1:.78,lo:.72,hi:.83,rev:9},
    {n:'Final: 70% WavLM + 30% baseline',f1:.79,lo:.73,hi:.84,rev:8,fin:true}
  ];
  let metric='f1';
  const chart=$('#serChart');if(!chart)return;
  function render(){
    const isF=metric==='f1',max=isF?1:60,target=isF?.61:20;
    const pct=v=>(v/max*100)+'%';
    chart.innerHTML=M.map(m=>{
      const v=isF?m.f1:m.rev,val=isF?m.f1.toFixed(2):m.rev+'%';
      const ci=isF?`<span class="hb-ci" style="left:${pct(m.lo)};width:${((m.hi-m.lo)/max*100)}%"></span>`:'';
      return `<div class="hb${m.fin?' final':''}" title="${esc0(m.n)}: ${val}${isF?' (95% interval '+m.lo.toFixed(2)+' to '+m.hi.toFixed(2)+')':''}"><div class="n"><span>${esc0(m.n)}</span><b>${val}</b></div><div class="hb-track"><span class="hb-bar" style="width:${pct(v)}"></span>${ci}<span class="hb-target" style="left:${pct(target)}"></span></div></div>`;
    }).join('')+`<div class="hb-key">${isF?'<span><i></i>Target, 0.61 or higher</span><span><i class="ci"></i>95% interval</span><span>Chance is 0.125</span>':'<span><i></i>Target, 20% or lower</span><span>Lower is better</span>'}</div>`;
    $('#serNote').innerHTML=isF
      ?'Every model is scored on four speakers it never heard. Fine-tuning HuBERT did <b>not</b> beat the frozen model with about 1,000 training clips.'
      :'The share of call segments a person still has to judge by ear. The baseline nearly hits the F1 target but would leave <b>56%</b> of segments for a human. The final model leaves <b>8%</b>.';
  }
  $$('[data-sm]').forEach(b=>b.addEventListener('click',()=>{metric=b.dataset.sm;$$('[data-sm]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()}));
  render();
})();

/* ---------------- Wimbledon: leverage by score ---------------- */
(function tennis(){
  const court=$('#court'),adRow=$('#adRow');if(!court)return;
  /* [hold chance now, if server wins the point, if server loses it, swing, points observed] */
  const D={'30-40':[.430,.705,0,.705,10038],'40-AD':[.411,.705,0,.705,8672],'40-40':[.705,.887,.411,.476,22712],'15-30':[.545,.726,.261,.465,13219],'30-30':[.726,.894,.430,.464,16188],'15-40':[.261,.430,0,.430,6804],'0-30':[.395,.545,.148,.397,7301],'0-15':[.617,.757,.395,.362,18981],'15-15':[.757,.878,.545,.333,23971],'40-30':[.894,1,.705,.295,16716],'AD-40':[.887,1,.705,.295,14036],'0-0':[.781,.881,.617,.264,53736],'0-40':[.148,.261,0,.261,2789],'30-15':[.878,.964,.726,.238,22381],'15-0':[.881,.951,.757,.194,33816],'30-0':[.951,.989,.878,.111,21530],'40-15':[.964,1,.894,.106,18903],'40-0':[.989,1,.964,.036,14413]};
  const P=['0','15','30','40'];
  const shade=sw=>`color-mix(in srgb, var(--heat-hi) ${Math.round(sw*112)}%, var(--heat-lo))`;
  court.innerHTML='<span class="corner" aria-hidden="true">server ↓<br>returner →</span>'+P.map(s=>`<span class="hd" aria-hidden="true">${s}</span>`).join('');
  P.forEach(sv=>{
    court.insertAdjacentHTML('beforeend',`<span class="hd" aria-hidden="true">${sv}</span>`);
    P.forEach(rt=>{const k=sv+'-'+rt,d=D[k],lab=k==='40-40'?'Deuce':sv+'–'+rt;
      court.insertAdjacentHTML('beforeend',`<button type="button" data-k="${k}" aria-pressed="false" style="background:${shade(d[3])}" aria-label="Score ${lab}, swing ${Math.round(d[3]*100)} points"><span>${lab}</span><small>${Math.round(d[3]*100)}</small></button>`)});
  });
  adRow.innerHTML='<span></span>';
  [['AD-40','Advantage server'],['40-AD','Advantage returner']].forEach(([k,full])=>{const d=D[k];adRow.insertAdjacentHTML('beforeend',`<button type="button" data-k="${k}" aria-pressed="false" aria-label="${full}, swing ${Math.round(d[3]*100)} points" style="background:${shade(d[3])}"><span>${full}</span><small>${Math.round(d[3]*100)}</small></button>`)});
  const nice=k=>k==='40-40'?'deuce':k==='AD-40'?'advantage server':k==='40-AD'?'advantage returner':k.replace('-','–');
  const bp=k=>({'30-40':'break point','40-AD':'break point','15-40':'double break point','0-40':'triple break point'})[k];
  const pc=v=>Math.round(v*100)+'%';
  function show(k){
    const d=D[k];
    $$('#court button,#adRow button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.k===k)));
    const tag=bp(k);
    $('#courtOut').innerHTML=`<div class="row3"><div><b>${pc(d[0])}</b><span>server holds from ${nice(k)}</span></div><div><b>${pc(d[1])}</b><span>if the server wins this point</span></div><div><b>${pc(d[2])}</b><span>if the server loses it</span></div></div><p>At ${nice(k)}${tag?' ('+tag+')':''}, one point moves the hold chance by <b>${Math.round(d[3]*100)} percentage points</b>. Based on ${d[4].toLocaleString('en-IN')} service points.${k==='30-40'||k==='40-AD'?' This is where a coach’s second-serve plan pays off most.':''}</p>`;
  }
  const pick=e=>{const b=e.target.closest('button[data-k]');if(b)show(b.dataset.k)};
  court.addEventListener('click',pick);adRow.addEventListener('click',pick);
  show('30-40');
})();

/* ---------------- Coke: elasticity ---------------- */
(function coke(){
  const cut=$('#cut');if(!cut)return;
  let deal=true;
  function render(){
    const c=+cut.value/100;$('#cutOut').textContent=Math.round(c*100)+'%';
    const e=deal?4.30:2.81,q=Math.pow(1-c,-e),rev=(1-c)*q;
    const max=2.7,pos=v=>Math.min(100,v/max*100);
    const row=(lab,v)=>`<div class="hb"><div class="n"><span>${lab}</span><b>${v>=1?'+':'−'}${Math.abs(Math.round((v-1)*100))}%</b></div><div class="hb-track"><span class="hb-bar" style="width:${pos(v)}%"></span><span class="hb-base" style="left:${pos(1)}%"></span></div></div>`;
    $('#cokeBars').innerHTML=row('Units sold',q)+row('Revenue',rev)+`<div class="base-lab" aria-hidden="true"><span style="left:${pos(1)}%">today’s level</span></div>`;
    const qa=Math.pow(1-c,-4.30),qb=Math.pow(1-c,-2.81);
    $('#cokeNote').innerHTML=c===0?'Move the slider to cut the price.':`A ${Math.round(c*100)}% cut sells <b>${Math.round((qb-1)*100)}%</b> more Coke without a tag and <b>${Math.round((qa-1)*100)}%</b> more with one. Same discount, ${Math.round((qa-1)/(qb-1)*10)/10} times the lift.`;
  }
  cut.addEventListener('input',render);
  $$('[data-deal]').forEach(b=>b.addEventListener('click',()=>{deal=b.dataset.deal==='1';$$('[data-deal]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()}));
  render();
})();

})();
