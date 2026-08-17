import React,{useEffect,useMemo,useRef,useState}from'react';
import{createRoot}from'react-dom/client';
import gsap from'gsap';
import{ScrollTrigger}from'gsap/ScrollTrigger';
import Lenis from'lenis';
import'./styles.css';

gsap.registerPlugin(ScrollTrigger);

const stories=[
 {id:'DVSdxs5ko46',kind:'reel',tag:'FOOD',title:'The Food Run',copy:'A fast look at what people came to eat.'},
 {id:'DVm_IH5CSr_',kind:'p',tag:'NIGHT',title:'Satu Malam di Bazram',copy:'The stadium after sunset, packed and glowing.'},
 {id:'DVnAs5Hjqgr',kind:'p',tag:'PEOPLE',title:'Berbuka Together',copy:'Families, friends and the field filling up for iftar.'},
 {id:'DVkr2vMiQ_O',kind:'p',tag:'TIPS',title:'Plan Your Night',copy:'Useful reminders before heading to Stadium Merdeka.'}
];

const menus={
 MAINS:[['Nasi & Lauk','Filling plates for iftar','Zone A'],['Rice Bowls','Fast, familiar, easy to carry','Zone B'],['Local Favourites','Classic Ramadan comfort food','Zone C']],
 GRILL:[['Satay','Charcoal smoke, quick bites','Zone A'],['Ayam Percik','Hot from the grill','Zone A'],['Bara Specials','Grilled meats and skewers','Zone D']],
 DRINKS:[['Air Balang','Cold drinks for the walk','Zone B'],['Coffee','For the later hours','Zone C'],['Fruit & Soda','Easy refreshers','Zone B']],
 SWEETS:[['Kuih','Traditional favourites','Zone C'],['ABC','Cold dessert after iftar','Zone D'],['Sweet Things','Cakes, pastries and more','Zone C']]
};

