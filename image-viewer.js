'use strict';
// A pixel viewer with explicit original / AI-enhanced switching.
(() => {
  const dialog=document.createElement('dialog');dialog.className='image-viewer';dialog.setAttribute('aria-labelledby','image-viewer-title');
  dialog.innerHTML='<header class="image-viewer-header"><div><h2 id="image-viewer-title">项目原图</h2><p id="image-viewer-status" role="status"></p></div><button type="button" class="image-viewer-close" aria-label="关闭原图">关闭 ×</button></header><div class="image-viewer-toolbar"><button type="button" data-image-action="fit">适合窗口</button><button type="button" data-image-action="native">原像素 100%</button><div class="image-zoom-controls"><button type="button" data-image-action="out" aria-label="缩小原图">−</button><output id="image-zoom">100%</output><button type="button" data-image-action="in" aria-label="放大原图">+</button></div><a id="image-original-link" target="_blank" rel="noopener">打开原文件 ↗</a></div><div class="image-viewer-stage"><img alt="" draggable="false"></div><p class="image-viewer-help">原图像素 · 滚动或拖动查看细节</p>';
  document.body.append(dialog);
  const img=dialog.querySelector('img'),stage=dialog.querySelector('.image-viewer-stage'),status=dialog.querySelector('#image-viewer-status'),output=dialog.querySelector('#image-zoom');
  const enhancement=document.createElement('button');enhancement.type='button';enhancement.dataset.imageAction='enhanced';enhancement.textContent='2×增强图';enhancement.hidden=true;dialog.querySelector('.image-viewer-toolbar').append(enhancement);
  let scale=1,opener=null,drag=null,originalSrc='',enhancedSrc='',usingEnhanced=false;
  const nativeScale=()=>1/(window.devicePixelRatio||1);
  function applyScale(next){if(!img.naturalWidth)return;scale=Math.max(nativeScale()*.1,Math.min(nativeScale()*3,next));img.style.width=`${Math.round(img.naturalWidth*scale)}px`;output.textContent=`${Math.round(scale/nativeScale()*100)}%`;}
  function fit(){applyScale(Math.min(nativeScale(),(stage.clientWidth-32)/img.naturalWidth,(stage.clientHeight-32)/img.naturalHeight));stage.scrollLeft=0;stage.scrollTop=0;}
  function loaded(){status.textContent=`${img.naturalWidth} × ${img.naturalHeight} 像素 · ${usingEnhanced?'AI 2×增强':'真实原图'}`;fit();}
  function open(src,label='项目原图',sourceOpener=document.activeElement,enhanced=''){opener=sourceOpener;originalSrc=src;enhancedSrc=enhanced;usingEnhanced=false;enhancement.hidden=!enhanced;enhancement.textContent='2×增强图';dialog.querySelector('#image-viewer-title').textContent=label;status.textContent='载入原图';img.alt=label;dialog.querySelector('#image-original-link').href=src;img.src=src;if(!dialog.open)dialog.showModal();document.body.classList.add('image-viewer-open');dialog.querySelector('.image-viewer-close').focus();if(img.complete&&img.naturalWidth)loaded();}
  img.addEventListener('load',loaded);
  img.addEventListener('error',()=>status.textContent='原图暂时无法载入');
  dialog.querySelector('.image-viewer-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.classList.remove('image-viewer-open');drag=null;if(opener?.isConnected)opener.focus({preventScroll:true});});
  dialog.querySelector('.image-viewer-toolbar').addEventListener('click',e=>{const action=e.target.closest('[data-image-action]')?.dataset.imageAction;if(action==='fit')fit();else if(action==='native')applyScale(nativeScale());else if(action==='in')applyScale(scale*1.25);else if(action==='out')applyScale(scale/1.25);else if(action==='enhanced'&&enhancedSrc){usingEnhanced=!usingEnhanced;enhancement.textContent=usingEnhanced?'真实原图':'2×增强图';status.textContent='载入图片';img.src=usingEnhanced?enhancedSrc:originalSrc;if(img.complete&&img.naturalWidth)loaded();}});
  stage.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'||e.button!==0)return;drag={x:e.clientX,y:e.clientY,left:stage.scrollLeft,top:stage.scrollTop};stage.setPointerCapture(e.pointerId);stage.classList.add('dragging');});
  stage.addEventListener('pointermove',e=>{if(!drag)return;stage.scrollLeft=drag.left-(e.clientX-drag.x);stage.scrollTop=drag.top-(e.clientY-drag.y);});
  const endDrag=()=>{drag=null;stage.classList.remove('dragging');};stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',endDrag);
  window.addEventListener('resize',()=>{if(dialog.open)fit();});
  document.addEventListener('click',e=>{const target=e.target.closest('[data-view-image]');if(!target)return;const image=target.tagName==='IMG'?target:target.closest('[data-image-container]')?.querySelector('img');const src=target.dataset.viewImage||image?.dataset.originalSrc||image?.currentSrc||image?.src;if(src)open(src,target.dataset.viewLabel||image?.alt||'项目原图',target,image?.dataset.originalSrc?image.currentSrc||image.src:'');});
  window.PORTFOLIO_IMAGE_VIEWER={open};
})();
