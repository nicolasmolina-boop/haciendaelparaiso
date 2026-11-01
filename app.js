'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const products=[
 {id:'albahaca',name:'Albahacas',category:'Hierbas',unit:'libra',image:'producto-hierbas',description:'Genovesa, thai, limón y anís. Indica la variedad en las notas.'},
 {id:'arugula',name:'Arúgula',category:'Hierbas',unit:'libra',image:'galeria-6',description:'Hoja picante y fresca para ensaladas y pizzas.'},
 {id:'romero',name:'Romero',category:'Hierbas',unit:'libra',image:'galeria-5',description:'Aromático y resistente, para carnes y panes.'},
 {id:'menta',name:'Menta y hierba buena',category:'Hierbas',unit:'libra',image:'galeria-3',description:'Para bebidas, infusiones y cocina. Indica cuál en las notas.'},
 {id:'lechuga',name:'Lechuga de hoja',category:'Hojas',unit:'libra',image:'producto-lechugas',description:'Hoja nueva u hoja grande, cosechada el día de la entrega.'},
 {id:'mix',name:'Mix de ensalada',category:'Hojas',unit:'libra',image:'producto-hortalizas',description:'Mix clásico o gourmet (escarola roja y verde, romana roja y verde).'},
 {id:'espinaca',name:'Espinaca de Castilla',category:'Hojas',unit:'libra',image:'galeria-4',description:'Hoja tierna para cocinar o en ensalada.'}
];
const gallery=[
 {image:'hero',label:'Cultivos entre pinos'},
 {image:'historia',label:'El jardín y la vista al valle'},
 {image:'turismo',label:'La terraza de la hacienda'},
 {image:'galeria-6',label:'Dentro de nuestros invernaderos'},
 {image:'producto-hortalizas',label:'Las manos detrás de la cosecha'},
 {image:'galeria-2',label:'Bienvenidos a Hacienda El Paraíso'}
];
const experiences={
 campo:{image:'galeria-6',label:'AGROTURISMO',title:'Descubre de dónde viene lo fresco.',description:'Acércate a nuestros cultivos y conoce la vida de una hacienda que produce alimentos en la montaña.',list:['Consulta por recorridos guiados','Conoce los sistemas de cultivo','Planea una visita familiar o de grupo'],plan:'Recorrido por los cultivos'},
 descanso:{image:'turismo',label:'TIEMPO PARA TI',title:'Vuelve a escuchar la montaña.',description:'Baja el ritmo entre pinos, jardines y vistas al valle. Consulta las opciones para pasar el día o quedarte a descansar.',list:['Espacios para compartir y descansar','Visitas con coordinación previa','Opciones de hospedaje por consultar'],plan:'Descanso en la naturaleza'},
 refugio:{image:'galeria-2',label:'REFUGIO PASTORAL',title:'Un respiro para quienes cuidan de otros.',description:'Un lugar de descanso para pastores, líderes y sus familias. Comparte tu necesidad para coordinar una estancia con atención personal.',list:['Un entorno de calma en la montaña','Tiempo para la familia y la reflexión','Atención por consulta directa'],plan:'Refugio pastoral',link:'refugio-pastoral.html'}
};
let cart={};
try{const saved=JSON.parse(localStorage.getItem('paraiso-canasta')||'{}');for(const p of products){const q=Number(saved[p.id]);if(Number.isInteger(q)&&q>0&&q<=100)cart[p.id]=q;}}catch{}
let category='Todos',galleryIndex=0,toastTimer;
const escapeHtml=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notify(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600)}
function persist(){try{localStorage.setItem('paraiso-canasta',JSON.stringify(cart))}catch{}$('#cart-count').textContent=Object.values(cart).reduce((a,b)=>a+b,0);renderCart()}
function productCard(p,preview=false){return `<article class="product"><div class="product-photo"><img src="img/${p.image}.webp" alt="${p.id==='lechugas'||p.id==='albahaca'?'Cultivos de la hacienda':'Fotografía de nuestros cultivos; imagen de ambiente'}" loading="lazy"><span class="product-tag">${p.category==='Hojas'?'HOJAS FRESCAS':'HIERBAS AROMÁTICAS'}</span></div><div class="product-bottom"><div><h3>${p.name}</h3><p>Por ${p.unit} · Cotizar</p>${preview?'':`<p class="product-description">${p.description}</p>`}</div><button class="add-btn" data-add="${p.id}" aria-label="Agregar ${p.name} a la canasta">+</button></div></article>`}
function renderProducts(){const q=$('#search').value.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');const list=products.filter(p=>(category==='Todos'||p.category===category)&&`${p.name} ${p.description}`.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'').includes(q));$('#product-grid').innerHTML=list.map(p=>productCard(p)).join('');$('#empty-search').hidden=!!list.length}
function renderCart(){const items=products.filter(p=>cart[p.id]);$('#cart-items').innerHTML=items.length?items.map(p=>`<div class="cart-row"><img src="img/${p.image}.webp" alt=""><div class="cart-row-content"><h3>${p.name}</h3><p>${p.unit} · Precio por confirmar</p><div class="quantity"><button data-quantity="${p.id}" data-delta="-1" aria-label="Reducir ${p.name}">−</button><span aria-label="Cantidad">${cart[p.id]}</span><button data-quantity="${p.id}" data-delta="1" aria-label="Aumentar ${p.name}" ${cart[p.id]>=100?'disabled':''}>+</button></div></div><button class="remove" data-remove="${p.id}">Quitar</button></div>`).join(''):'<div class="cart-empty"><span>✳</span><h3>Un poco de frescura te espera.</h3><p>Explora la cosecha y agrega lo que te gustaría llevar.</p><button class="btn dark" data-shop>Explorar productos ↗</button></div>';$('#cart-form').hidden=!items.length;$('#cart-submit').disabled=!items.length}
function add(id){if(!products.some(p=>p.id===id))return;if((cart[id]||0)>=100){notify('Para más de 100, indica la cantidad en las notas.');return}cart[id]=(cart[id]||0)+1;persist();notify(`${products.find(p=>p.id===id).name} en tu canasta`)}
function openDialog(id){const d=$(id);if(!d.open)d.showModal()}
function route(){const page=document.body.dataset.page;$$('[data-nav]').forEach(e=>{const on=e.dataset.nav===page;e.classList.toggle('active',on);if(on)e.setAttribute('aria-current','page');else e.removeAttribute('aria-current')})}
function renderExperience(key){const d=experiences[key];$('#experience-detail').innerHTML=`<img src="img/${d.image}.webp" alt="${d.title}"><div><p class="eyebrow">${d.label}</p><h3>${d.title}</h3><p>${d.description}</p><ul>${d.list.map(s=>`<li>${s}</li>`).join('')}</ul><button class="text-link" data-plan="${d.plan}">Quiero vivirlo ↗</button>${d.link?`<a class="text-link" href="${d.link}">Conocer el programa ↗</a>`:''}</div>`;$$('[data-experience]').forEach(b=>{b.classList.toggle('active',b.dataset.experience===key);b.setAttribute('aria-pressed',String(b.dataset.experience===key))})}
function updateSuggestion(){const exp=$('#plan-experience').value;const texts={'Visita a la hacienda':'Empieza con un paseo por el jardín y consulta por un recorrido de cultivos.','Recorrido por los cultivos':'Cuéntanos si vienes en familia, con estudiantes o con tu equipo para orientar la visita.','Descanso en la naturaleza':'Reserva tiempo para el paisaje y la conversación. Consulta qué espacios puedes disfrutar.','Refugio pastoral':'Comparte las fechas y el tipo de descanso que necesitas. La coordinación será personal.','Hospedaje':'Indica también tu fecha de salida en las notas para consultar opciones y tarifas.','Boda o celebración':'Cuéntanos la ocasión, el número de invitados y el espacio que te gustó.'};$('#plan-suggestion').innerHTML='<strong>Una idea para tu visita</strong>'+texts[exp]}
function openPlanner(experience){$('#plan-experience').value=experience;updateSuggestion();openDialog('#planner-dialog')}
function showGallery(index){galleryIndex=(index+gallery.length)%gallery.length;const p=gallery[galleryIndex];$('#gallery-image').src=`img/${p.image}.webp`;$('#gallery-image').alt=p.label;$('#gallery-caption').textContent=`${galleryIndex+1} / ${gallery.length} · ${p.label}`;openDialog('#gallery-dialog')}
function whatsapp(message){window.open('https://wa.me/50497655779?text='+encodeURIComponent(message),'_blank','noopener,noreferrer')}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.hasAttribute('data-close'))b.closest('dialog').close();
 if(b.dataset.add)add(b.dataset.add);
 if(b.dataset.quantity){cart[b.dataset.quantity]=Math.min(100,cart[b.dataset.quantity]+Number(b.dataset.delta));if(cart[b.dataset.quantity]<=0)delete cart[b.dataset.quantity];persist()}
 if(b.dataset.remove){delete cart[b.dataset.remove];persist()}
 if(b.hasAttribute('data-shop')){$('#cart-dialog').close();if(!$('#product-grid'))location.href='cosecha.html'}
 if(b.dataset.filter){category=b.dataset.filter;$$('[data-filter]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});renderProducts()}
 if(b.dataset.experience)renderExperience(b.dataset.experience);
 if(b.dataset.plan)openPlanner(b.dataset.plan);
 if(b.hasAttribute('data-gallery'))showGallery(Number(b.dataset.gallery));
 if(b.dataset.galleryStep)showGallery(galleryIndex+Number(b.dataset.galleryStep));
 if(b.dataset.action==='cart')openDialog('#cart-dialog');
 if(b.dataset.action==='privacy')openDialog('#privacy-dialog');
 if(b.dataset.action==='clear'){cart={};persist();notify('Tu canasta guardada se ha borrado')}
 if(b.dataset.action==='business'){if(!$('#product-grid')){location.href='cosecha.html?negocio=1';return}$('#cart-form [name="notes"]').value='Pedido para negocio. Frecuencia deseada: ';notify('Agrega los productos y abre tu canasta para cotizar.');$('#product-grid').scrollIntoView({behavior:'smooth',block:'start'})}
});
$('.menu-toggle').addEventListener('click',()=>{const open=$('.header nav').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open));$('.menu-toggle').setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
if($('#search'))$('#search').addEventListener('input',renderProducts);
$('#plan-experience').addEventListener('change',updateSuggestion);
$('#cart-form').addEventListener('submit',e=>{e.preventDefault();if(!Object.keys(cart).length)return;const d=new FormData(e.target);const lines=products.filter(p=>cart[p.id]).map(p=>`• ${p.name}: ${cart[p.id]} ${cart[p.id]===1?p.unit:(p.unit==='libra'?'libras':'unidades')}`);whatsapp(`Hola, Hacienda El Paraíso. Soy ${d.get('name')}. Quisiera cotizar esta canasta:\n\n${lines.join('\n')}\n\n${d.get('delivery')}\n${d.get('notes')||''}\n\nPor favor confirmar precios, disponibilidad y entrega.`)});
$('#planner-form').addEventListener('submit',e=>{e.preventDefault();const d=new FormData(e.target);const parts=String(d.get('date')).split('-');const date=`${parts[2]}/${parts[1]}/${parts[0]}`;whatsapp(`Hola, Hacienda El Paraíso. Soy ${d.get('name')} y quiero consultar un plan:\n\nExperiencia: ${d.get('experience')}\nFecha deseada: ${date}\nPersonas: ${d.get('people')}\n${d.get('notes')||''}\n\n¿Me confirman disponibilidad, tarifa y condiciones?`)});
document.addEventListener('keydown',e=>{if($('#gallery-dialog').open){if(e.key==='ArrowRight')showGallery(galleryIndex+1);if(e.key==='ArrowLeft')showGallery(galleryIndex-1)}});

