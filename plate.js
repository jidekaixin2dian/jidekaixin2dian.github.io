// The plate is drawn on demand. Rotation never consumes frames while the drawing is at rest.
(() => {
  const canvas = document.querySelector('#plate-canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const plate = document.querySelector('.plate');
  const names = ['Trefoil', 'Torus'];
  const labels = ['三叶结', '圆环'];
  const slices = 156, sides = 32, turn = 2 * Math.PI;
  let shape = 0, yaw = 0.13, pitch = -0.43, drag = null, frame = 0;

  function center(t) {
    if (shape === 1) return [1.3 * Math.cos(t), 1.3 * Math.sin(t), 0];
    const r = 1.08 + 0.48 * Math.cos(3 * t);
    return [r * Math.cos(2 * t), r * Math.sin(2 * t), 0.62 * Math.sin(3 * t)];
  }

  function mesh() {
    const points = [];
    for (let i = 0; i < slices; i++) {
      const t = turn * i / slices, c = center(t), next = center(t + 0.001);
      const tangent = next.map((n, k) => n - c[k]);
      const [x,y,z] = tangent.map(n => n / Math.hypot(...tangent));
      const h = Math.hypot(x,y), nx = -y/h, ny = x/h;
      const radius = shape === 0 ? 0.29 : 0.48;
      for (let j = 0; j < sides; j++) {
        const a = turn * j / sides, cs = Math.cos(a), sn = Math.sin(a);
        points.push([c[0]+radius*(nx*cs-z*ny*sn), c[1]+radius*(ny*cs+z*nx*sn), c[2]+radius*h*sn]);
      }
    }
    return points;
  }

  let points = mesh();
  function draw() {
    frame = 0;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const scale = Math.min(w*0.247,h*0.302);
    const projected = points.map(([x,y,z]) => {
      const u = x*Math.cos(yaw)+z*Math.sin(yaw), v = z*Math.cos(yaw)-x*Math.sin(yaw);
      const vy = y*Math.cos(pitch)-v*Math.sin(pitch), depth = y*Math.sin(pitch)+v*Math.cos(pitch);
      return [w/2+scale*(u*.97-vy*.24), h/2-scale*(u*.24+vy*.97), depth];
    });
    const faces = [];
    for (let i=0; i<slices; i++) {
      for (let j=0; j<sides; j++) {
        const a=projected[i*sides+j], b=projected[((i+1)%slices)*sides+j];
        const c=projected[((i+1)%slices)*sides+(j+1)%sides], d=projected[i*sides+(j+1)%sides];
        faces.push({a,b,c,d,depth:(a[2]+b[2]+c[2]+d[2])/4,i,j});
      }
    }
    faces.sort((a,b)=>a.depth-b.depth);
    ctx.lineJoin = 'round';
    for (const {a,b,c,d,depth,i,j} of faces) {
      const light = Math.min(1,Math.max(0,(depth+1.2)/2.6));
      const fill = 'rgb('+Math.round(24+48*light)+','+Math.round(68+65*light)+','+Math.round(173+69*light)+')';
      ctx.beginPath(); ctx.moveTo(a[0],a[1]); ctx.lineTo(b[0],b[1]); ctx.lineTo(c[0],c[1]); ctx.lineTo(d[0],d[1]); ctx.closePath();
      ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=fill;ctx.lineWidth=.8;ctx.stroke();
      ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(d[0],d[1]);
      ctx.strokeStyle='rgba(225,244,255,'+(.55+.42*light)+')';
      ctx.lineWidth=i%4===0?1.45:0.85;ctx.stroke();
      if(j%4===0){ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineWidth=.65;ctx.stroke();}
    }
    plate.classList.add('drawn');
  }
  function schedule(){if (!frame) frame=requestAnimationFrame(draw);}
  function select(index) {
    shape=index; points=mesh();
    document.querySelector('#plate-number').textContent=index===0?'01':'02'; pitch=shape===0?-.43:-.88;
    document.querySelector('#plate-name').textContent=names[index];
    document.querySelectorAll('[data-shape]').forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
    canvas.setAttribute('aria-label',labels[index]+'三维线稿，使用方向键旋转');
    schedule();
  }
  document.querySelectorAll('[data-shape]').forEach((button,i)=>button.addEventListener('click',()=>select(i)));
  canvas.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag[0])*.012;pitch+=(e.clientY-drag[1])*.012;drag=[e.clientX,e.clientY];schedule();});
  canvas.addEventListener('lostpointercapture',()=>{drag=null;});
  canvas.addEventListener('keydown',e=>{
    const delta={ArrowLeft:[-.15,0],ArrowRight:[.15,0],ArrowUp:[0,-.15],ArrowDown:[0,.15]}[e.key];
    if(delta){e.preventDefault();yaw+=delta[0];pitch+=delta[1];schedule();}
  });
  new ResizeObserver(schedule).observe(canvas);
  window.addEventListener('portfolio-theme-change',schedule);
  schedule();
})();
