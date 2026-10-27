/* Arabee – Materi 1: At-Ta‘āruf. Static app, state in localStorage. */
const $=(s,r=document)=>r.querySelector(s);
const K='arabee-v1',today=()=>new Date().toISOString().slice(0,10);
const S=Object.assign({streak:0,last:'',days:[],gems:0,hearts:5,hday:'',done:[],skin:2,hat:'kerudung',col:0,glass:0,notes:'',fs:100,hc:0,name:'Pelajar'},JSON.parse(localStorage.getItem(K)||'{}'));
if(S.hday!==today()){S.hday=today();S.hearts=5}
const save=()=>localStorage.setItem(K,JSON.stringify(S));
const shuf=a=>[...a].sort(()=>Math.random()-.5),pick=(a,n)=>shuf(a).slice(0,n);

/* ---------- Materi (semua Arab berharakat) ---------- */
const PRON=[['أَنَا','saya'],['أَنْتَ','kamu (laki-laki)'],['أَنْتِ','kamu (perempuan)'],['هُوَ','dia (laki-laki)'],['هِيَ','dia (perempuan)'],['نَحْنُ','kami / kita'],['أَنْتُمْ','kalian'],['هُمْ','mereka']];
const QW=[['مَا','apa'],['مَنْ','siapa'],['أَيْنَ','di mana'],['كَيْفَ','bagaimana'],['كَمْ','berapa'],['مَتَى','kapan'],['لِمَاذَا','mengapa'],['هَلْ','apakah']];
const SEN=[['مَا اسْمُكَ؟','Siapa namamu?'],['اِسْمِي أَحْمَدُ','Namaku Ahmad'],['مِنْ أَيْنَ أَنْتَ؟','Kamu dari mana?'],['أَنَا مِنْ إِنْدُونِيسِيَا','Saya dari Indonesia'],['كَيْفَ حَالُكَ؟','Apa kabarmu?'],['أَنَا بِخَيْرٍ','Saya baik-baik saja'],['السَّلَامُ عَلَيْكُمْ','Semoga keselamatan atasmu'],['وَعَلَيْكُمُ السَّلَامُ','Dan atasmu keselamatan'],['مَنْ هُوَ؟','Siapa dia (laki-laki)?'],['هَلْ أَنْتَ طَالِبٌ؟','Apakah kamu seorang siswa?']];
const WORDS=[...PRON,...QW];
const LEVELS=[['Kosakata',['choice','match']],['Mendengar',['listen']],['Membaca',['speak']],['Menyusun',['arrange','choice']],['Acak 4 maharah',['choice','listen','speak','arrange','match']]];

/* ---------- Suara & mikrofon ---------- */
function say(t,rate=.8){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='ar-SA';u.rate=rate;speechSynthesis.speak(u)}catch(e){}}
function sayWords(t){try{speechSynthesis.cancel();t.split(' ').forEach(w=>{const u=new SpeechSynthesisUtterance(w);u.lang='ar-SA';u.rate=.6;speechSynthesis.speak(u)})}catch(e){}}
const strip=s=>s.replace(/[\u064B-\u0652\u0670؟?،,.]/g,'').trim();
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;

/* ---------- Avatar ---------- */
const SK=['#6b3f2a','#8a5a3c','#b9774f','#e0a37c','#f6cdb0'],COL=['#f7a8c8','#7ad3ff','#9be15d','#c79bff'];
function mascot(sz=110){const c=COL[S.col];return `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}" role="img" aria-label="Karakter Arabee">
${S.hat==='kerudung'?`<path d="M16 64C12 22 38 6 50 6s38 16 34 58c-3 22-14 30-34 30S19 86 16 64z" fill="${c}"/>`:''}
<ellipse cx="50" cy="58" rx="25" ry="27" fill="${SK[S.skin]}"/>
${S.hat==='peci'?`<path d="M25 42Q50 12 75 42z" fill="${c}"/>`:''}
<circle cx="40" cy="55" r="5" fill="#fff"/><circle cx="60" cy="55" r="5" fill="#fff"/><circle cx="41" cy="56" r="2.5" fill="#222"/><circle cx="61" cy="56" r="2.5" fill="#222"/>
<path d="M41 70Q50 79 59 70" stroke="#7a2e2e" stroke-width="3" fill="none" stroke-linecap="round"/>
${S.glass?'<g fill="none" stroke="#222" stroke-width="2"><circle cx="40" cy="55" r="8"/><circle cx="60" cy="55" r="8"/><path d="M48 55h4"/></g>':''}</svg>`}

