'use strict';
// Apply before styles load. Every theme is also a directly shareable URL.
(() => {
  const root=document.documentElement,key='jk-portfolio-theme';
  const themes={light:{label:'亮色',color:'#f3f4ed'},dark:{label:'暗色',color:'#111311'},blueprint:{label:'蓝图',color:'#f2f4fb'}};
  const requested=new URLSearchParams(location.search).get('theme');
  let stored;try{stored=localStorage.getItem(key);}catch{}
  const valid=value=>Object.hasOwn(themes,value);
  function apply(theme,persist=false){
    root.dataset.theme=theme;
    document.querySelector('meta[name="theme-color"]').content=themes[theme].color;
    const label=document.querySelector('#theme-label');if(label)label.textContent=themes[theme].label;
    document.querySelectorAll('[data-theme-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.themeChoice===theme)));
    if(persist){
      try{localStorage.setItem(key,theme);}catch{}
      const url=new URL(location.href);url.searchParams.set('theme',theme);history.replaceState(history.state,'',url);
    }
    window.dispatchEvent(new CustomEvent('portfolio-theme-change',{detail:{theme}}));
  }
  apply(valid(requested)?requested:valid(stored)?stored:'light');
  document.addEventListener('DOMContentLoaded',()=>{
    apply(root.dataset.theme);
    const toggle=document.querySelector('#theme-toggle'),menu=document.querySelector('#theme-menu');
    function close(restoreFocus=false){menu.hidden=true;toggle.setAttribute('aria-expanded','false');if(restoreFocus)toggle.focus();}
    const choices=Array.from(menu.querySelectorAll('[data-theme-choice]'));
    function open(){menu.hidden=false;toggle.setAttribute('aria-expanded','true');}
    toggle.addEventListener('click',()=>menu.hidden?open():close());
    toggle.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();open();(e.key==='ArrowUp'?menu.querySelector('.style-switch'):choices.find(b=>b.getAttribute('aria-pressed')==='true')).focus();}});
    menu.addEventListener('keydown',e=>{const current=choices.indexOf(document.activeElement);if((e.key==='ArrowLeft'||e.key==='ArrowRight')&&current>=0){e.preventDefault();choices[(current+(e.key==='ArrowRight'?1:-1)+choices.length)%choices.length].focus();}else if(e.key==='ArrowDown'&&current>=0){e.preventDefault();menu.querySelector('.style-switch').focus();}else if(e.key==='ArrowUp'&&document.activeElement.matches('.style-switch')){e.preventDefault();choices.find(b=>b.getAttribute('aria-pressed')==='true').focus();}});
    menu.addEventListener('click',e=>{const choice=e.target.closest('[data-theme-choice]');if(choice){apply(choice.dataset.themeChoice,true);close(true);}});
    document.addEventListener('click',e=>{if(!e.target.closest('.theme-picker'))close();});
    document.querySelector('.theme-picker').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){close(true);e.preventDefault();}});
  },{once:true});
})();
