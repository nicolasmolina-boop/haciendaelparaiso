import * as THREE from './js/three.module.min.js';
import { CanvasSceneRenderer } from './scene-canvas.js';

export function createWorld(host, places, onSelect, reducedMotion=false){
 let renderer;
 const probe=document.createElement('canvas');const gl=probe.getContext('webgl2');
 if(gl){gl.getExtension('WEBGL_lose_context')?.loseContext();renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'})}else{renderer=new CanvasSceneRenderer()}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.75));
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 host.appendChild(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
 const scene=new THREE.Scene(),world=new THREE.Group();scene.add(world);
 const camera=new THREE.PerspectiveCamera(37,1,.1,120);
 const ambient=new THREE.HemisphereLight(0xfff5dd,0x445c42,2.5);scene.add(ambient);
 const sun=new THREE.DirectionalLight(0xffedcd,4.5);sun.position.set(-5,12,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-10,right:10,top:10,bottom:-10,near:.5,far:35});sun.shadow.bias=-.0015;scene.add(sun);
 const rim=new THREE.DirectionalLight(0xa0c8b9,1.1);rim.position.set(5,4,-8);scene.add(rim);
 const mat=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.85,...extra});
 const bark=mat('#876848'),leaf=[mat('#355a3a'),mat('#446c42'),mat('#52784a'),mat('#64834b')],wood=mat('#bd9463'),wall=mat('#f4e9cf'),roof=mat('#a85f43'),pathMat=mat('#cfc2a0'),soil=mat('#806a48'),darkSoil=mat('#514c33'),water=mat('#6eaa9c',{roughness:.22,metalness:.25});
 const add=(geometry,material,x,y,z,parent=world)=>{const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m};
 const box=(w,h,d,m,x,y,z,parent=world)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
 const cylinder=(r1,r2,h,m,x,y,z,segments=32)=>add(new THREE.CylinderGeometry(r1,r2,h,segments),m,x,y,z);
 const height=(x,z)=>.18+.10*Math.sin(x*.55)+.14*Math.cos(z*.7)+Math.max(0,-z-1)*.18;
 // A handcrafted island represents the hacienda's themes, not its physical survey.
 const N=80,rings=18,positions=[],colors=[],indices=[];const c=new THREE.Color();
 for(let r=0;r<=rings;r++){for(let j=0;j<=N;j++){const a=j/N*Math.PI*2,edge=1+.035*Math.sin(a*5)+.025*Math.cos(a*3),rr=r/rings;const x=Math.cos(a)*6.3*rr*edge,z=Math.sin(a)*4.8*rr*edge;positions.push(x,height(x,z),z);c.setHSL(.22+.015*Math.sin(x+z),.22,.43+.04*Math.sin(x*.8)*Math.cos(z));colors.push(c.r,c.g,c.b)}}
 for(let r=0;r<rings;r++)for(let j=0;j<N;j++){const a=r*(N+1)+j,b=a+N+1;indices.push(a,b,a+1,b,b+1,a+1)}
 const ground=new THREE.BufferGeometry();ground.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));ground.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));ground.setIndex(indices);ground.computeVertexNormals();add(ground,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}),0,0,0);
 const sidePos=[],sideIdx=[];for(let j=0;j<=N;j++){const a=j/N*Math.PI*2,edge=1+.035*Math.sin(a*5)+.025*Math.cos(a*3),x=Math.cos(a)*6.3*edge,z=Math.sin(a)*4.8*edge;sidePos.push(x,height(x,z)-.015,z,x*.94,-.85,z*.94,x*.86,-1.14,z*.86)}for(let j=0;j<N;j++){let a=j*3;sideIdx.push(a,a+3,a+1,a+1,a+3,a+4,a+1,a+4,a+2,a+2,a+4,a+5)}const side=new THREE.BufferGeometry();side.setAttribute('position',new THREE.Float32BufferAttribute(sidePos,3));side.setIndex(sideIdx);side.computeVertexNormals();add(side,soil,0,0,0);
 const base=cylinder(5.8,5.45,.16,mat('#c6bea0'),0,-1.2,0,80);base.scale.z=.77;
 const shadow=add(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.16}),0,-1.35,0,scene);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;
 // Footpaths and round garden.
 const trail=(points,width=.21)=>{const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,height(x,z)+.13,z)));const m=add(new THREE.TubeGeometry(curve,70,width,6,false),pathMat,0,0,0);};
 trail([[-5,3.5],[-2,2.7],[.3,1.65],[2,.3],[3,-.3],[3,-2]]);
 trail([[.3,1.65],[.2,-.4],[-1,-2.6],[-3,-2.8]],.14);
 const gardenY=height(.3,1.6);cylinder(1.35,1.35,.09,pathMat,.3,gardenY+.04,1.6,64);
 cylinder(1.06,1.06,.10,mat('#7c925a'),.3,gardenY+.1,1.6,64);
 const ring=add(new THREE.TorusGeometry(.83,.075,8,64),pathMat,.3,gardenY+.17,1.6);ring.rotation.x=Math.PI/2;
 cylinder(.43,.47,.2,wall,.3,gardenY+.22,1.6);cylinder(.36,.36,.03,water,.3,gardenY+.33,1.6);
 cylinder(.05,.08,.36,wall,.3,gardenY+.49,1.6);cylinder(.2,.15,.05,wall,.3,gardenY+.68,1.6);
 for(let i=0;i<22;i++){const a=i/22*Math.PI*2,x=.3+Math.cos(a)*1.1,z=1.6+Math.sin(a)*1.1;add(new THREE.IcosahedronGeometry(.12,0),i%3===0?mat('#d9c78a'):leaf[2],x,gardenY+.2,z)}
 // Cultivated beds, with individual plants.
 const cropMaterials=[mat('#86a34d'),mat('#a7bd65'),mat('#658848'),mat('#73606d')];
 for(let row=0;row<6;row++){const x=-4.2+row*.44;box(.31,.08,2.4,darkSoil,x,height(x,1.3)+.04,1.3);for(let col=0;col<12;col++){const z=.2+col*.2;const crop=add(new THREE.IcosahedronGeometry(.115,0),cropMaterials[row%4],x,height(x,z)+.17,z);crop.scale.set(1,.65,1)}}
 // Greenhouse with clear pitched roof and fine timber ribs.
 const gh=new THREE.Group();gh.position.set(-3.25,height(-3.25,-1.3),-1.3);world.add(gh);
 const glass=mat('#cce3d7',{transparent:true,opacity:.4,roughness:.25,metalness:.1,depthWrite:false});
 box(2.3,.1,1.4,pathMat,0,.06,0,gh);box(2.2,.65,1.3,glass,0,.42,0,gh);
 for(const s of [-1,1]){const m=box(2.3,.025,.92,glass,0,.94,s*.32,gh);m.rotation.x=s*.67;}
 for(let k=0;k<6;k++){const x=-1.1+k*.44;for(const s of [-1,1]){box(.025,.76,.025,wall,x,.42,s*.67,gh);const r=box(.025,.025,.9,wall,x,.94,s*.32,gh);r.rotation.x=s*.67}box(.03,.03,1.35,wall,x,.79,0,gh)}
 for(let k=0;k<3;k++)box(1.95,.12,.2,cropMaterials[k],0,.18,-.4+k*.4,gh);
 // Covered terrace and a small solar-powered roof.
 const house=new THREE.Group();house.position.set(3,height(3,-.5),-.5);world.add(house);
 box(2.7,.16,1.9,pathMat,0,.08,0,house);box(1.25,.9,1.65,wall,.62,.6,0,house);
 for(let x=-1.2;x<=0;x+=.6)for(const z of [-.85,.85])box(.07,1.25,.07,wood,x,.77,z,house);
 for(const s of [-1,1]){const m=box(3.1,.12,1.24,roof,0,1.47,s*.48,house);m.rotation.x=s*.46;}
 for(let i=0;i<9;i++)for(const s of [-1,1]){const m=box(.025,.035,1.22,mat('#c18057'),-1.4+i*.35,1.55,s*.49,house);m.rotation.x=s*.46;}
 box(.38,.6,.04,mat('#456660'),.65,.61,.84,house);box(.04,.42,.6,mat('#456660'),1.26,.75,0,house);
 const solar=mat('#294455',{roughness:.3,metalness:.5});for(let i=0;i<3;i++){const p=box(.42,.025,.6,solar,-.2+i*.48,1.59,.44,house);p.rotation.x=.46;}
 for(let i=0;i<2;i++){box(.55,.07,.45,wood,-.8,.55,-.42+i*.8,house);box(.08,.45,.08,wood,-.8,.3,-.42+i*.8,house)}
 // Pine forest around the cultivated clearing.
 const pine=(x,z,scale=1)=>{const y=height(x,z);cylinder(.055*scale,.085*scale,.7*scale,bark,x,y+.35*scale,z,6);for(let level=0;level<3;level++)add(new THREE.ConeGeometry((.45-level*.085)*scale,(.9-level*.05)*scale,7),leaf[(Math.floor((x+z)*5)%4+4)%4],x,y+(.8+level*.35)*scale,z)};
 for(let i=0;i<33;i++){const a=Math.PI+(i/32)*Math.PI,x=Math.cos(a)*5.3,z=Math.sin(a)*3.7;pine(x+.15*Math.sin(i*8),z, .9+.35*((i*17)%9)/9)}
 [[-5,1],[-5.35,2],[-4.8,-2.4],[-1.8,-3.4],[.1,-3.6],[1,-2.9],[2,-3.5],[4.8,1.9],[5.2,1],[4.4,2.8],[3.9,3.5],[2.9,3.7]].forEach(([x,z],i)=>pine(x,z,.85+(i%4)*.1));
 const stone=mat('#a9ab92');for(let i=0;i<22;i++){const a=i/22*Math.PI*2,x=Math.cos(a)*5.8,z=Math.sin(a)*4.3;const m=add(new THREE.IcosahedronGeometry(.19+(i%3)*.04,0),stone,x,height(x,z)+.08,z);m.scale.set(1.5,.6,.8);m.rotation.y=i;}
 // Warm terrace lamps appear when the visitor switches to sunset.
 const lanternMaterial=new THREE.MeshStandardMaterial({color:0xf4e4bd,emissive:0xffb75d,emissiveIntensity:0});
 for(let i=0;i<5;i++)add(new THREE.SphereGeometry(.065,8,6),lanternMaterial,1.8+i*.55,height(3,-.5)+1.15,.42);
 const glow=new THREE.PointLight(0xffbd73,0,6,2);glow.position.set(2.7,2,0);world.add(glow);
 const marker=add(new THREE.TorusGeometry(.55,.035,8,48),new THREE.MeshBasicMaterial({color:'#e9cb7d',transparent:true,opacity:.9}),0,0,0);marker.rotation.x=-Math.PI/2;marker.visible=false;
 const hotspots=document.getElementById('world-hotspots');const hotspotButtons={};
 Object.entries(places).forEach(([key,p],i)=>{const button=document.createElement('button');button.type='button';button.className='world-pin';button.dataset.worldPlace=key;button.setAttribute('aria-label','Explorar '+({'cultivos':'los cultivos','jardin':'el jardín','terraza':'la terraza','bosque':'el bosque'}[key]));button.setAttribute('aria-pressed','false');button.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span>`;hotspots.appendChild(button);hotspotButtons[key]=button});
 let angle=.7,elevation=.78,distance=20,goalAngle=angle,goalElevation=elevation,goalDistance=distance,visible=true,drag=null,selected=null,night=false,dirty=true,lastTime=0;
 const minDistance=13,maxDistance=27;
 function resize(){const r=host.getBoundingClientRect();if(r.width<1||r.height<1)return;renderer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.zoom=Math.min(1,camera.aspect/1.25);camera.updateProjectionMatrix();dirty=true;}
 new ResizeObserver(resize).observe(host);resize();
 function render(time=0){if(!visible||document.hidden)return;if(time-lastTime<28)return;lastTime=time;
  const moving=Math.abs(goalAngle-angle)+Math.abs(goalElevation-elevation)+Math.abs(goalDistance-distance)>.002;
  if(!moving&&!dirty)return;const mix=reducedMotion?1:.09;angle+=(goalAngle-angle)*mix;elevation+=(goalElevation-elevation)*mix;distance+=(goalDistance-distance)*mix;
  camera.position.set(Math.sin(angle)*Math.cos(elevation)*distance,Math.sin(elevation)*distance,Math.cos(angle)*Math.cos(elevation)*distance);camera.lookAt(0,.2,0);camera.updateMatrixWorld();
  for(const [key,p] of Object.entries(places)){const v=new THREE.Vector3(...p.position).project(camera);const b=hotspotButtons[key];b.style.left=`${(v.x*.5+.5)*host.clientWidth}px`;b.style.top=`${(-v.y*.5+.5)*host.clientHeight}px`;b.style.visibility=(v.z<1&&Math.abs(v.x)<.95&&Math.abs(v.y)<.93)?'visible':'hidden';}
  renderer.render(scene,camera);dirty=false;
 }
 renderer.setAnimationLoop(render);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;dirty=true;renderer.setAnimationLoop(visible?render:null)},{threshold:.02}).observe(host);
 document.addEventListener('visibilitychange',()=>{dirty=true;renderer.setAnimationLoop(!document.hidden&&visible?render:null)});
 host.addEventListener('pointerdown',e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};host.setPointerCapture(e.pointerId);host.classList.add('dragging')});
 host.addEventListener('pointermove',e=>{if(!drag)return;goalAngle-=(e.clientX-drag.x)*.009;goalElevation=THREE.MathUtils.clamp(goalElevation+(e.clientY-drag.y)*.005,.4,1.15);drag={x:e.clientX,y:e.clientY};dirty=true});
 const end=()=>{drag=null;host.classList.remove('dragging')};host.addEventListener('pointerup',end);host.addEventListener('pointercancel',end);
 const control=kind=>{if(kind==='left')goalAngle-=.45;if(kind==='right')goalAngle+=.45;if(kind==='in')goalDistance=Math.max(minDistance,goalDistance-2);if(kind==='out')goalDistance=Math.min(maxDistance,goalDistance+2);if(kind==='reset'){goalAngle=.7;goalElevation=.78;goalDistance=20;}dirty=true};
 host.addEventListener('keydown',e=>{const keys={ArrowLeft:'left',ArrowRight:'right','+':'in','=':'in','-':'out',Home:'reset'};if(keys[e.key]){e.preventDefault();control(keys[e.key])}if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();goalElevation=THREE.MathUtils.clamp(goalElevation+(e.key==='ArrowUp'?.12:-.12),.4,1.15);dirty=true}});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.setAnimationLoop(null);document.getElementById('world-fallback').hidden=false;hotspots.hidden=true;document.querySelectorAll('[data-world-control]').forEach(b=>b.disabled=true)});
 return {control,focus(key){const p=places[key];selected=key;goalAngle=p.angle;goalDistance=17.5;goalElevation=.77;marker.position.set(p.position[0],height(p.position[0],p.position[2])+.1,p.position[2]);marker.visible=true;dirty=true},light(value){night=value;ambient.intensity=night?1.3:2.5;ambient.color.set(night?0xb5c1d1:0xfff5dd);sun.color.set(night?0xffa86d:0xffedcd);sun.intensity=night?2.2:4.5;sun.position.set(night?-10:-5,night?5:12,7);lanternMaterial.emissiveIntensity=night?2:0;glow.intensity=night?5:0;renderer.toneMappingExposure=night?.95:1.15;dirty=true}};
}