/* ---------- Halaman ---------- */
let tab='home';
const top=()=>`<div class="top"><span aria-label="Bahasa Arab" title="Bahasa Arab">🇸🇦 <b>${S.done.length}</b></span><button class="chip" data-a="streak" aria-label="Streak ${S.streak} hari">🔥 ${S.streak}</button><span aria-label="${S.gems} berlian">💎 ${S.gems}</span><span aria-label="${S.hearts} nyawa">❤️ ${S.hearts}</span></div>`;
const nav=()=>`<nav class="nav" aria-label="Menu utama">${[['home','🏠','Beranda'],['cp','🎯','Capaian'],['note','📝','Catatan'],['me','👤','Profil']].map(([k,i,l])=>`<button data-tab="${k}" ${tab===k?'aria-current="page"':''}><b>${i}</b>${l}</button>`).join('')}</nav>`;
function page(){
 if(tab==='home')return `<div class="banner"><div><small>Materi 1</small><h1>At-Ta‘āruf (Perkenalan)</h1></div><button data-a="mat" aria-label="Buka isi materi">📖</button></div><div class="path">${LEVELS.map(([n],i)=>`<button class="node ${S.done.includes(i)?'done':''}" style="transform:translateX(${[0,44,64,44,0][i]}px)" data-lv="${i}" aria-label="Level ${i+1}: ${n}${S.done.includes(i)?', selesai':''}">${S.done.includes(i)?'✔':i+1}<small>${['📚','🎧','🎙','🧩','⭐'][i]}</small></button>`).join('')}</div><p class="center">${S.hearts<1?'Nyawa habis. Isi ulang di Profil dengan 50 💎, atau tunggu besok.':'Satu level boleh dimainkan berkali-kali. Tiap main ada 15 soal.'}</p>`;
 if(tab==='cp')return `<h1>Capaian Pembelajaran</h1><div class="card"><h2>Progres Materi 1</h2><div class="meter" role="progressbar" aria-valuenow="${S.done.length}" aria-valuemax="5"><i style="width:${S.done.length*20}%"></i></div><p>${S.done.length} dari 5 level selesai</p></div>
<div class="card"><h2>Capaian Pembelajaran (RPS)</h2><p>Pada akhir Fase E, peserta didik mampu menganalisis kosakata, gramatika, dan wacana tentang <span class="ar" lang="ar">التَّعَارُفُ</span> (At-Ta‘āruf) dengan gramatika <span class="ar" lang="ar">أَدَوَاتُ الِاسْتِفْهَامِ</span> dan <span class="ar" lang="ar">الضَّمَائِرُ</span>.</p><p>Peserta didik juga menerapkan keterampilan menyimak, berbicara, membaca, memirsa, menulis, dan mempresentasikan melalui identifikasi informasi tersurat dan tersirat dari wacana lisan, penerapan wacana lisan, analisis teks visual atau multimodal, serta produksi gagasan secara tertulis dan/atau lisan.</p></div>
<div class="card"><h2>Identitas Bahan Ajar</h2><ul><li>Nama: Bahan Ajar Bahasa Arab Inklusif Berbasis Website (Arabee)</li><li>Mata pelajaran: Bahasa Arab · MA · Kelas X / Fase E</li><li>Pendekatan: komunikatif dan desain pembelajaran inklusif</li><li>Acuan: CEFR (level sasaran sesuai analisis kebutuhan)</li><li>Alokasi waktu: 2–3 JP (rancangan awal)</li><li>Penyusun: Wahda Lathifa Zalfa · 2026</li></ul></div>
<div class="card"><h2>Batasan Materi</h2><ol><li>Kosakata dasar perkenalan</li><li>Ungkapan salam dan perkenalan</li><li>Kata tanya dasar</li><li>Kata ganti dasar</li><li>Dialog perkenalan sederhana</li><li>Latihan penggunaan ungkapan perkenalan sehari-hari</li></ol></div>`;
 if(tab==='note')return `<h1>Catatan Guru</h1><div class="card"><label for="nt">Catatan untuk akun ini</label><textarea id="nt" rows="8" placeholder="Tulis catatan guru di sini…">${S.notes}</textarea><p>Tersimpan otomatis di perangkat ini.</p></div>`;
 return `<h1>Profil</h1><div class="center">${mascot(150)}<p><input type="text" id="nm" value="${S.name}" aria-label="Nama" style="max-width:240px;text-align:center"></p></div>
<div class="card"><h2>Ringkasan</h2><p>🔥 ${S.streak} hari beruntun · 💎 ${S.gems} berlian · ✔ ${S.done.length} level</p></div>
<div class="card"><h2>Edit avatar</h2><p>Warna kulit</p><div class="row">${SK.map((c,i)=>`<button class="sw" style="background:${c}" data-skin="${i}" aria-pressed="${S.skin===i}" aria-label="Warna kulit ${i+1}"></button>`).join('')}</div><p>Penutup kepala</p><div class="row">${['kerudung','peci','tanpa'].map(h=>`<button class="pill" data-hat="${h}" aria-pressed="${S.hat===h}">${h}</button>`).join('')}</div><p>Warna</p><div class="row">${COL.map((c,i)=>`<button class="sw" style="background:${c}" data-col="${i}" aria-pressed="${S.col===i}" aria-label="Warna ${i+1}"></button>`).join('')}</div><div class="row"><button class="pill" data-a="glass" aria-pressed="${!!S.glass}">Kacamata</button></div></div>
<div class="card"><h2>Aksesibilitas</h2><div class="row"><button class="pill" data-fs="-10" aria-label="Perkecil teks">A−</button><button class="pill" data-fs="10" aria-label="Perbesar teks">A+</button><button class="pill" data-a="hc" aria-pressed="${!!S.hc}">Kontras tinggi</button></div></div>
<div class="card"><h2>Nyawa</h2><button class="pill" data-a="refill">Isi ulang penuh (50 💎)</button></div>`;
}
function render(){document.documentElement.style.fontSize=S.fs+'%';document.body.classList.toggle('hc',!!S.hc);$('#app').innerHTML=top()+page()+nav();save()}

