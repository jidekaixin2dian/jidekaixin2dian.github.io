import * as THREE from './vendor/three.module.js';

// One surface becomes an open structure, then a flat product. Scroll owns time.
export function createJourneyScene(host, getProgress) {
  const mobile=matchMedia('(max-width: 767px)'), reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let renderer,scene,camera,surface,material,frame=0,active=true,paused=reduced.matches,last=0,spin=0,progress=0,mode=0,destroyed=false,lost=false;
  const uniforms={uProgress:{value:0},uTime:{value:0},uMode:{value:0},uMobile:{value:mobile.matches?1:0},uFlatSize:{value:new THREE.Vector2(6,3.8)},uFlatCenter:{value:new THREE.Vector2(1,0)},uTexture:{value:null}};
  function geometry(){
    const positions=[],opens=[],normals=[],uvs=[],centers=[],indices=[];
    const columns=12,rows=8,steps=mobile.matches?5:8;
    for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
      const offset=positions.length/3,cu=(col+.5)/columns,cv=(row+.5)/rows,theta=cu*Math.PI*2,phi=cv*Math.PI;
      for(let j=0;j<=steps;j++)for(let i=0;i<=steps;i++){
        const u=(col+i/steps)/columns,v=(row+j/steps)/rows,a=u*Math.PI*2,b=v*Math.PI;
        const r=1.97+.14*Math.sin(a*3+b*2)*Math.sin(b)**2;
        const n=new THREE.Vector3(Math.sin(b)*Math.cos(a),Math.cos(b),Math.sin(b)*Math.sin(a));
        positions.push(n.x*r,n.y*r,n.z*r);normals.push(n.x,n.y,n.z);
        // A slightly separated set of ribbons retains the same piece identities.
        opens.push(Math.sin(theta)*2.1+(u-cu)*6.3*Math.cos(theta),(.5-cv)*3.25+(.5-(v-cv+.5))*2.5,Math.cos(theta)*1.45-(u-cu)*6.3*Math.sin(theta));
        uvs.push(u,1-v);centers.push(cu,cv);
      }
      for(let j=0;j<steps;j++)for(let i=0;i<steps;i++){const a=offset+j*(steps+1)+i,b=a+steps+1;indices.push(a,a+1,b,a+1,b+1,b);}
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setAttribute('aOpen',new THREE.Float32BufferAttribute(opens,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setAttribute('aCenter',new THREE.Float32BufferAttribute(centers,2));g.setIndex(indices);return g;
  }
  const vertex=`attribute vec3 aOpen;attribute vec2 aCenter;
  uniform float uProgress;uniform float uTime;uniform float uMode;uniform float uMobile;uniform vec2 uFlatSize;uniform vec2 uFlatCenter;
  varying vec3 vNormal;varying vec3 vPosition;varying vec2 vUv;
  mat3 ry(float a){return mat3(cos(a),0.,-sin(a),0.,1.,0.,sin(a),0.,cos(a));}
  void main(){
    float opening=smoothstep(.10,.47,uProgress),assembling=smoothstep(.47,.85,uProgress);
    float angle=uTime*.12*(1.-opening)+.35;
    vec3 sphere=ry(angle)*position;sphere.y+=.055*sin(position.x*4.+uTime*.5)*(1.-opening);
    vec3 opened=aOpen;
    if(uMode>.5&&uMode<1.5){opened.x*=.85;opened.y+=sin(aCenter.x*6.283)*.6;opened.z+=cos(aCenter.y*6.283)*.5;}
    if(uMode>1.5){opened=vec3((uv.x-.5)*3.7,(uv.y-.5)*2.8,(floor(aCenter.y*3.)-1.)*.9);opened.x+=(floor(aCenter.y*3.)-1.)*.5;}
    opened=ry(-.25+opening*.32)*opened;
    vec3 p=mix(sphere,opened,opening);
    p.xy+=vec2(mix(1.2,0.,uMobile),mix(.08,-.15,uMobile));
    vec3 target=vec3((uv-.5)*uFlatSize+uFlatCenter,0.);
    float stagger=(aCenter.x*.08+(1.-aCenter.y)*.04)*(1.-assembling);
    float assembly=smoothstep(0.,1.,clamp(assembling-stagger,0.,1.));
    p=mix(p,target,assembly);
    vec3 n=mix(ry(angle)*normal,normalize(vec3(sin(aCenter.x*6.283),0.,cos(aCenter.x*6.283))),opening);
    n=mix(n,vec3(0.,0.,1.),assembly);vNormal=normalize(n);vPosition=p;vUv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
  }`;
  const fragment=`uniform float uProgress;uniform float uMode;uniform sampler2D uTexture;varying vec3 vNormal;varying vec3 vPosition;varying vec2 vUv;
  void main(){vec3 n=normalize(vNormal);vec3 view=normalize(cameraPosition-vPosition);if(dot(n,view)<0.)n=-n;
    vec3 reflection=reflect(-view,n);float band=.5+.5*sin(reflection.y*8.+reflection.x*2.1);float light=smoothstep(.66,.97,band);
    float rim=pow(1.-abs(dot(n,view)),2.5);float soft=pow(max(dot(n,normalize(vec3(-.7,1.,1.))),0.),1.7);
    vec3 silver=mix(vec3(.027,.037,.025),vec3(.91,.96,.86),light)+soft*.35+rim*.19;
    silver=mix(silver,silver*vec3(.72,.9,.51),.15+smoothstep(.2,.5,uProgress)*.18);
    vec3 ui=texture2D(uTexture,vUv).rgb;
    float picture=(1.-step(.5,uMode))*smoothstep(.52,.83,uProgress);
    vec3 color=mix(silver,ui,picture);float alpha=1.-smoothstep(.88,.96,uProgress);
    gl_FragColor=vec4(color,alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;
  function resize(){
    if(!renderer||lost)return;const w=host.clientWidth,h=host.clientHeight,aspect=w/h;
    camera.left=-3*aspect;camera.right=3*aspect;camera.top=3;camera.bottom=-3;camera.updateProjectionMatrix();
    renderer.setSize(w,h);uniforms.uMobile.value=mobile.matches?1:0;
    const rect=document.querySelector('#outcome-visual').getBoundingClientRect(),box=host.getBoundingClientRect();
    uniforms.uFlatSize.value.set(rect.width/w*6*aspect,rect.height/h*6);
    uniforms.uFlatCenter.value.set(((rect.left-box.left+rect.width/2)/w-.5)*6*aspect,(.5-(rect.top-box.top+rect.height/2)/h)*6);
    wake();
  }
  function draw(now){
    frame=0;if(!active||document.hidden||destroyed)return;
    const dt=Math.max(0,Math.min((now-last)/1000,.045));last=now;const target=getProgress();
    progress=reduced.matches?target:progress+(target-progress)*Math.min(1,dt*13);if(Math.abs(target-progress)<.0001)progress=target;
    if(!paused&&!reduced.matches&&progress<.42)spin+=dt;
    const visualProgress=reduced.matches?(progress<.18?0:progress<.48?.42:progress<.82?.78:1):progress;
    uniforms.uProgress.value=visualProgress;uniforms.uTime.value=spin;uniforms.uMode.value=mode;
    if(renderer&&!lost)renderer.render(scene,camera);
    host.dataset.progress=progress.toFixed(4);
    const moving=Math.abs(target-progress)>.0001||Boolean(renderer&&!lost&&!paused&&!reduced.matches&&progress<.42);
    host.dataset.renderState=moving?'running':'idle';if(moving)frame=requestAnimationFrame(draw);
  }
  function wake(){if(!frame&&active&&!document.hidden&&!destroyed){last=performance.now();frame=requestAnimationFrame(draw);}}
  function stop(){cancelAnimationFrame(frame);frame=0;host.dataset.renderState='inactive';}
  try{
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile.matches?1.5:2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
    scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-5,5,3,-3,.1,30);camera.position.z=10;
    const texture=new THREE.TextureLoader().load('./fps-v030-dark.webp',wake);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());uniforms.uTexture.value=texture;
    material=new THREE.ShaderMaterial({uniforms,vertexShader:vertex,fragmentShader:fragment,side:THREE.DoubleSide,transparent:true});
    surface=new THREE.Mesh(geometry(),material);surface.frustumCulled=false;scene.add(surface);host.append(renderer.domElement);host.dataset.renderer='webgl';
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;host.dataset.renderer='fallback';stop();});
    renderer.domElement.addEventListener('webglcontextrestored',()=>{lost=false;host.dataset.renderer='webgl';resize();});resize();
  }catch(error){renderer?.dispose();renderer=null;host.dataset.renderer='fallback';console.warn('Sculpture unavailable; the scroll experience and project details remain available.',error.message);}
  const observer=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;active?wake():stop();});observer.observe(host.parentElement);
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(host);document.addEventListener('visibilitychange',()=>document.hidden?stop():wake());
  reduced.addEventListener('change',()=>{paused=reduced.matches;wake();});window.addEventListener('pageshow',wake);
  window.addEventListener('pagehide',e=>{stop();if(e.persisted)return;destroyed=true;observer.disconnect();sizeObserver.disconnect();surface?.geometry.dispose();material?.dispose();uniforms.uTexture.value?.dispose();renderer?.dispose();});
  return {wake,resize,setMode(value){mode=value;wake();},setPaused(value){paused=value;wake();},isReduced:()=>reduced.matches};
}
