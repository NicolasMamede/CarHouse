const nomesPecas = [
['Bloco do motor','Estrutura de metal que abriga os cilindros, as galerias de óleo e os suportes do virabrequim.'],
['Camisas dos cilindros','Superfícies internas nas quais os pistões se movimentam.'],
['Pistões','Recebem a pressão da combustão e transmitem força às bielas.'],
['Anéis dos pistões','Fazem a vedação dos gases e ajudam a controlar o óleo na parede do cilindro.'],
['Pinos dos pistões','Ligam as bielas aos pistões, permitindo a articulação.'],
['Bielas','Transmitem o movimento alternado dos pistões ao virabrequim.'],
['Virabrequim','Transforma o movimento linear dos pistões em rotação.'],
['Contrapesos','Ajudam a equilibrar as forças do conjunto rotativo.'],
['Mancais','Apoiam os eixos e mantêm uma película de óleo entre as superfícies.'],
['Cabeçote','Contém as câmaras de combustão, válvulas e velas de ignição.'],
['Válvulas de admissão','Abrem a passagem para a entrada de ar ou mistura.'],
['Válvulas de escape','Liberam os gases após a combustão.'],
['Comandos de válvulas','Giram a metade da velocidade do virabrequim em um motor de quatro tempos.'],
['Molas de válvula','Fecham as válvulas após a ação do comando.'],
['Velas de ignição','Produzem a faísca que inicia a queima nos motores a gasolina.'],
['Cárter','Armazena o óleo que retorna após lubrificar o motor.'],
['Bomba de óleo','Pressuriza o óleo e o distribui por canais internos.'],
['Galerias de lubrificação','Conduzem óleo aos mancais, comando e demais peças.'],
['Filtro de óleo','Retém contaminantes presentes no lubrificante.'],
['Sistema de arrefecimento','Retira calor do motor para manter uma temperatura adequada.'],
['Corrente de distribuição','Sincroniza os comandos de válvulas ao virabrequim.'],
['Volante do motor','Suaviza oscilações na rotação e ajuda a transferir torque à transmissão.']
];
const lista = document.getElementById('listaComponentes');
nomesPecas.forEach((item,i)=>{const coluna=document.createElement('div');coluna.className='col-12 col-md-6 col-lg-4';const cartao=document.createElement('article');cartao.className='motor-peca';const titulo=document.createElement('h3');titulo.textContent=String(i+1).padStart(2,'0')+' · '+item[0];const texto=document.createElement('p');texto.textContent=item[1];cartao.append(titulo,texto);coluna.append(cartao);lista.append(coluna)});
const canvas=document.getElementById('motorCanvas'),ctx=canvas.getContext('2d',{alpha:false});
const partida=document.getElementById('botaoPartida'),reiniciar=document.getElementById('botaoReiniciar'),slider=document.getElementById('controleRpm');
const leituraRpm=document.getElementById('leituraRpm'),leituraPressao=document.getElementById('leituraPressao'),estado=document.getElementById('estadoMotor'),rpmSelecionado=document.getElementById('rpmSelecionado'),faseTexto=document.getElementById('motor3dFase');
let ligado=false,rpm=900,angulo=.2,pressao=0,tempo=0,explodida=false,yaw=-.49,pitch=.22,zoom=16.2,arrastando=false,mouseX=0,mouseY=0,anterior=performance.now();
const V=(x,y,z)=>[x,y,z], add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],mul=(a,n)=>[a[0]*n,a[1]*n,a[2]*n],dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],norm=a=>{const n=Math.hypot(...a)||1;return mul(a,1/n)};
const rgba=(color,k)=>{let c=color.replace('#','');const r=parseInt(c.slice(0,2),16),g=parseInt(c.slice(2,4),16),b=parseInt(c.slice(4,6),16);return `rgb(${Math.min(255,Math.round(r*k))},${Math.min(255,Math.round(g*k))},${Math.min(255,Math.round(b*k))})`};
const polys=[],lines=[],lights=[norm(V(-.8,.9,1.2)),norm(V(1.0,.5,-.7))];
function face(a,b,c,color,metal=0,alpha=1){polys.push({a,b,c,color,metal,alpha})}
function quad(a,b,c,d,color,metal=0,alpha=1){face(a,b,c,color,metal,alpha);face(a,c,d,color,metal,alpha)}
function cylinder(a,b,r,color,segments=12,metal=.5,r2=r){let axis=norm(sub(b,a)),helper=Math.abs(axis[1])>.88?V(1,0,0):V(0,1,0),u=norm(cross(axis,helper)),v=norm(cross(axis,u));let bottom=[],top=[];for(let i=0;i<segments;i++){let t=i*Math.PI*2/segments,offset=add(mul(u,Math.cos(t)),mul(v,Math.sin(t)));bottom.push(add(a,mul(offset,r)));top.push(add(b,mul(offset,r2)))}for(let i=0;i<segments;i++){let j=(i+1)%segments;quad(bottom[i],bottom[j],top[j],top[i],color,metal)}for(let i=1;i<segments-1;i++){face(bottom[0],bottom[i+1],bottom[i],color,metal);face(top[0],top[i],top[i+1],color,metal)}}
function box(center,w,h,d,color,metal=.3){const [x,y,z]=center,xx=w/2,yy=h/2,zz=d/2;let p=[V(x-xx,y-yy,z-zz),V(x+xx,y-yy,z-zz),V(x+xx,y+yy,z-zz),V(x-xx,y+yy,z-zz),V(x-xx,y-yy,z+zz),V(x+xx,y-yy,z+zz),V(x+xx,y+yy,z+zz),V(x-xx,y+yy,z+zz)];[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[0,3,7,4],[1,5,6,2]].forEach(q=>quad(...q.map(i=>p[i]),color,metal))}
function ring(y,x,z,r,color,thickness=.035){for(let j=0;j<14;j++){let a=j*Math.PI*2/14,b=(j+1)*Math.PI*2/14;quad(V(x+r*Math.cos(a),y,z+r*Math.sin(a)),V(x+r*Math.cos(b),y,z+r*Math.sin(b)),V(x+(r+thickness)*Math.cos(b),y,z+(r+thickness)*Math.sin(b)),V(x+(r+thickness)*Math.cos(a),y,z+(r+thickness)*Math.sin(a)),color,.9)}}
function wire(a,b,color='#8ea1b4',width=1){lines.push({a,b,color,width})}
function frame(){const e=explodida?0.48:0;const steel='#aebecd',silver='#d8e0e8',darkSteel='#526473',aluminum='#6b7988',head='#7a8795',crank='#b8c7d1',oil='#54daec';let xs=[-2.55,-.85,.85,2.55],phases=[0,Math.PI,Math.PI,0],rodL=1.8,r=.40;
box(V(0,-.04-e*.2,-.76),7.65,3.28,.17,'#475463');box(V(0,-1.58,0),7.6,.16,2.18,'#586676');
box(V(-3.73,-.1,0),.20,3.1,2.1,aluminum);box(V(3.73,-.1,0),.20,3.1,2.1,aluminum);
for(let i=0;i<5;i++){let x=-3.4+i*1.7;box(V(x,-.25,-.55),.11,2.6,.35,'#8b9aa8');cylinder(V(x,-1.17,-.15),V(x,-1.17,.55),.30,'#38495a',10)}
xs.forEach(x=>{cylinder(V(x,-.89,-.40),V(x,1.03,-.40),.50,'#465668',12,.32);ring(1.10,x,.15,.54,'#c7d3d9',.045)});
box(V(0,-2.25-e*.18,0),7.45,.72,1.95,'#465463');box(V(0,-2.65-e*.18,0),7.15,.14,1.8,'#84929f');for(let k=0;k<9;k++)box(V(-3.1+k*.77,-2.40-e*.18,.99),.09,.45,.08,'#778b9c');
box(V(0,1.78+e*.72,-.58),7.65,.77,.90,head);box(V(0,2.08+e*.72,.28),7.65,.20,1.8,'#8797a6');
for(let i=0;i<9;i++){let x=-3.4+i*.85;box(V(x,2.13+e*.72,.85),.085,.30,.11,'#b1bfcb')}
for(let z of [-.38,.53]){cylinder(V(-3.54,2.28+e*.72,z),V(3.54,2.28+e*.72,z),.118,'#b5c0c8',12,.9);xs.forEach((x,i)=>{let lobeRot=angulo*.5+i*1.5+(z>0?Math.PI:0);let cy=2.28+e*.72+.09*Math.cos(lobeRot);cylinder(V(x-.21,cy,z),V(x+.21,cy,z),.20,'#8b9caa',12,.9)})}
let cylinderPhaseLabels=[];
xs.forEach((x,i)=>{
 let th=angulo+phases[i],pinY=-1.13+r*Math.cos(th),pinZ=.19+r*Math.sin(th), pistonY=pinY+Math.sqrt(rodL*rodL-(pinZ-.15)*(pinZ-.15));
 cylinder(V(x-.5,-1.13,.19),V(x-.24,-1.13,.19),.23,'#9faeba',14,.9);
 cylinder(V(x+.24,-1.13,.19),V(x+.5,-1.13,.19),.23,'#9faeba',14,.9);
 cylinder(V(x-.23,-1.13,.19),V(x-.23,pinY,pinZ),.17,'#647582',12,.8);
 cylinder(V(x+.23,-1.13,.19),V(x+.23,pinY,pinZ),.17,'#647582',12,.8);
 cylinder(V(x-.31,pinY,pinZ),V(x+.31,pinY,pinZ),.17,'#e1e7eb',12,.9);
 let cY=-1.13-.42*Math.cos(th),cZ=.19-.42*Math.sin(th);
 cylinder(V(x-.31,cY,cZ),V(x+.31,cY,cZ),.27,'#687989',12,.8);
 cylinder(V(x,pinY,pinZ),V(x,pistonY-.12,.15),.115,steel,12,.9);cylinder(V(x-.18,pinY,pinZ),V(x+.18,pinY,pinZ),.235,'#718493',12,.8);
 cylinder(V(x-.21,pistonY-.12,.15),V(x+.21,pistonY-.12,.15),.125,'#c9d3db',12,.9);
 cylinder(V(x,pistonY-.40,.15),V(x,pistonY+.13,.15),.485,'#b8c5cd',18,.95);
 cylinder(V(x,pistonY+.13,.15),V(x,pistonY+.20,.15),.49,'#e8edf0',18,1);
 for(let a of [.03,-.045,-.13])ring(pistonY+a,x,.15,.495,'#2c3742',.016);
 let cycle=((angulo+phases[i]+(i===0?0:i===3?Math.PI:0))%(Math.PI*4)+Math.PI*4)%(Math.PI*4);
 let deg=(angulo+phases[i]+(i*2*Math.PI/4))%(Math.PI*4);deg=(deg+Math.PI*4)%(Math.PI*4);
 let intake=deg<Math.PI,compression=deg<2*Math.PI&&deg>=Math.PI,power=deg>=2*Math.PI&&deg<3*Math.PI,exhaust=deg>=3*Math.PI;
 let labels=['ADMISSÃO','COMPRESSÃO','COMBUSTÃO','ESCAPE'];let stage=Math.floor(deg/Math.PI);cylinderPhaseLabels.push(labels[stage]);
 if(ligado&&power){let strength=Math.max(.05,1-(deg-2*Math.PI)/Math.PI);cylinder(V(x,Math.min(pistonY+.42,1.04),.15),V(x,1.20,.15),.34*strength,'#ed722d',12,.1);cylinder(V(x,1.02,.15),V(x,1.18,.15),.16*strength,'#ffe59b',10,.05)}
 let inletOpen=ligado&&intake?.17*Math.sin(deg):0,exitOpen=ligado&&exhaust?.17*Math.sin(deg-3*Math.PI):0;
 [-.22,.54].forEach((z,j)=>{let vOpen=j===0?inletOpen:exitOpen;let y=1.30-vOpen+e*.72; cylinder(V(x-.16,y,z),V(x+.16,y,z),.17,j===0?'#86c6c6':'#cc9681',12,.7);cylinder(V(x,y,z),V(x,2.18+e*.72,z),.048,silver,10,.9);cylinder(V(x,y+.38,z),V(x,y+.59,z),.10,'#9cabb8',10,.7);for(let s=0;s<4;s++)ring(y+.36+s*.07,x,z,.11,'#acbdc5',.01)});
 cylinder(V(x,2.1+e*.72,.16),V(x,1.38+e*.72,.16),.047,'#d9dbcf',10,.75);cylinder(V(x,1.4+e*.72,.16),V(x,1.3+e*.72,.16),.07,'#e6c986',10,.5);
 });
 cylinder(V(-3.85,-1.13,.19),V(3.9,-1.13,.19),.13,'#bac5cd',12,.9);cylinder(V(3.9,-1.13,.19),V(4.1,-1.13,.19),.66,'#83929d',26,.8);cylinder(V(4.1,-1.13,.19),V(4.22,-1.13,.19),.38,'#c6d1d9',22,.8);
 cylinder(V(-3.27,-2.05,.7),V(-3.27,-1.5,.7),.09,'#2a7f96',9,.4);cylinder(V(-3.27,-1.5,.7),V(3.13,-1.5,.7),.065,'#397d96',10,.5);
 cylinder(V(3.13,-1.5,.7),V(3.13,2.50+e*.72,.7),.065,'#327e98',10,.5);
 cylinder(V(-3.33,2.50+e*.72,.7),V(3.13,2.50+e*.72,.7),.06,'#387d99',10,.6);
 if(ligado&&pressao>.15){let path=[V(-3.27,-2.47,.70),V(-3.27,-1.50,.70),V(3.13,-1.5,.70),V(3.13,2.5+e*.72,.70),V(-3.33,2.5+e*.72,.70)];let lens=[0];for(let j=1;j<path.length;j++)lens.push(lens[j-1]+Math.hypot(...sub(path[j],path[j-1])));for(let d=0;d<40;d++){let at=((tempo*1.8+d*.48)%lens[lens.length-1]);let k=1;while(k<lens.length-1&&at>lens[k])k++;let f=(at-lens[k-1])/(lens[k]-lens[k-1]);let q=add(path[k-1],mul(sub(path[k],path[k-1]),f));cylinder(add(q,V(0,-.045,0)),add(q,V(0,.045,0)),.055,oil,6,.2)}}
 for(let k=0;k<5;k++){let x=-3.5+k*1.75;box(V(x,-.6,1.00),.08,1.72,.08,'#788895')}

 for(const z of [-.73,.84]){
   box(V(0,2.51+e*.72,z),7.5,.29,.52,'#77838c',.85);
   box(V(0,2.68+e*.72,z),7.21,.075,.45,'#b9c4ca',.95);
   for(let j=0;j<4;j++){
     const xx=-2.55+j*1.7;
     box(V(xx,2.735+e*.72,z),.88,.034,.42,'#8d232a',.6);
     for(const bx of [xx-.53,xx+.53]){
       cylinder(V(bx,2.70+e*.72,z),V(bx,2.78+e*.72,z),.058,'#e0e5e5',10,1);
       cylinder(V(bx,2.78+e*.72,z),V(bx,2.787+e*.72,z),.024,'#53616c',6,.8)
     }
   }
 }
 for(const zy of [-.32,.56]){
   const gy=2.29+e*.72;
   cylinder(V(3.81,gy,zy),V(4.01,gy,zy),.32,'#57636f',28,.85);
   cylinder(V(4.02,gy,zy),V(4.075,gy,zy),.235,'#bdc5ca',28,.95);
   cylinder(V(4.075,gy,zy),V(4.12,gy,zy),.077,'#394650',16,.9);
   for(let j=0;j<12;j++){
     let t=j*Math.PI/6;
     cylinder(V(4.05,gy+.18*Math.cos(t),zy+.18*Math.sin(t)),V(4.079,gy+.18*Math.cos(t),zy+.18*Math.sin(t)),.021,'#465665',7,.7)
   }
 }
 for(const zz of [-1.03,1.03]){
   if(zz<0)box(V(0,-.17,zz),7.35,2.65,.10,'#4d5d69',.5);
   for(let j=0;j<5;j++){
     const xx=-3.43+j*1.72;
     box(V(xx,-.13,zz+(zz>0?.065:-.065)),.13,2.49,.13,'#8998a1',.8);
     for(const yy of [-1.16,.96]){
       cylinder(V(xx,yy,zz+(zz>0?.10:-.10)),V(xx,yy,zz+(zz>0?.19:-.19)),.082,'#d2d9d9',10,.9);
       cylinder(V(xx,yy,zz+(zz>0?.20:-.20)),V(xx,yy,zz+(zz>0?.21:-.21)),.041,'#4b5963',6,.6)
     }
   }
   box(V(0,-1.47,zz+(zz>0?.09:-.09)),7.35,.13,.18,'#a6b3bd',.8);
 }
 for(let j=0;j<11;j++){
   let xx=-3.08+j*.61;
   box(V(xx,-2.37,.91),.06,.40,.10,'#a0aeb8',.8)
 }
 cylinder(V(2.70,-2.57,1.0),V(2.70,-2.57,1.18),.12,'#b8c3cc',14,.85);
 cylinder(V(-3.37,1.73,-1.16),V(3.37,1.73,-1.16),.068,'#bdc8d0',14,.9);
 xs.forEach(x=>{
   cylinder(V(x,1.73,-1.16),V(x,1.48,-.93),.074,'#343c45',10,.5);
   cylinder(V(x,1.72,-1.16),V(x,1.83,-1.16),.14,'#9d3138',12,.8)
 });
 cylinder(V(-3.25,-1.93,1.12),V(-3.25,-1.93,1.66),.26,'#e3e6de',22,.85);
 cylinder(V(-3.25,-1.93,1.66),V(-3.25,-1.93,1.70),.21,'#bd373b',22,.65);
 cylinder(V(-3.25,-1.93,1.70),V(-3.25,-1.93,1.725),.085,'#6a7881',16,.8);
 xs.forEach((x,i)=>{
   let q=[V(x,1.25,-1.10),V(x,1.08,-1.55),V(x+.12,.52,-1.82),V(x+.22,-.43,-1.82)];
   for(let j=1;j<q.length;j++)cylinder(q[j-1],q[j],.094,'#a88e7c',14,.67)
 });
 box(V(.15,-2.43,1.095),1.62,.32,.068,'#a4b1b8',.7);
 for(let j=0;j<9;j++){
   let xx=-3.45+j*.86;
   cylinder(V(xx,1.92,1.02),V(xx,2.14,1.02),.082,'#b6bfc5',12,.87);
   cylinder(V(xx,2.14,1.02),V(xx,2.18,1.02),.125,'#5a6873',6,.8)
 }

 return cylinderPhaseLabels;
}
function camera(p){let [x,y,z]=p;const a=Math.cos(yaw),b=Math.sin(yaw),u=x*a+z*b,v=-x*b+z*a;const cp=Math.cos(pitch),sp=Math.sin(pitch);const yy=y*cp-v*sp,depth=y*sp+v*cp;const scale=Math.min(canvas.width/10.6,canvas.height/8.5)*zoom/(zoom-depth);return [canvas.width*.5+u*scale,canvas.height*.53-yy*scale,depth,scale]}
function render(){
 const w=canvas.width,h=canvas.height;
 const background=ctx.createLinearGradient(0,0,w,h);
 background.addColorStop(0,'#101d2b');background.addColorStop(.54,'#09121d');background.addColorStop(1,'#050a10');
 ctx.fillStyle=background;ctx.fillRect(0,0,w,h);
 const spotlight=ctx.createRadialGradient(w*.49,h*.40,5,w*.50,h*.52,w*.62);
 spotlight.addColorStop(0,'#304358');spotlight.addColorStop(.52,'#142436');spotlight.addColorStop(1,'#08101a');
 ctx.globalAlpha=.68;ctx.fillStyle=spotlight;ctx.fillRect(0,0,w,h);ctx.globalAlpha=1;
 ctx.lineWidth=Math.max(1,w/1200);
 ctx.strokeStyle='#4c718d';ctx.globalAlpha=.10;
 for(let ix=-8;ix<=8;ix++){
   let a=camera(V(ix*.75,-2.87,-5)),b=camera(V(ix*.75,-2.87,5));ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke()
 }
 for(let iz=-6;iz<=6;iz++){
   let a=camera(V(-6,-2.87,iz*.75)),b=camera(V(6,-2.87,iz*.75));ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke()
 }ctx.globalAlpha=1;
 polys.length=0;lines.length=0;const phases=frame();let triangles=[];
 for(const p of polys){
   let A=camera(p.a),B=camera(p.b),C=camera(p.c);
   let u=sub(p.b,p.a),v=sub(p.c,p.a),n=norm(cross(u,v));
   let ambient=.33,light1=Math.max(0,dot(n,lights[0])),light2=Math.max(0,dot(n,lights[1]));
   let lit=Math.min(1.58,ambient+.63*light1+.29*light2+.19*p.metal);
   triangles.push({a:A,b:B,c:C,color:rgba(p.color,lit),depth:(A[2]+B[2]+C[2])/3,alpha:p.alpha});
 }
 triangles.sort((a,b)=>a.depth-b.depth);
 for(const p of triangles){
   ctx.globalAlpha=p.alpha;ctx.beginPath();ctx.moveTo(p.a[0],p.a[1]);ctx.lineTo(p.b[0],p.b[1]);ctx.lineTo(p.c[0],p.c[1]);ctx.closePath();
   ctx.fillStyle=p.color;ctx.fill()
 }
 ctx.globalAlpha=1;
 let edge=ctx.createRadialGradient(w*.50,h*.47,w*.26,w*.50,h*.47,w*.79);
 edge.addColorStop(0,'rgba(0,0,0,0)');edge.addColorStop(1,'rgba(0,0,0,.5)');ctx.fillStyle=edge;ctx.fillRect(0,0,w,h);


} 
function resize(){let r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(300,Math.floor(r.width*d));canvas.height=Math.max(300,Math.floor(r.height*d))}window.addEventListener('resize',resize);
canvas.addEventListener('pointerdown',e=>{arrastando=true;mouseX=e.clientX;mouseY=e.clientY;canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(!arrastando)return;let dx=e.clientX-mouseX,dy=e.clientY-mouseY;mouseX=e.clientX;mouseY=e.clientY;yaw+=dx*.008;pitch=Math.max(-.65,Math.min(.75,pitch+dy*.006))});
canvas.addEventListener('pointerup',()=>arrastando=false);canvas.addEventListener('pointercancel',()=>arrastando=false);
canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=Math.max(11,Math.min(26,zoom+Math.sign(e.deltaY)*.7))},{passive:false});
document.getElementById('vistaFrente').onclick=()=>{yaw=0;pitch=.02};
document.getElementById('vistaLado').onclick=()=>{yaw=-Math.PI/2;pitch=.08};
document.getElementById('vistaIsometrica').onclick=()=>{yaw=-.49;pitch=.22;zoom=16.2};
document.getElementById('vistaExplodida').onclick=e=>{explodida=!explodida;e.target.textContent=explodida?'Unir peças':'Vista explodida'};
function interfaceMotor(){leituraRpm.innerHTML=(ligado?rpm.toLocaleString('pt-BR'):'0')+' <small>RPM</small>';leituraPressao.innerHTML=pressao.toFixed(1).replace('.',',')+' <small>bar</small>';estado.textContent=ligado?'● FUNCIONANDO':'● DESLIGADO';estado.classList.toggle('ligado',ligado);partida.textContent=ligado?'■ DESLIGAR MOTOR':'▶ DAR PARTIDA';slider.disabled=!ligado;rpmSelecionado.textContent=rpm.toLocaleString('pt-BR')+' RPM';faseTexto.textContent=ligado?'LUBRIFICAÇÃO '+Math.round(pressao/4.5*100)+'% · 4 TEMPOS':'MOTOR DESLIGADO'}
partida.addEventListener('click',()=>{ligado=!ligado;interfaceMotor()});reiniciar.addEventListener('click',()=>{ligado=false;angulo=.2;tempo=0;pressao=0;rpm=900;slider.value='900';interfaceMotor()});slider.addEventListener('input',()=>{rpm=Number(slider.value);interfaceMotor()});
function tick(now){let dt=Math.min(.035,(now-anterior)/1000||.016);anterior=now;if(ligado){tempo+=dt;angulo+=dt*(1.25+rpm/2400);pressao+=(Math.min(4.5,.7+rpm/1700)-pressao)*Math.min(1,dt*.9)}else{pressao=Math.max(0,pressao-dt*1.35)}if(!document.hidden){render();if(ligado||pressao>0)interfaceMotor()}requestAnimationFrame(tick)}
resize();interfaceMotor();requestAnimationFrame(tick);

