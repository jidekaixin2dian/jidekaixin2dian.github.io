import * as THREE from './vendor/three.module.js';

// Different objects and materials, one reversible native-scroll timeline.
export function createJourneyScene(host,getProgress){
  const mobile=matchMedia('(max-width: 767px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const smooth=(a,b,x)=>THREE.MathUtils.smoothstep(x,a,b),mix=THREE.MathUtils.lerp;
  let renderer,scene,camera,frame=0,active=true,paused=reduced.matches,last=0,spin=0,progress=0,mode=0,destroyed=false,lost=false;
  let fps,context,paper,texture,qualitySamples=0,slowSamples=0,adaptive=false;
  const flatSize=new THREE.Vector2(6,3.8),flatCenter=new THREE.Vector2(1,0),textures=[];
  const chromeVertex=`varying vec3 vNormal;varying vec3 vPosition;void main(){vec4 p=modelViewMatrix*vec4(position,1.);vPosition=p.xyz;vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*p;}`;
  const chromeFragment=`uniform float uOpacity;uniform vec3 uTint;varying vec3 vNormal;varying vec3 vPosition;
  void main(){vec3 n=normalize(vNormal);vec3 v=normalize(-vPosition);if(dot(n,v)<0.)n=-n;vec3 r=reflect(-v,n);
    float band=.5+.5*sin(r.y*5.8+r.x*1.9);float edge=max(fwidth(band)*1.5,.008);float strip=smoothstep(.80-edge,.80+edge,band);
    float soft=max(0.,dot(n,normalize(vec3(-.5,1.,.8))));float rim=pow(1.-abs(dot(n,v)),2.4);
    vec3 metal=mix(vec3(.018,.024,.02),vec3(.91,.96,.88),strip);metal+=soft*.14+rim*.2;
    gl_FragColor=vec4(metal*uTint,uOpacity);
    #include <colorspace_fragment>
  }`;
  function chrome(tint=0xffffff){return new THREE.ShaderMaterial({uniforms:{uOpacity:{value:1},uTint:{value:new THREE.Color(tint)}},vertexShader:chromeVertex,fragmentShader:chromeFragment,transparent:true,side:THREE.DoubleSide});}
  function buildFps(){
    const root=new THREE.Group(),machine=new THREE.Group(),metal=chrome(),green=chrome(0xb8f65b),rings=[];
    root.add(machine);scene.add(root);
    for(const [radius,tube] of [[1.65,.14],[1.28,.18],[.89,.12]]){const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,36,192),metal);machine.add(mesh);rings.push(mesh);}
    const core=new THREE.Mesh(new THREE.OctahedronGeometry(.46,0),metal);machine.add(core);
    const finGeometry=new THREE.BoxGeometry(.065,.18,.12);
    for(let i=0;i<40;i++){const a=i/40*Math.PI*2,m=new THREE.Mesh(finGeometry,i%5===0?green:metal);m.position.set(Math.cos(a)*1.65,Math.sin(a)*1.65,0);m.rotation.z=a-Math.PI/2;machine.add(m);}
    const modules=[];
    for(let i=0;i<3;i++){
      const geometry=new THREE.PlaneGeometry(1,1),uv=geometry.attributes.uv;
      for(let j=0;j<uv.count;j++)uv.setX(j,(uv.getX(j)+i)/3);
      const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,opacity:0,side:THREE.DoubleSide});
      const mesh=new THREE.Mesh(geometry,material);root.add(mesh);modules.push(mesh);
    }
    return{root,machine,rings,core,metal,green,modules};
  }
  function buildContext(){
    const root=new THREE.Group(),nodes=[],count=88,geometry=new THREE.OctahedronGeometry(.075,0);
    const linePositions=new Float32Array(8*10*6),lineGeometry=new THREE.BufferGeometry();lineGeometry.setAttribute('position',new THREE.BufferAttribute(linePositions,3));
    const lines=new THREE.LineSegments(lineGeometry,new THREE.LineBasicMaterial({color:0x2448df,transparent:true,opacity:.3}));root.add(lines);
    for(let i=0;i<count;i++){
      const strand=Math.floor(i/11),level=i%11,a=level*.57+strand*Math.PI/4,r=1.1+.28*Math.sin(level/10*Math.PI);
      const initial=new THREE.Vector3(Math.cos(a)*r,(level/10-.5)*3.9,Math.sin(a)*r),selected=i%6===0;
      const material=new THREE.MeshBasicMaterial({color:selected?0x123ff4:0x5d79e8,transparent:true,opacity:1});
      const mesh=new THREE.Mesh(geometry,material);root.add(mesh);nodes.push({mesh,initial,selected,index:i});
    }
    scene.add(root);return{root,nodes,lines,linePositions};
  }
  function paperTexture(title,index){
    const canvas=document.createElement('canvas');canvas.width=512;canvas.height=720;const c=canvas.getContext('2d');
    c.fillStyle='#fff2d8';c.fillRect(0,0,512,720);c.fillStyle='#a84331';c.fillRect(40,43,34,5);
    c.font='20px "JK Text", sans-serif';c.fillText(`0${index+1} / 交接方法`,40,90);c.fillText('结构示意',40,665);
    c.fillStyle='#3d2b22';c.font='600 68px "JK Text", sans-serif';c.fillText(title,36,205);
    c.strokeStyle='#c8b99f';c.lineWidth=2;for(let j=0;j<6;j++){c.beginPath();c.moveTo(40,290+j*47);c.lineTo(j===5?335:470,290+j*47);c.stroke();}
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;textures.push(map);return map;
  }
  function buildPaper(){
    const root=new THREE.Group(),pages=[];
    for(const [i,title] of ['状态','约束','证据','下一步'].entries()){
      const front=new THREE.MeshPhongMaterial({map:paperTexture(title,i),color:0xffffff,shininess:8,transparent:true});
      const edge=new THREE.MeshPhongMaterial({color:0xcabb9b,transparent:true,shininess:4});
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(1.55,2.18,.025),[edge,edge,edge,edge,front,edge]);root.add(mesh);pages.push({mesh,front,edge});
    }
    scene.add(root);return{root,pages};
  }
  function updateFps(p){
    fps.root.visible=mode===0;if(!fps.root.visible)return;
    const open=smooth(.08,.46,p),fade=1-smooth(.46,.69,p),assemble=smooth(.45,.83,p),offset=mobile.matches?0:1.18;
    fps.machine.position.set(offset,mobile.matches?-.5:.03,0);fps.machine.rotation.set(.2,.24+spin*.09*(1-open),-.22);
    fps.machine.scale.setScalar(mobile.matches?.91:1.04);
    fps.rings.forEach((ring,i)=>{ring.rotation.x=[.1,1.12,-.86][i]+open*(i-1)*.65;ring.rotation.y=[.12,-.55,.52][i]+open*(i-1)*1.2;ring.position.y=(i-1)*open*.85;});
    fps.core.rotation.set(spin*.15+.3,spin*.1+.4,open*.8);fps.core.scale.setScalar(1-open*.4);
    for(const material of [fps.metal,fps.green])material.uniforms.uOpacity.value=fade;fps.machine.visible=fade>.001;
    fps.modules.forEach((mesh,i)=>{const local=smooth(0,1,Math.max(0,assemble-(2-i)*.06*(1-assemble))),x=flatCenter.x+(i-1)*flatSize.x/3;
      mesh.position.set(mix(offset+(i-1)*2.3,x,local),mix((i-1)*.8,flatCenter.y,local),(1-local)*(i-1)*.8);
      mesh.rotation.set(0,(1-local)*(i-1)*.8,(1-local)*(i-1)*.16);mesh.scale.set(flatSize.x/3,flatSize.y,1);
      mesh.material.opacity=smooth(.37,.57,p)*(1-smooth(.86,.92,p));mesh.visible=mesh.material.opacity>.001;
    });
  }
  function updateContext(p){
    context.root.visible=mode===1;if(!context.root.visible)return;
    const choose=smooth(.12,.64,p),settle=smooth(.42,.79,p),fade=1-smooth(.77,.91,p),offset=mobile.matches?0:1.18;
    context.root.position.set(offset,mobile.matches?-.5:0,0);context.root.rotation.y=spin*.08*(1-choose);let selected=0;
    for(const node of context.nodes){const {mesh,initial,index}=node,a=index*2.39996;
      if(node.selected){const j=selected++,x=(j%4-1.5)*.55,y=(1.5-Math.floor(j/4))*.55;
        mesh.position.set(mix(initial.x,x,settle),mix(initial.y,y,settle),mix(initial.z,0,settle));mesh.material.opacity=fade;mesh.scale.setScalar(mix(1,2.2,settle));
      }else{mesh.position.copy(initial).multiplyScalar(1+choose*.8);mesh.position.x+=Math.cos(a)*choose*.75;mesh.material.opacity=(1-smooth(.24,.64,p))*fade;}
      mesh.rotation.set(index*.13+p,index*.2+p*.5,0);mesh.visible=mesh.material.opacity>.004;
    }
    let at=0;for(let strand=0;strand<8;strand++)for(let j=0;j<10;j++){for(const i of [strand*11+j,strand*11+j+1]){const v=context.nodes[i].mesh.position;context.linePositions[at++]=v.x;context.linePositions[at++]=v.y;context.linePositions[at++]=v.z;}}
    context.lines.geometry.attributes.position.needsUpdate=true;context.lines.material.opacity=.32*(1-smooth(.2,.64,p))*fade;
  }
  function updatePaper(p){
    paper.root.visible=mode===2;if(!paper.root.visible)return;
    const open=smooth(.1,.46,p),stack=smooth(.49,.84,p),fade=1-smooth(.81,.93,p),offset=mobile.matches?0:1.18;
    paper.root.rotation.y=Math.sin(spin*.12)*.035*(1-open);
    paper.pages.forEach(({mesh,front,edge},i)=>{const centered=i-1.5,fanX=offset+centered*.22,spreadX=offset+centered*(mobile.matches?.64:.88);
      mesh.position.set(mix(mix(fanX,spreadX,open),flatCenter.x+centered*.055,stack),mix((mobile.matches?-.85:0)+centered*.11,flatCenter.y+centered*.045,stack),mix(i*.22,centered*.035,stack));
      mesh.rotation.set((1-stack)*Math.sin(open*Math.PI)*-.18,mix(-.34,0,open)*(1-stack),mix(centered*.18,-.035,open)*(1-stack));
      const scale=mix(mobile.matches?.95:1.13,Math.min(flatSize.x/1.55,flatSize.y/2.18),stack);mesh.scale.setScalar(scale);front.opacity=fade;edge.opacity=fade;mesh.visible=fade>.001;
    });
  }
  function resize(){
    if(!renderer||lost)return;const w=host.clientWidth,h=host.clientHeight,aspect=w/h;
    camera.left=-3*aspect;camera.right=3*aspect;camera.top=3;camera.bottom=-3;camera.updateProjectionMatrix();renderer.setSize(w,h);
    const rect=document.querySelector('#outcome-visual').getBoundingClientRect(),box=host.getBoundingClientRect();
    flatSize.set(rect.width/w*6*aspect,rect.height/h*6);flatCenter.set(((rect.left-box.left+rect.width/2)/w-.5)*6*aspect,(.5-(rect.top-box.top+rect.height/2)/h)*6);wake();
  }
  function draw(now){
    frame=0;if(!active||document.hidden||destroyed)return;
    const raw=(now-last)/1000,dt=Math.max(0,Math.min(raw,.045));last=now;const target=getProgress();
    progress=reduced.matches?target:progress+(target-progress)*Math.min(1,dt*18);if(Math.abs(target-progress)<.0001)progress=target;
    if(!paused&&!reduced.matches&&progress<.45)spin+=dt;
    const p=reduced.matches?(progress<.18?0:progress<.48?.42:progress<.82?.78:1):progress;
    if(renderer&&!lost){updateFps(p);updateContext(p);updatePaper(p);scene.userData.progress=p;renderer.render(scene,camera);
      if(!adaptive&&raw>0){qualitySamples++;if(raw>.04)slowSamples++;if(qualitySamples>=90){if(slowSamples>45){adaptive=true;renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.25));resize();host.dataset.quality='adaptive';}qualitySamples=0;slowSamples=0;}}
    }
    host.dataset.progress=progress.toFixed(4);const moving=Math.abs(target-progress)>.0001||Boolean(renderer&&!lost&&!paused&&!reduced.matches&&progress<.45);
    host.dataset.renderState=moving?'running':'idle';if(moving&&!frame)frame=requestAnimationFrame(draw);
  }
  function wake(){if(!frame&&active&&!document.hidden&&!destroyed){last=performance.now();frame=requestAnimationFrame(draw);}}
  function stop(){cancelAnimationFrame(frame);frame=0;host.dataset.renderState='inactive';}
  try{
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile.matches?1.6:2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
    scene=new THREE.Scene();camera=new THREE.OrthographicCamera(-5,5,3,-3,.1,30);camera.position.z=10;
    texture=new THREE.TextureLoader().load('./fps-v030-dark.webp',wake);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());textures.push(texture);
    fps=buildFps();context=buildContext();paper=buildPaper();scene.add(new THREE.AmbientLight(0xfff4df,2.1));const light=new THREE.DirectionalLight(0xffffff,2.5);light.position.set(-3,4,7);scene.add(light);
    host.append(renderer.domElement);host.dataset.renderer='webgl';
    renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost=true;host.dataset.renderer='fallback';stop();});
    renderer.domElement.addEventListener('webglcontextrestored',()=>{lost=false;host.dataset.renderer='webgl';resize();});resize();
  }catch(error){renderer?.dispose();renderer=null;host.dataset.renderer='fallback';console.warn('3D unavailable; project content and scroll controls remain available.',error.message);}
  const observer=new IntersectionObserver(([entry])=>{active=entry.isIntersecting;active?wake():stop();});observer.observe(host.parentElement);
  const sizeObserver=new ResizeObserver(resize);sizeObserver.observe(host);document.addEventListener('visibilitychange',()=>document.hidden?stop():wake());
  reduced.addEventListener('change',()=>{paused=reduced.matches;wake();});window.addEventListener('pageshow',wake);
  window.addEventListener('pagehide',e=>{stop();if(e.persisted)return;destroyed=true;observer.disconnect();sizeObserver.disconnect();
    const geometries=new Set(),materials=new Set();scene?.traverse(o=>{if(o.geometry)geometries.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:o.material?[o.material]:[])materials.add(m);});
    geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer?.dispose();
  });
  return{wake,resize,setMode(value){if(mode!==value)progress=getProgress();mode=value;host.dataset.scene=['mechanical','information','paper'][mode];wake();},setPaused(value){paused=value;wake();},isReduced:()=>reduced.matches};
}
