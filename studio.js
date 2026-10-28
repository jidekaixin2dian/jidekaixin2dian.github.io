'use strict';
(() => {
  const projects=window.PORTFOLIO_PROJECTS,$=s=>document.querySelector(s);
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const galleries={fps:[['fps-v030-overview.webp','工作台'],['fps-v030-detect.webp','系统检测'],['fps-v030-display.webp','显示与画质'],['fps-v030-dark.webp','开局工作台']],desk:[['piweb-desk.png','桌面界面']]};
  let selected=null;
  $('#studio-count').textContent=`${projects.length} 件`;
  $('#studio-project-list').innerHTML=projects.map((p,i)=>`<button class="index-project" role="tab" id="studio-tab-${p.id}" aria-selected="false" aria-controls="studio-case" tabindex="-1" data-studio-project="${p.id}"><span class="index-number" aria-hidden="true">${String(i+1).padStart(2,'0')}</span><span class="index-name">${escape(p.name)}</span><span class="index-arrow" aria-hidden="true">↗</span></button>`).join('');
  function imageMarkup(p){const list=galleries[p.id];if(!list)return `<blockquote class="case-statement">${escape(p.subtitle)}</blockquote>`;const width=p.id==='fps'?2040:1361,height=p.id==='fps'?1290:901;return `<figure class="case-image" data-image-container><div class="case-image-frame"><img src="./${list[0][0].replace('.png','-2x.webp')}" data-original-src="./${list[0][0]}" alt="${escape(p.name)}：${list[0][1]}的实际界面" width="${width}" height="${height}" data-view-image decoding="async"></div><div class="case-image-controls"><span>真实截图 · ${p.id==='fps'?'v0.3.0 历史截图 · 原生分辨率':'AI 2×增强'}</span><button data-view-image>原像素查看 ↗</button></div></figure>${list.length>1?`<div class="case-gallery" role="group" aria-label="切换 ${escape(p.name)} 截图">${list.map(([,label],i)=>`<button data-studio-gallery="${i}" aria-pressed="${i===0}">${label}</button>`).join('')}</div>`:''}`;}
  function selectProject(id,{route=true,scroll=true,focus=false}={}){
    const p=projects.find(p=>p.id===id);if(!p)return;selected=id;
    document.querySelectorAll('[data-studio-project]').forEach(b=>{const active=b.dataset.studioProject===id;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    $('#studio-case').setAttribute('aria-labelledby',`studio-tab-${id}`);
    $('#studio-case').innerHTML=`<div class="case-heading"><div><p class="case-meta"><span>${escape(p.role)}</span><span>${escape(p.tags)}</span></p><h2>${escape(p.name)}</h2></div><span class="case-number" aria-hidden="true">${String(projects.indexOf(p)+1).padStart(2,'0')}</span></div>${p.image?`<p class="case-lead">${escape(p.subtitle)}</p>`:''}${imageMarkup(p)}<div class="case-notes">${[['遇到的问题',p.problem],['我的做法',p.approach],['做到了什么',p.result]].map(([title,text],i)=>`<details class="case-note" ${i===0?'open':''}><summary>${title}</summary><p>${escape(text)}</p></details>`).join('')}</div><p class="case-boundary">${escape(p.boundary)}</p><div class="case-actions"><a href="https://github.com/jidekaixin2dian/${p.repo}" target="_blank" rel="noopener">查看项目 <span aria-hidden="true">↗</span></a><button data-studio-share>复制这件作品的链接</button></div><div class="case-references">${p.links.map(([label,url])=>`<a href="${escape(url)}" target="_blank" rel="noopener">${escape(label)} ↗</a>`).join('')}</div>`;
    if(route){const url=new URL(location.href);url.hash=`project/${id}`;history.pushState({studioProject:id},'',url);}
    if(focus)$(`#studio-tab-${id}`).focus({preventScroll:true});
    if(scroll)$('#work').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }
  $('#studio-project-list').addEventListener('click',e=>{const b=e.target.closest('[data-studio-project]');if(b)selectProject(b.dataset.studioProject);});
  $('#studio-project-list').addEventListener('keydown',e=>{const b=e.target.closest('[data-studio-project]');if(!b)return;let i=projects.findIndex(p=>p.id===b.dataset.studioProject);if(e.key==='ArrowDown'||e.key==='ArrowRight')i=(i+1)%projects.length;else if(e.key==='ArrowUp'||e.key==='ArrowLeft')i=(i+projects.length-1)%projects.length;else if(e.key==='Home')i=0;else if(e.key==='End')i=projects.length-1;else return;e.preventDefault();selectProject(projects[i].id,{focus:true});});
  $('#studio-case').addEventListener('click',async e=>{
    const gallery=e.target.closest('[data-studio-gallery]');
    if(gallery){const p=projects.find(p=>p.id===selected),list=galleries[selected],i=Number(gallery.dataset.studioGallery);if(!list[i])return;const img=$('#studio-case img');img.src=`./${list[i][0].replace('.png','-2x.webp')}`;img.dataset.originalSrc=`./${list[i][0]}`;img.alt=`${p.name}：${list[i][1]}的实际界面`;document.querySelectorAll('[data-studio-gallery]').forEach(b=>b.setAttribute('aria-pressed',String(b===gallery)));}
    const share=e.target.closest('[data-studio-share]');if(share){const url=new URL('https://jidekaixin2dian.github.io/studio.html');url.hash=`project/${selected}`;try{await navigator.clipboard.writeText(url.href);share.textContent='已复制';}catch{share.textContent='请复制地址栏';}setTimeout(()=>{if(share.isConnected)share.textContent='复制这件作品的链接';},2500);}
  });
  function routeProject(){const id=/^#project\/([a-z]+)$/.exec(location.hash)?.[1];if(id&&projects.some(p=>p.id===id))selectProject(id,{route:false,scroll:true});else if(!location.hash)selectProject(projects[0].id,{route:false,scroll:false});}
  window.addEventListener('popstate',routeProject);window.addEventListener('hashchange',()=>{if(location.hash.startsWith('#project/'))routeProject();});
  const horizontal=matchMedia('(max-width: 767px)');const orientation=()=>$('#studio-project-list').setAttribute('aria-orientation',horizontal.matches?'horizontal':'vertical');horizontal.addEventListener('change',orientation);orientation();
  const initial=/^#project\/([a-z]+)$/.exec(location.hash)?.[1];selectProject(projects.some(p=>p.id===initial)?initial:projects[0].id,{route:false,scroll:!!initial});
})();
