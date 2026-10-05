import * as THREE from './vendor/three.module.js';

// Four continuous shapes share topology. GPU interpolation keeps scroll morphs smooth.
const story=document.querySelector('.scroll-story');
const host=document.querySelector('#sculpture');
const stage=document.querySelector('.story-stage');
const motionButton=document.querySelector('#motion-toggle');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const mobile=matchMedia('(max-width: 767px)');
const titles=['把想法<br>做成有用的东西。','把复杂<br>拆成清楚的结构。','让工具连接，<br>让工作继续。','最后，<br>让它真正用起来。'];
const descriptions=['我是「记得开心一点」。<br>保持好奇，也把事情做完。','Windows 原生工具与桌面产品。<br>从问题出发，把每个环节接完整。','AI 工作流与开源协作。<br>留下可靠的状态，也留下下一步。','实测、反馈，再打磨。<br>下面是我做过的作品。'];
const labels=['LIQUID IDEA','FIND THE STRUCTURE','CONNECT THE DOTS','MAKE IT WORK'];
let renderer,scene,camera,group,material,pointsMaterial,wireMaterial,orbitMaterial;
const isLight=()=>document.documentElement.dataset.theme==='light';
function syncTheme(){
  const light=isLight();
  for(const m of [material,wireMaterial,pointsMaterial])if(m)m.uniforms.uLight.value=light?1:0;
  if(pointsMaterial){pointsMaterial.blending=light?THREE.NormalBlending:THREE.AdditiveBlending;pointsMaterial.needsUpdate=true;}
  if(orbitMaterial){orbitMaterial.color.setHex(light?0x386b19:0xc8f663);orbitMaterial.opacity=light?.16:.12;}
  start();
}
window.addEventListener('portfolio-theme-change',syncTheme);
let frame=0,active=true,paused=reduced.matches,progress=0,lastTime=0,rotation=0,dragX=0,dragY=0,lastPhase=-1;
let pointerDown=false,pointerX=0,pointerY=0,destroyed=false,lostContext=false;
const fallback=document.querySelector('#sculpture-fallback');
const fallbackContext=fallback.getContext('2d');
function syncMotion(){motionButton.textContent=paused?'继续自转':'暂停自转';motionButton.setAttribute('aria-pressed',String(paused));}
syncMotion();
function targetProgress(){const box=story.getBoundingClientRect();return THREE.MathUtils.clamp(-box.top/Math.max(1,box.height-stage.clientHeight),0,1);}
function updateCopy(p){const phase=Math.min(3,Math.floor(p*3+.5));if(phase!==lastPhase){lastPhase=phase;document.querySelector('#story-title').innerHTML=titles[phase];document.querySelector('#story-description').innerHTML=descriptions[phase];document.querySelector('#shape-label').textContent=labels[phase];document.querySelectorAll('[data-phase]').forEach(b=>{const selected=Number(b.dataset.phase)===phase;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected));});host.setAttribute('data-phase',String(phase));}document.querySelector('#story-progress-fill').style.transform=`scaleX(${p})`;const headline=document.querySelector('.scene-headline');headline.style.opacity=String(Math.max(0,1-p*7));headline.style.transform=reduced.matches?'none':`translateY(${-p*80}px)`;}
document.querySelectorAll('[data-phase]').forEach(button=>button.addEventListener('click',()=>{const total=story.getBoundingClientRect().height-stage.clientHeight;const top=story.getBoundingClientRect().top+window.scrollY;window.scrollTo({top:top+total*Number(button.dataset.phase)/3,behavior:reduced.matches?'instant':'smooth'});}));
motionButton.addEventListener('click',()=>{paused=!paused;syncMotion();start();});