window.addEventListener('storage',e=>{if(e.key==='paraiso-canasta'){try{const incoming=JSON.parse(e.newValue||'{}');cart={};products.forEach(p=>{const q=Number(incoming[p.id]);if(Number.isInteger(q)&&q>0&&q<=100)cart[p.id]=q});$('#cart-count').textContent=Object.values(cart).reduce((a,b)=>a+b,0);renderCart()}catch{}}});
const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Tegucigalpa',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());$('#planner-form [name="date"]').min=today;
$('#year').textContent=new Date().getFullYear();
if($('#home-products'))$('#home-products').innerHTML=products.slice(0,3).map(p=>productCard(p,true)).join('');
if($('#gallery-grid'))$('#gallery-grid').innerHTML=gallery.slice(0,5).map((p,i)=>`<button data-gallery="${i}" aria-label="Ver ${p.label}"><img src="img/${p.image}.webp" alt="${p.label}" loading="lazy"><span aria-hidden="true">↗</span></button>`).join('');
if($('#product-grid'))renderProducts();if($('#experience-detail'))renderExperience('campo');persist();route();
if($('#product-grid')&&new URLSearchParams(location.search).has('negocio')){$('#cart-form [name="notes"]').value='Pedido para negocio. Frecuencia deseada: ';$('#product-grid').scrollIntoView({block:'start'})}
