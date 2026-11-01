import * as THREE from './js/three.module.min.js';
// Portable projection of the same 3D geometry for browsers without WebGL.
export class CanvasSceneRenderer {
 constructor(){this.domElement=document.createElement('canvas');this.ctx=this.domElement.getContext('2d');if(!this.ctx)throw new Error('Canvas unavailable');this.shadowMap={};this.cache=new WeakMap();this.pixelRatio=1;this.raf=0;this.callback=null;this.toneMappingExposure=1.15;}
 setPixelRatio(value){this.pixelRatio=Math.min(value,1.35)}
 setSize(w,h){this.width=w;this.height=h;this.domElement.width=Math.round(w*this.pixelRatio);this.domElement.height=Math.round(h*this.pixelRatio);this.domElement.style.width=w+'px';this.domElement.style.height=h+'px';}
 setAnimationLoop(callback){cancelAnimationFrame(this.raf);this.callback=callback;if(callback){const tick=t=>{if(!this.callback)return;this.callback(t);this.raf=requestAnimationFrame(tick)};this.raf=requestAnimationFrame(tick)}}
 render(scene,camera){
  const ctx=this.ctx,w=this.width,h=this.height;ctx.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0);ctx.clearRect(0,0,w,h);
  scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);const projection=new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse),triangles=[];
  const light=new THREE.Vector3(-5,12,7).normalize(),night=this.toneMappingExposure<1;
  const center=new THREE.Vector3(0,-1.3,0).applyMatrix4(projection);const shadow=ctx.createRadialGradient(w*(.5+center.x*.5),h*(.5-center.y*.5),0,w*(.5+center.x*.5),h*(.5-center.y*.5),w*.34);shadow.addColorStop(0,'rgba(28,44,26,.19)');shadow.addColorStop(1,'rgba(28,44,26,0)');ctx.save();ctx.translate(w*(.5+center.x*.5),h*(.5-center.y*.5));ctx.scale(1,.28);ctx.translate(-w*(.5+center.x*.5),-h*(.5-center.y*.5));ctx.fillStyle=shadow;ctx.fillRect(0,-h,w,h*4);ctx.restore();
  scene.traverse(mesh=>{if(!mesh.isMesh||!mesh.visible||mesh.material?.isShadowMaterial)return;const material=mesh.material;if(Array.isArray(material))return;
   let cached=this.cache.get(mesh);if(!cached||!cached.matrix.equals(mesh.matrixWorld)){
    const attr=mesh.geometry.attributes.position,verts=[];for(let i=0;i<attr.count;i++)verts.push(new THREE.Vector3().fromBufferAttribute(attr,i).applyMatrix4(mesh.matrixWorld));
    const faces=[],ind=mesh.geometry.index;const length=ind?ind.count:attr.count;for(let i=0;i<length;i+=3){const a=ind?ind.getX(i):i,b=ind?ind.getX(i+1):i+1,c=ind?ind.getX(i+2):i+2;const normal=new THREE.Vector3().subVectors(verts[b],verts[a]).cross(new THREE.Vector3().subVectors(verts[c],verts[a])).normalize();const shade=.55+.42*(material.side===THREE.DoubleSide?Math.abs(normal.dot(light)):Math.max(0,normal.dot(light)));faces.push({a,b,c,shade})}cached={matrix:mesh.matrixWorld.clone(),verts,faces};this.cache.set(mesh,cached);
   }
   const screen=cached.verts.map(v=>{const p=v.clone().applyMatrix4(projection);return{x:(p.x*.5+.5)*w,y:(-p.y*.5+.5)*h,z:p.z}}),colAttr=mesh.geometry.attributes.color;
   for(const f of cached.faces){const a=screen[f.a],b=screen[f.b],c=screen[f.c];if(a.z>1||b.z>1||c.z>1)continue;const area=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);if(area>=0&&material.side!==THREE.DoubleSide&&!material.transparent)continue;if(Math.abs(area)<.03)continue;
    const color=material.color?material.color.clone():new THREE.Color('#728362');if(colAttr)color.setRGB(colAttr.getX(f.a),colAttr.getY(f.a),colAttr.getZ(f.a));color.convertLinearToSRGB();const shade=material.isMeshBasicMaterial?1:f.shade*(night?.72:1.08);const r=Math.min(255,Math.round(color.r*255*shade*(night?1.13:1))),g=Math.min(255,Math.round(color.g*255*shade)),blue=Math.min(255,Math.round(color.b*255*shade*(night?.86:1)));
    triangles.push({a,b,c,z:(a.z+b.z+c.z)/3,fill:`rgba(${r},${g},${blue},${material.opacity??1})`,edge:material.transparent?false:true});
   }
  });
  triangles.sort((a,b)=>b.z-a.z);for(const t of triangles){ctx.beginPath();ctx.moveTo(t.a.x,t.a.y);ctx.lineTo(t.b.x,t.b.y);ctx.lineTo(t.c.x,t.c.y);ctx.closePath();ctx.fillStyle=t.fill;ctx.fill();if(t.edge){ctx.strokeStyle=t.fill;ctx.lineWidth=.45;ctx.stroke()}}
 }
}