function buildGeometry(){
  const columns=mobile.matches?96:160,rows=mobile.matches?32:56;
  const positions=[],torus=[],knot=[],cube=[],seeds=[],indices=[],normals=[],torusNormals=[],knotNormals=[],cubeNormals=[];
  const twoPi=Math.PI*2;
  function knotCenter(t){const r=(2+Math.cos(3*t))*.48;return new THREE.Vector3(r*Math.cos(2*t),r*Math.sin(2*t),.48*Math.sin(3*t));}
  for(let y=0;y<=rows;y++)for(let x=0;x<=columns;x++){
    const u=x/columns*twoPi,v=y/rows*twoPi,lat=y/rows*Math.PI;
    const radius=1.36+.065*Math.sin(u*7+lat*4)*Math.sin(lat)**2;
    const sphere=new THREE.Vector3(Math.sin(lat)*Math.cos(u),Math.cos(lat),Math.sin(lat)*Math.sin(u));
    positions.push(sphere.x*radius,sphere.y*radius,sphere.z*radius);
    normals.push(sphere.x,sphere.y,sphere.z);
    const r=1.07+.43*Math.cos(v);torus.push(r*Math.cos(u),r*Math.sin(u),.43*Math.sin(v));
    torusNormals.push(Math.cos(v)*Math.cos(u),Math.cos(v)*Math.sin(u),Math.sin(v));
    const center=knotCenter(u),tangent=knotCenter(u+.001).sub(center).normalize();
    const normal=new THREE.Vector3(0,0,1).cross(tangent).normalize();
    const binormal=tangent.clone().cross(normal).normalize();
    const point=center.addScaledVector(normal,.235*Math.cos(v)).addScaledVector(binormal,.235*Math.sin(v));
    knot.push(point.x,point.y,point.z);
    const knotNormal=normal.clone().multiplyScalar(Math.cos(v)).addScaledVector(binormal,Math.sin(v));
    knotNormals.push(knotNormal.x,knotNormal.y,knotNormal.z);
    const exponent=.22;
    const q=new THREE.Vector3(Math.sign(sphere.x)*Math.pow(Math.abs(sphere.x),exponent),Math.sign(sphere.y)*Math.pow(Math.abs(sphere.y),exponent),Math.sign(sphere.z)*Math.pow(Math.abs(sphere.z),exponent));
    cube.push(q.x*.96,q.y*.96,q.z*.96);
    const cubeNormal=new THREE.Vector3(Math.sign(q.x)*Math.abs(q.x)**(2/exponent-1),Math.sign(q.y)*Math.abs(q.y)**(2/exponent-1),Math.sign(q.z)*Math.abs(q.z)**(2/exponent-1)).normalize();
    cubeNormals.push(cubeNormal.x,cubeNormal.y,cubeNormal.z);
    const seed=Math.sin((x+1)*127.1+(y+1)*311.7)*43758.5453;
    seeds.push(seed-Math.floor(seed));
  }
  for(let y=0;y<rows;y++)for(let x=0;x<columns;x++){const a=y*(columns+1)+x,b=a+columns+1;indices.push(a,a+1,b,b,a+1,b+1);}
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('aTorus',new THREE.Float32BufferAttribute(torus,3));
  geometry.setAttribute('aKnot',new THREE.Float32BufferAttribute(knot,3));
  geometry.setAttribute('aCube',new THREE.Float32BufferAttribute(cube,3));
  geometry.setAttribute('aSeed',new THREE.Float32BufferAttribute(seeds,1));
  geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));
  geometry.setAttribute('aTorusNormal',new THREE.Float32BufferAttribute(torusNormals,3));
  geometry.setAttribute('aKnotNormal',new THREE.Float32BufferAttribute(knotNormals,3));
  geometry.setAttribute('aCubeNormal',new THREE.Float32BufferAttribute(cubeNormals,3));
  geometry.setIndex(indices);geometry.computeBoundingSphere();
  return geometry;
}
const morphFunction=`
attribute vec3 aTorus;
attribute vec3 aKnot;
attribute vec3 aCube;
attribute float aSeed;
uniform float uProgress;
uniform float uTime;
uniform float uExplosion;
vec3 morph(){
  float p=uProgress*3.0;
  float part=fract(p);
  part=part*part*(3.0-2.0*part);
  vec3 point;
  if(p<1.0) point=mix(position,aTorus,part);
  else if(p<2.0) point=mix(aTorus,aKnot,part);
  else point=mix(aKnot,aCube,part);
  if(p>=3.0) point=aCube;
  float ripple=sin(point.y*6.0+uTime*.6)*sin(point.x*5.0-uTime*.3);
  point+=normalize(point+vec3(.0001))*.025*ripple*(1.0-smoothstep(.0,.25,uProgress));
  return point;
}`;
const vertexShader=`${morphFunction}
varying vec3 vWorldPosition;
varying vec3 vSurfaceNormal;
attribute vec3 aTorusNormal;
attribute vec3 aKnotNormal;
attribute vec3 aCubeNormal;
void main(){vec3 p=morph();float stage=uProgress*3.0;float blend=fract(stage);blend=blend*blend*(3.0-2.0*blend);vec3 n;if(stage<1.0)n=mix(normal,aTorusNormal,blend);else if(stage<2.0)n=mix(aTorusNormal,aKnotNormal,blend);else n=mix(aKnotNormal,aCubeNormal,blend);if(stage>=3.0)n=aCubeNormal;vSurfaceNormal=mat3(modelMatrix)*n;p*=1.0+uExplosion*.12;vec4 world=modelMatrix*vec4(p,1.0);vWorldPosition=world.xyz;gl_Position=projectionMatrix*viewMatrix*world;}`;
const fragmentShader=`
uniform float uProgress;
uniform float uExplosion;
uniform float uWire;
uniform float uLight;
varying vec3 vWorldPosition;
varying vec3 vSurfaceNormal;
void main(){
  vec3 n=normalize(vSurfaceNormal);
  vec3 view=normalize(cameraPosition-vWorldPosition);
  if(dot(n,view)<0.0)n=-n;
  vec3 reflection=reflect(-view,n);
  float rim=pow(1.0-abs(dot(n,view)),2.2);
  float strip=.5+.5*sin(reflection.y*7.5+reflection.x*1.8);
  float highlight=smoothstep(.76,.98,strip);
  float soft=pow(max(dot(n,normalize(vec3(-.6,1.0,1.2))),0.0),1.8);
  vec3 silver=mix(mix(vec3(.035,.045,.031),vec3(.075,.09,.06),uLight),vec3(1.05,1.09,.98),highlight);
  silver+=soft*mix(.4,.48,uLight)+rim*mix(.38,.16,uLight);
  vec3 lime=vec3(.64,.92,.17);
  float accent=mix(.18,.06,uLight)+mix(.53,.25,uLight)*smoothstep(.08,.48,uProgress);
  vec3 color=mix(silver,silver*lime,accent);
  color+=lime*rim*mix(.28,.06,uLight);
  if(uWire>.5){color=mix(vec3(.78,.96,.42),vec3(.14,.29,.07),uLight);}
  float alpha=uWire>.5?.14+uExplosion*.1:1.0-uExplosion*.96;
  gl_FragColor=vec4(color,alpha);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
const pointVertex=`${morphFunction}
varying float vAlpha;
uniform float uSize;
void main(){vec3 p=morph();vec3 direction=normalize(vec3(sin(aSeed*73.1),cos(aSeed*125.7),sin(aSeed*217.9)));
  p+=direction*uExplosion*(.4+aSeed*2.5);
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=clamp(uSize*(1.0+aSeed)/(max(.1,-mv.z)),1.0,6.0);
  vAlpha=(.2+aSeed*.8)*(.07+uExplosion*.93);
}`;
const pointFragment=`uniform float uLight;varying float vAlpha;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;float alpha=(1.0-smoothstep(.0,.5,d))*vAlpha;gl_FragColor=vec4(mix(vec3(.78,.97,.46),vec3(.14,.29,.07),uLight),alpha);}`;

function initialize(){
  renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'default'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile.matches?1.4:1.75));
  renderer.setClearColor(0x111311,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.25;
  renderer.debug.checkShaderErrors=true;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.appendChild(renderer.domElement);
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lostContext=true;host.classList.remove('webgl-ready');start();});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{lostContext=false;host.classList.add('webgl-ready');resize();start();});
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(39,1,.1,30);camera.position.set(0,0,5.2);
  group=new THREE.Group();scene.add(group);
  const geometry=buildGeometry();
  const uniforms={uProgress:{value:0},uTime:{value:0},uExplosion:{value:0},uWire:{value:0},uLight:{value:isLight()?1:0}};
  material=new THREE.ShaderMaterial({uniforms,vertexShader,fragmentShader,transparent:true,side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(geometry,material);mesh.frustumCulled=false;group.add(mesh);
  wireMaterial=new THREE.ShaderMaterial({uniforms:{uProgress:{value:0},uTime:{value:0},uExplosion:{value:0},uWire:{value:1},uLight:{value:isLight()?1:0}},vertexShader,fragmentShader,wireframe:true,transparent:true,depthWrite:false});
  const wire=new THREE.Mesh(geometry,wireMaterial);wire.scale.setScalar(1.002);wire.frustumCulled=false;group.add(wire);
  const pointGeometry=geometry.clone();pointGeometry.setIndex(null);
  pointsMaterial=new THREE.ShaderMaterial({uniforms:{uProgress:{value:0},uTime:{value:0},uExplosion:{value:0},uSize:{value:mobile.matches?10:13},uLight:{value:isLight()?1:0}},vertexShader:pointVertex,fragmentShader:pointFragment,transparent:true,depthWrite:false,blending:isLight()?THREE.NormalBlending:THREE.AdditiveBlending});
  const particles=new THREE.Points(pointGeometry,pointsMaterial);particles.frustumCulled=false;group.add(particles);
  // Sparse orbital traces communicate connection without competing with the sculpture.
  orbitMaterial=new THREE.LineBasicMaterial({color:isLight()?0x386b19:0xc8f663,transparent:true,opacity:isLight()?.16:.12});
  for(let k=0;k<2;k++){const vertices=[];for(let i=0;i<=160;i++){const t=i/160*Math.PI*2;vertices.push(Math.cos(t)*1.85,Math.sin(t)*1.85,0);}const ring=new THREE.Line(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(vertices,3)),orbitMaterial);ring.rotation.x=1.05+k*.5;ring.rotation.y=k*.65;group.add(ring);}
  resize();renderer.compile(scene,camera);host.classList.add('webgl-ready');host.setAttribute('data-renderer','webgl');
}
function resize(){const w=host.clientWidth,h=host.clientHeight;if(renderer){renderer.setSize(w,h);camera.aspect=w/h;camera.position.z=w<768?6.2:5.2;camera.updateProjectionMatrix();}fallback.width=Math.round(w*Math.min(devicePixelRatio,1.5));fallback.height=Math.round(h*Math.min(devicePixelRatio,1.5));}
function drawFallback(p,t){if(!fallbackContext)return;const w=host.clientWidth,h=host.clientHeight,ratio=Math.min(devicePixelRatio||1,1.5);fallbackContext.setTransform(ratio,0,0,ratio,0,0);fallbackContext.clearRect(0,0,w,h);const scale=Math.min(w*.43,h*.33);for(let j=0;j<42;j++){fallbackContext.beginPath();for(let i=0;i<=150;i++){const a=i/150*Math.PI*2,b=j/42*Math.PI*2;const r=scale*(.72+.18*Math.cos(b)+.1*Math.sin(a*3+p*12));const x=w*.55+Math.cos(a+t)*r,y=h*.46+Math.sin(a+t)*r*Math.cos(b+p*2);i?fallbackContext.lineTo(x,y):fallbackContext.moveTo(x,y);}fallbackContext.strokeStyle=isLight()?(j%6===0?'rgba(56,107,25,.8)':'rgba(90,113,67,.25)'):(j%6===0?'rgba(200,246,99,.8)':'rgba(207,225,183,.2)');fallbackContext.lineWidth=1;fallbackContext.stroke();}}
function render(time){frame=0;if(destroyed||!active||document.hidden)return;const delta=Math.min((time-lastTime)/1000,.045);lastTime=time;const target=targetProgress();progress=reduced.matches?target:progress+(target-progress)*Math.min(1,delta*10);if(Math.abs(target-progress)<.0001)progress=target;const p=reduced.matches?Math.round(progress*3)/3:progress;updateCopy(progress);if(!paused&&!reduced.matches)rotation+=delta*.12;
  const explosion=reduced.matches?0:Math.sin(Math.max(0,Math.min(1,(p-.65)/.27))*Math.PI)**2;
  if(renderer&&!lostContext){const clock=paused?rotation*5:time*.001;for(const m of [material,wireMaterial,pointsMaterial]){m.uniforms.uProgress.value=p;m.uniforms.uTime.value=clock;m.uniforms.uExplosion.value=explosion;}wireMaterial.visible=p>.12&&p<.8;group.rotation.set(.25+dragY+p*.35,rotation+dragX+p*Math.PI*1.8,.2+Math.sin(p*Math.PI)*.38);group.position.set(mobile.matches?.12:.45,.1,0);const zoom=1.03+.12*Math.sin(p*Math.PI);group.scale.setScalar(zoom);renderer.render(scene,camera);}else drawFallback(p,rotation);
  frame=requestAnimationFrame(render);
}
function start(){if(!frame&&!destroyed&&active&&!document.hidden){lastTime=performance.now();frame=requestAnimationFrame(render);}}
function stop(){cancelAnimationFrame(frame);frame=0;}
host.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;pointerDown=true;pointerX=e.clientX;pointerY=e.clientY;host.setPointerCapture(e.pointerId);});
host.addEventListener('pointermove',e=>{if(!pointerDown)return;dragX+=(e.clientX-pointerX)*.005;dragY+=(e.clientY-pointerY)*.005;pointerX=e.clientX;pointerY=e.clientY;});
host.addEventListener('pointerup',()=>pointerDown=false);host.addEventListener('pointercancel',()=>pointerDown=false);
const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active)start();else stop();});observer.observe(story);
const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(host);
document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
reduced.addEventListener('change',()=>{paused=reduced.matches;syncMotion();start();});
try{initialize();}catch(error){host.setAttribute('data-renderer','canvas');host.classList.remove('webgl-ready');if(renderer)renderer.dispose();renderer=undefined;console.warn('3D rendering unavailable; using the interactive canvas fallback.',error.message);resize();}
updateCopy(0);start();
window.addEventListener('pagehide',e=>{stop();if(e.persisted)return;destroyed=true;observer.disconnect();sizeObserver.disconnect();if(scene)scene.traverse(object=>{object.geometry?.dispose();if(object.material)Array.isArray(object.material)?object.material.forEach(m=>m.dispose()):object.material.dispose();});renderer?.dispose();});
window.addEventListener('pageshow',()=>start());