/* ---------- Dialog materi ---------- */
function openMat(){const t=(a)=>`<table>${a.map(([x,y])=>`<tr><td class="ar" lang="ar">${x}</td><td>${y}</td><td><button class="pill" data-say="${x}" aria-label="Dengarkan ${y}">🔊</button></td></tr>`).join('')}</table>`;
 $('#mat').innerHTML=`<h2>Materi 1 · At-Ta‘āruf</h2><h3>Kata ganti (الضَّمَائِرُ)</h3>${t(PRON)}<h3>Kata tanya (أَدَوَاتُ الِاسْتِفْهَامِ)</h3>${t(QW)}<h3>Dialog perkenalan</h3>${t(SEN)}<button class="btn" data-a="closemat" style="margin-top:14px">Tutup</button>`;$('#mat').showModal()}

/* ---------- Pembuat soal ---------- */
function mk(lv){const types=LEVELS[lv][1],Q=[];
 for(let k=0;k<15;k++){const ty=types[k%types.length],pool=Math.random()<.5?WORDS:SEN,[ar,id]=pick(pool,1)[0];
  if(ty==='choice'){const o=shuf([id,...pick(pool.filter(p=>p[1]!==id),2).map(p=>p[1])]);Q.push({ty,ar,id,o,ans:id})}
  else if(ty==='listen'){const o=shuf([ar,...pick(pool.filter(p=>p[0]!==ar),2).map(p=>p[0])]);Q.push({ty,ar,id,o,ans:ar})}
  else if(ty==='speak'){const [a,i]=pick(SEN,1)[0];Q.push({ty,ar:a,id:i})}
  else if(ty==='arrange'){const [a,i]=pick(SEN,1)[0];Q.push({ty,ar:a,id:i,tiles:shuf(a.split(' ')),out:[]})}
  else{const ps=pick(WORDS,5);Q.push({ty,ps,L:shuf(ps.map(p=>p[0])),R:shuf(ps.map(p=>p[1])),got:[],pa:null,err:false,ar:'',id:''})}}
 return Q}

/* ---------- Game ---------- */
let G,rec;
function start(lv){if(S.hearts<1)return;G={lv,Q:mk(lv),i:0,wr:[],miss:0,retry:false};$('#game').hidden=false;showQ()}
function body(q){const o=(arr)=>`<div class="opts">${arr.map((x,k)=>`<button class="opt ${q.ty==='listen'?'ar':''}" data-k="${k}" ${q.ty==='listen'?'lang="ar"':''}>${x}</button>`).join('')}</div>`;
 const rt=G.retry?'<p class="tag">Kesalahan sebelumnya</p>':'';
 if(q.ty==='choice')return `${rt}<h2>Pilih terjemahan yang benar</h2><div class="say">${mascot(90)}<button class="bubble ar" lang="ar" data-say="${q.ar}" aria-label="Dengarkan">🔊 ${q.ar}</button></div>${o(q.o)}`;
 if(q.ty==='listen')return `${rt}<h2>Pilih yang kamu dengar</h2><div class="snd"><button data-a="words" aria-label="Dengar per kata">🐢</button><button data-a="sent" aria-label="Dengar kalimat">🔊</button></div>${o(q.o)}`;
 if(q.ty==='speak')return `${rt}<h2>Ucapkan kalimat ini</h2><div class="say">${mascot(90)}<button class="bubble" data-say="${q.ar}"><span class="ar" lang="ar">${q.ar}</span><br>${q.id}</button></div><button class="mic" data-a="mic">🎙 Tekan lalu bicara</button><button class="link" data-a="skip">Tak bisa bicara sekarang</button>`;
 if(q.ty==='arrange')return `${rt}<h2>Susun kalimat ini</h2><div class="say">${mascot(90)}<div class="bubble">${q.id}</div></div><div class="line" id="ln" aria-label="Jawabanmu"></div><div class="line" id="bk"></div>`;
 return `${rt}<h2>Ketuk pasangan yang cocok</h2><div class="m2"><div class="opts" id="ml"></div><div class="opts" id="mr"></div></div>`}