function Embed({item}){return <div className="embed-wrap"><iframe title={item.title} src={`https://www.instagram.com/${item.kind}/${item.id}/embed/`} loading="lazy" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"/></div>}

function App(){
 const root=useRef(null);const[story,setStory]=useState(0);const[menu,setMenu]=useState('MAINS');
 const storyItem=stories[story];const menuItems=useMemo(()=>menus[menu],[menu]);
 useEffect(()=>{
   const lenis=new Lenis({duration:1.05,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);let raf;const loop=t=>{lenis.raf(t);raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
   const ctx=gsap.context(()=>{
     gsap.from('.hero-main>*',{y:28,opacity:0,stagger:.09,duration:.8,ease:'power3.out'});
     gsap.from('.hero-media',{clipPath:'inset(12% 0 0 12%)',duration:1.05,ease:'power3.out'});
     gsap.utils.toArray('.reveal').forEach(el=>gsap.from(el,{y:32,opacity:0,duration:.75,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 88%'}}));
     const tl=gsap.timeline({scrollTrigger:{trigger:'.senja',start:'top top',end:'bottom bottom',scrub:1.1}});
     tl.to('.senja-scene',{backgroundColor:'#C87E68'},0)
       .to('.senja-scene',{backgroundColor:'#727C7F'},.38)
       .to('.senja-scene',{backgroundColor:'#3F5560'},.62)
       .to('.senja-scene',{backgroundColor:'#24363F'},1)
       .to('.sun',{y:'42vh',opacity:.08},0)
       .to('.stadium-lights',{opacity:1},.56)
       .to('.time-one',{opacity:0},.25)
       .to('.time-two',{opacity:1},.34)
       .to('.time-two',{opacity:0},.66)
       .to('.time-three',{opacity:1},.72)
       .to('.tower-glow',{opacity:1},.7);
   },root);
   return()=>{cancelAnimationFrame(raf);ctx.revert();lenis.destroy()}
 },[]);
 return <main ref={root}>
   <nav className="topnav"><a className="brand" href="#top">BAZRAM <span>MERDEKA</span></a><div className="navlinks"><a href="#stories">Stories</a><a href="#makan">Makan</a><a href="#plan">Tonight</a><a href="#visit">Visit</a></div><a className="navcta" href="#visit">Plan your night ↗</a></nav>

   <section className="hero" id="top">
     <div className="hero-main"><p className="eyebrow">RAMADAN · STADIUM MERDEKA · KUALA LUMPUR</p><h1>BAZRAM<br/><span>MERDEKA</span></h1><p className="hero-copy">Food, people and a whole evening together at Stadium Merdeka.</p><div className="hero-facts"><b>21 FEB — 18 MAC</b><b>4PM — 11PM</b><b>100+ VENDORS</b></div><div className="hero-actions"><a href="#makan">Explore food</a><a href="#visit">Plan visit</a></div></div>
     <div className="hero-media"><Embed item={stories[1]}/><div className="media-label">BAZRAM AFTER DARK · @BAZRAMMERDEKA</div></div>
   </section>

   <section className="quick reveal">
     <article className="quick-title"><span>WHAT'S HERE</span><h2>A lot happening.<br/>Easy to understand.</h2></article>
     <article className="q coral"><strong>100+</strong><p>FOOD & DRINK<br/>VENDORS</p></article>
     <article className="q green"><strong>IFTAR</strong><p>PICNIC ON THE<br/>STADIUM FIELD</p></article>
     <article className="q blue"><strong>KL</strong><p>MERDEKA 118<br/>AFTER DARK</p></article>
     <article className="q mango"><strong>4—11</strong><p>FROM LATE<br/>AFTERNOON</p></article>
   </section>

   <section className="stories" id="stories">
     <header className="block-head reveal"><span>01 / STORIES FROM MERDEKA</span><h2>See the night<br/>before you arrive.</h2><p>Real Bazram posts, edited into one simple viewing area.</p></header>
     <div className="stories-stage reveal"><div className="story-main"><Embed item={storyItem}/></div><aside><div className="story-info"><span>{storyItem.tag}</span><h3>{storyItem.title}</h3><p>{storyItem.copy}</p><a target="_blank" rel="noreferrer" href={`https://www.instagram.com/${storyItem.kind}/${storyItem.id}/`}>Open original ↗</a></div><div className="story-tabs">{stories.map((s,i)=><button key={s.id} className={story===i?'active':''} onClick={()=>setStory(i)}><span>0{i+1}</span>{s.tag}</button>)}</div></aside></div>
   </section>

   <section className="makan" id="makan">
     <header className="block-head reveal"><span>02 / MAKAN</span><h2>Nak makan apa?</h2><p>Choose a mood, then head straight to the right zone.</p></header>
     <div className="menu-tabs">{Object.keys(menus).map(k=><button className={menu===k?'active':''} onClick={()=>setMenu(k)} key={k}>{k}</button>)}</div>
     <div className="menu-grid reveal">{menuItems.map((x,i)=><article key={x[0]}><span>0{i+1}</span><h3>{x[0]}</h3><p>{x[1]}</p><b>{x[2]}</b></article>)}</div>
   </section>

   <section className="senja">
     <div className="senja-scene"><div className="sun"/><div className="tower"><i className="tower-glow"/></div><div className="city"><i/><i/><i/><i/><i/><i/></div><div className="stadium-form"><span>STADIUM MERDEKA</span></div><div className="stadium-lights">{Array.from({length:14}).map((_,i)=><i key={i}/>)}</div><div className="senja-copy"><span>03 / THE SHIFT</span><h2>FROM SENJA<br/>TO MALAM.</h2><p className="clock time-one">5:40 PM · warm light across the field</p><p className="clock time-two">7:05 PM · first lights come on</p><p className="clock time-three">8:00 PM · Bazram after dark</p></div></div>
   </section>

   <section className="plan" id="plan">
     <header className="block-head reveal"><span>04 / PLAN YOUR NIGHT</span><h2>Know where to go.<br/>Then relax.</h2><p>Everything useful in one section.</p></header>
     <div className="plan-grid reveal"><div className="timeline">{[['4:00','Gates open'],['5:30','Best time to browse food'],['7:20','Settle in for iftar'],['7:30','Communal iftar'],['8:15','Night programme & moreh']].map(x=><div><b>{x[0]}</b><span>{x[1]}</span></div>)}</div><div className="map"><div className="map-ring outer"/><div className="map-ring inner"/><div className="field">IFTAR FIELD</div><span className="pin p1">HOT FOOD</span><span className="pin p2">DRINKS</span><span className="pin p3">PICNIC</span><span className="pin p4">PRAYER</span></div></div>
   </section>

   <section className="visit" id="visit"><div><span>05 / VISIT</span><h2>COME TO<br/>MERDEKA.</h2></div><div className="visit-info"><p><b>WHERE</b><br/>Stadium Merdeka<br/>Kuala Lumpur</p><p><b>WHEN</b><br/>Daily<br/>4PM — 11PM</p><p><b>GETTING HERE</b><br/>Public transport<br/>recommended</p></div><a target="_blank" rel="noreferrer" href="https://www.instagram.com/bazrammerdeka/">FOLLOW @BAZRAMMERDEKA ↗</a></section>
 </main>
}
createRoot(document.getElementById('root')).render(<App/>);