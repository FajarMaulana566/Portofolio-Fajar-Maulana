// Event-driven 3D perspective on original photography, not an invented hardware model.
export function attachDepth(stages,signal){
 for(const stage of stages){let x=-5,y=8,raf;const stack=stage.querySelector('.robot-stack');
  const draw=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{stack.style.setProperty('--rx',x+'deg');stack.style.setProperty('--ry',y+'deg');});};
  const reset=()=>{x=-5;y=8;draw();};
  stage.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=stage.getBoundingClientRect();x=-(e.clientY-r.top-r.height/2)/r.height*10;y=(e.clientX-r.left-r.width/2)/r.width*14;draw();},{signal});
  stage.addEventListener('pointerleave',reset,{signal});
  stage.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key))return;e.preventDefault();if(e.key==='Home'){reset();return;}if(e.key==='ArrowLeft')y-=3;if(e.key==='ArrowRight')y+=3;if(e.key==='ArrowUp')x-=3;if(e.key==='ArrowDown')x+=3;x=Math.max(-12,Math.min(12,x));y=Math.max(-15,Math.min(15,y));draw();},{signal});
  stage.parentElement.querySelector('[data-depth-reset]')?.addEventListener('click',reset,{signal});
  signal.addEventListener('abort',()=>cancelAnimationFrame(raf),{once:true});
 }
}