function showQ(){const q=G.Q[G.i];G.sel=null;G.chk=false;
 $('#game').innerHTML=`<div class="gtop"><button class="x" data-a="quit" aria-label="Keluar">✕</button><div class="bar"><i style="width:${G.i/G.Q.length*100}%"></i></div><span id="hp" aria-label="${S.hearts} nyawa">❤️ ${S.hearts}</span></div><main class="gbody">${body(q)}</main><footer id="gfoot"><button class="btn" data-a="check" disabled>Periksa</button></footer>`;
 if(q.ty==='listen')say(q.ar);if(q.ty==='arrange')drawA();if(q.ty==='match')drawM()}
const en=on=>{const b=$('[data-a=check]');if(b)b.disabled=!on};
function drawA(){const q=G.Q[G.i];$('#ln').innerHTML=q.out.map((w,i)=>`<button class="tile ar" lang="ar" data-o="${i}">${w}</button>`).join('');$('#bk').innerHTML=q.tiles.map((w,i)=>q.out.includes(w)&&q.out.filter(x=>x===w).length>=q.tiles.filter(x=>x===w).length?'':`<button class="tile ar" lang="ar" data-t="${i}">${w}</button>`).join('');en(q.out.length>0)}
function drawM(){const q=G.Q[G.i];$('#ml').innerHTML=q.L.map(x=>`<button class="opt ar ${q.pa===x?'sel':''}" lang="ar" data-l="${x}" ${q.got.includes(x)?'disabled':''}>${x}</button>`).join('');$('#mr').innerHTML=q.R.map(x=>`<button class="opt" data-r="${x}" ${q.got.includes(q.ps.find(p=>p[1]===x)[0])?'disabled':''}>${x}</button>`).join('')}
function check(){const q=G.Q[G.i];let ok;
 if(q.ty==='choice'||q.ty==='listen'){ok=q.o[G.sel]===q.ans;$('#game').querySelectorAll('.opt').forEach((b,k)=>{b.disabled=true;if(q.o[k]===q.ans)b.classList.add('ok');else if(k===G.sel)b.classList.add('no')})}
 else if(q.ty==='arrange')ok=q.out.join(' ')===q.ar;
 else if(q.ty==='speak')ok=q.ok;else ok=!q.err;
 const f=$('#gfoot');f.className=ok?'good':'bad';f.setAttribute('role','status');
 const ans=q.ar?`<span class="ar" lang="ar">${q.ar}</span> — ${q.id}`:'';
 f.innerHTML=`<p><b>${ok?'✔ Benar!':'✖ Salah'}</b>${ans?(ok?`<br>Arti: ${q.id}`:`<br>Jawaban benar: ${ans}`):''}</p><button class="btn" data-a="next">Lanjutkan</button>`;
 $('[data-a=next]').focus();
 if(!ok){S.hearts--;save();G.wr.push({...q,out:[],got:[],pa:null,err:false,ok:null});if(!G.retry)G.miss++;$('#hp').textContent='❤️ '+S.hearts}}
function next(){if(S.hearts<1){return noHeart()}G.i++;if(G.i>=G.Q.length){if(G.wr.length){G.Q=G.wr;G.wr=[];G.i=0;G.retry=true}else return fin()}showQ()}
function noHeart(){$('#game').innerHTML=`<main class="gbody center"><h2>Kamu kehabisan nyawa!</h2>${mascot(120)}<p>Kamu punya 💎 ${S.gems}</p><button class="btn" data-a="buy" ${S.gems<50?'disabled':''}>Beli 1 nyawa (50 💎) dan lanjut</button><button class="link" data-a="quit">Keluar</button></main>`}
function fin(){const ok=15-G.miss,gems=ok*5,score=Math.round(ok/15*100);S.gems+=gems;if(!S.done.includes(G.lv))S.done.push(G.lv);
 const t=today(),y=new Date(Date.now()-864e5).toISOString().slice(0,10);let first=false;
 if(S.last!==t){S.streak=S.last===y?S.streak+1:1;S.last=t;S.days.push(t);S.days=S.days.slice(-14);first=true}save();G.first=first;
 $('#game').innerHTML=`<main class="gbody center"><h2>Level selesai! 🎉</h2>${mascot(140)}<p>Skor: <b>${score}</b>/100 (${ok} dari 15 benar di percobaan pertama)</p><p style="font-size:1.4rem">+${gems} 💎</p></main><footer id="gfoot"><button class="btn" data-a="fin">Lanjutkan</button></footer>`}
function showStreak(){const names=['Mg','Sn','Sl','Rb','Km','Jm','Sb'],d=new Date(),wk=[];
 for(let k=6;k>=0;k--){const x=new Date(d-k*864e5);wk.push([names[x.getDay()],S.days.includes(x.toISOString().slice(0,10))])}
 $('#streak').innerHTML=`<div class="flame" aria-hidden="true">🔥</div><div class="num">${S.streak}</div><p>hari beruntun</p><div class="wk">${wk.map(([n,on])=>`<span class="${on?'on':''}">${on?'✔':n}</span>`).join('')}</div><p>Belajarlah ${Math.max(7-S.streak%7,0)||7} hari lagi untuk meraih hadiah Minggu Sempurna!</p><button class="btn" data-a="closestreak">Yay, ${S.name}</button>`;$('#streak').hidden=false;$('[data-a=closestreak]').focus()}
function mic(b){if(!SR){return}const q=G.Q[G.i],r=new SR();r.lang='ar-SA';b.textContent='🎙 Mendengarkan…';
 r.onresult=e=>{const h=strip(e.results[0][0].transcript).split(/\s+/),t=strip(q.ar).split(/\s+/);const hit=t.filter(w=>h.includes(w)).length;q.ok=hit/t.length>=.6;b.classList.add('heard');b.textContent='🎙 Terekam. Tekan Periksa';G.sel=true;en(true)};
 r.onerror=()=>{b.textContent='🎙 Gagal, coba lagi'};r.start()}

/* ---------- Event ---------- */
document.addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;const d=t.dataset,q=G&&G.Q&&G.Q[G.i];
 if(d.tab){tab=d.tab;render();return}if(d.lv){start(+d.lv);return}if(d.say){say(d.say);return}
 if(d.skin){S.skin=+d.skin;render();return}if(d.hat){S.hat=d.hat;render();return}if(d.col){S.col=+d.col;render();return}
 if(d.fs){S.fs=Math.min(150,Math.max(80,S.fs+ +d.fs));render();return}
 if(d.k!==undefined&&q){G.sel=+d.k;$('#game').querySelectorAll('.opt').forEach(b=>b.classList.toggle('sel',b===t));en(true);return}
 if(d.t!==undefined){q.out.push(q.tiles[+d.t]);drawA();return}if(d.o!==undefined){q.out.splice(+d.o,1);drawA();return}
 if(d.l){q.pa=d.l;drawM();return}
 if(d.r&&q.pa){const p=q.ps.find(p=>p[0]===q.pa);if(p[1]===d.r){q.got.push(p[0])}else q.err=true;q.pa=null;drawM();if(q.got.length===5){G.sel=true;en(true)}return}
 switch(d.a){case 'streak':showStreak();break;case 'closestreak':$('#streak').hidden=true;break;case 'mat':openMat();break;case 'closemat':$('#mat').close();break;
 case 'glass':S.glass=S.glass?0:1;render();break;case 'hc':S.hc=S.hc?0:1;render();break;
 case 'refill':if(S.gems>=50){S.gems-=50;S.hearts=5;render()}break;
 case 'check':check();break;case 'next':next();break;case 'sent':say(q.ar);break;case 'words':sayWords(q.ar);break;
 case 'mic':mic(t);break;case 'skip':q.ok=true;G.sel=true;check();break;
 case 'buy':S.gems-=50;S.hearts=1;save();G.i++;if(G.i>=G.Q.length){if(G.wr.length){G.Q=G.wr;G.wr=[];G.i=0;G.retry=true}else{fin();break}}showQ();break;
 case 'quit':$('#game').hidden=true;render();break;
 case 'fin':$('#game').hidden=true;render();if(G.first)showStreak();break}});
document.addEventListener('input',e=>{if(e.target.id==='nt'){S.notes=e.target.value;save()}if(e.target.id==='nm'){S.name=e.target.value||'Pelajar';save()}});
render();
