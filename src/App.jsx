import { useState, useEffect, useRef, memo, useCallback } from "react";

const SPLIT = ["Push", "Pull", "Legs", "Arms & Shoulders"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const EXERCISES_DEFAULT = {
  Push: ["Bench Press","Incline Bench Press","Decline Bench Press","Push-Up","Dumbbell Flye","Cable Crossover","Chest Dip","Overhead Press","Arnold Press","Lateral Raise","Incline Dumbbell Press","Decline Push-Up","Pec Deck Machine","Cable Chest Press","Landmine Press","Close-Grip Bench Press","Dumbbell Pullover","Seated Chest Press Machine","Single-Arm Cable Flye","Floor Press"],
  Pull: ["Pull-Up","Chin-Up","Barbell Row","Dumbbell Row","Cable Row","Lat Pulldown","Face Pull","Deadlift","Romanian Deadlift","Shrug","T-Bar Row","Pendlay Row","Meadows Row","Rack Pull","Inverted Row","Single-Arm Lat Pulldown","Cable Pullover","Seated Cable Row","Chest-Supported Row","Reverse Grip Pulldown"],
  Legs: ["Squat","Front Squat","Leg Press","Lunges","Bulgarian Split Squat","Leg Extension","Leg Curl","Calf Raise","Hip Thrust","Sumo Deadlift","Hack Squat","Goblet Squat","Step-Up","Nordic Curl","Glute Bridge","Seated Calf Raise","Single-Leg Press","Reverse Lunge","Sissy Squat","Cable Pull-Through"],
  "Arms & Shoulders": ["Barbell Curl","Dumbbell Curl","Hammer Curl","Preacher Curl","Tricep Pushdown","Skull Crusher","Tricep Dip","Concentration Curl","Overhead Tricep Extension","Cable Curl","Military Press","Dumbbell Shoulder Press","Upright Row","Front Raise","Lateral Raise","Reverse Flye","Cable Lateral Raise","Face Pull","Seated DB Press","Push Press"],
};
const EXERCISE_INFO = {
  "Bench Press":{muscles:"Chest, Triceps, Front Delts",tip:"Keep shoulder blades retracted and feet flat. Lower bar to mid-chest with control."},
  "Incline Bench Press":{muscles:"Upper Chest, Triceps, Front Delts",tip:"Set bench to 30-45°. Keep elbows at 45° from torso."},
  "Decline Bench Press":{muscles:"Lower Chest, Triceps",tip:"Grip slightly wider than shoulder-width. Control the descent."},
  "Push-Up":{muscles:"Chest, Triceps, Shoulders",tip:"Keep core tight and body in a straight line."},
  "Dumbbell Flye":{muscles:"Chest, Front Delts",tip:"Slight bend in elbows. Lower until you feel a stretch."},
  "Cable Crossover":{muscles:"Chest",tip:"Lean slightly forward. Bring hands together in a hugging motion."},
  "Chest Dip":{muscles:"Lower Chest, Triceps",tip:"Lean forward to target chest. Upper arms parallel at bottom."},
  "Overhead Press":{muscles:"Shoulders, Triceps, Upper Chest",tip:"Press directly overhead. Brace core and avoid arching back."},
  "Arnold Press":{muscles:"All Deltoid Heads, Triceps",tip:"Rotate palms outward as you press up."},
  "Lateral Raise":{muscles:"Side Delts",tip:"Slight bend in elbows. Raise to shoulder height only."},
  "Incline Dumbbell Press":{muscles:"Upper Chest, Triceps",tip:"Let dumbbells travel in a slight arc. Pause at the top."},
  "Decline Push-Up":{muscles:"Upper Chest, Shoulders",tip:"Feet elevated on a bench. Same form as standard push-up."},
  "Pec Deck Machine":{muscles:"Chest",tip:"Adjust seat so handles are at chest level. Squeeze at peak."},
  "Cable Chest Press":{muscles:"Chest, Triceps",tip:"Stand between cables at chest height. Constant tension throughout."},
  "Landmine Press":{muscles:"Upper Chest, Shoulders",tip:"Press the bar up and away at an angle."},
  "Close-Grip Bench Press":{muscles:"Triceps, Inner Chest",tip:"Grip shoulder-width apart. Keep elbows tucked."},
  "Dumbbell Pullover":{muscles:"Chest, Lats, Serratus",tip:"Keep a slight bend in elbows. Lower slowly behind head."},
  "Seated Chest Press Machine":{muscles:"Chest, Triceps",tip:"Adjust seat so handles align with mid-chest."},
  "Single-Arm Cable Flye":{muscles:"Chest",tip:"Great for correcting imbalances. Keep movement smooth."},
  "Floor Press":{muscles:"Chest, Triceps",tip:"Triceps rest on floor at bottom. Pure pressing strength."},
  "Pull-Up":{muscles:"Lats, Biceps, Rear Delts",tip:"Start from a dead hang. Drive elbows down and back."},
  "Chin-Up":{muscles:"Lats, Biceps",tip:"Underhand grip. Biceps more involved. Squeeze at top."},
  "Barbell Row":{muscles:"Lats, Rhomboids, Biceps",tip:"Hinge at hips ~45°. Pull bar to lower chest."},
  "Dumbbell Row":{muscles:"Lats, Rhomboids, Biceps",tip:"Support with a bench. Pull elbow up and back."},
  "Cable Row":{muscles:"Mid Back, Lats, Biceps",tip:"Sit tall, chest up. Pull to lower chest, pause before releasing."},
  "Lat Pulldown":{muscles:"Lats, Biceps",tip:"Pull to upper chest leaning slightly back. Avoid swinging."},
  "Face Pull":{muscles:"Rear Delts, Rotator Cuff, Traps",tip:"Pull rope to face level, elbows flaring out."},
  "Deadlift":{muscles:"Hamstrings, Glutes, Back, Traps",tip:"Neutral spine. Push the floor away rather than pulling up."},
  "Romanian Deadlift":{muscles:"Hamstrings, Glutes, Lower Back",tip:"Hinge at hips. Feel a deep hamstring stretch."},
  "Shrug":{muscles:"Traps",tip:"Lift straight up — don't roll shoulders. Pause at top."},
  "T-Bar Row":{muscles:"Mid Back, Lats, Biceps",tip:"Full range of motion — stretch at bottom, squeeze at top."},
  "Pendlay Row":{muscles:"Back, Biceps",tip:"Bar returns to floor each rep. More explosive than standard row."},
  "Meadows Row":{muscles:"Lats, Teres Major",tip:"Landmine attachment, staggered stance. Excellent lat stretch."},
  "Rack Pull":{muscles:"Traps, Upper Back, Glutes",tip:"Set pins at knee height. Great for lockout strength."},
  "Inverted Row":{muscles:"Mid Back, Biceps, Rear Delts",tip:"Keep body straight. More horizontal = harder."},
  "Single-Arm Lat Pulldown":{muscles:"Lats, Biceps",tip:"Lean slightly away from cable for a better stretch."},
  "Cable Pullover":{muscles:"Lats, Chest",tip:"Keep arms nearly straight. Pull with lats, not arms."},
  "Seated Cable Row":{muscles:"Mid Back, Lats, Biceps",tip:"Keep chest tall — don't round forward."},
  "Chest-Supported Row":{muscles:"Mid Back, Rear Delts, Biceps",tip:"Chest on incline bench removes lower back stress."},
  "Reverse Grip Pulldown":{muscles:"Lats, Biceps",tip:"Underhand grip hits lower lats more. Pull to upper chest."},
  "Squat":{muscles:"Quads, Glutes, Hamstrings",tip:"Chest up, knees over toes. Break parallel for full range."},
  "Front Squat":{muscles:"Quads, Core, Upper Back",tip:"Bar on front delts, elbows high. Good ankle mobility needed."},
  "Leg Press":{muscles:"Quads, Glutes, Hamstrings",tip:"Don't lock knees at top. Foot position changes emphasis."},
  "Lunges":{muscles:"Quads, Glutes, Hamstrings",tip:"Step far enough so front shin stays vertical."},
  "Bulgarian Split Squat":{muscles:"Quads, Glutes",tip:"Rear foot elevated. Drop straight down — don't lunge forward."},
  "Leg Extension":{muscles:"Quads",tip:"Pause at top for peak contraction. Use controlled tempo."},
  "Leg Curl":{muscles:"Hamstrings",tip:"Don't let hips rise. Curl all the way and lower slowly."},
  "Calf Raise":{muscles:"Gastrocnemius, Soleus",tip:"Full range — stretch at bottom, pause at top."},
  "Hip Thrust":{muscles:"Glutes, Hamstrings",tip:"Upper back on bench, chin tucked. Squeeze hard at extension."},
  "Sumo Deadlift":{muscles:"Glutes, Inner Thighs, Hamstrings",tip:"Wide stance, toes out. Push knees out as you pull."},
  "Hack Squat":{muscles:"Quads, Glutes",tip:"Feet higher targets glutes. Keep back flat against pad."},
  "Goblet Squat":{muscles:"Quads, Glutes, Core",tip:"Hold weight at chest. Naturally keeps torso upright."},
  "Step-Up":{muscles:"Quads, Glutes",tip:"Drive through the heel of the elevated foot."},
  "Nordic Curl":{muscles:"Hamstrings",tip:"Anchor feet and lower slowly. One of the best hamstring exercises."},
  "Glute Bridge":{muscles:"Glutes, Hamstrings",tip:"Feet flat, drive hips up, squeeze hard."},
  "Seated Calf Raise":{muscles:"Soleus",tip:"Targets the deeper soleus. Use slow tempo and full range."},
  "Single-Leg Press":{muscles:"Quads, Glutes",tip:"Good for fixing imbalances. Don't lock out the knee."},
  "Reverse Lunge":{muscles:"Quads, Glutes",tip:"Step back — less knee stress. Keep front shin vertical."},
  "Sissy Squat":{muscles:"Quads",tip:"Hold something for balance and lean back as you drop knees."},
  "Cable Pull-Through":{muscles:"Glutes, Hamstrings",tip:"Hinge at hips. Arms straight — glutes do the work."},
  "Barbell Curl":{muscles:"Biceps, Brachialis",tip:"Keep elbows pinned at sides. Don't swing."},
  "Dumbbell Curl":{muscles:"Biceps",tip:"Supinate wrist as you curl for full bicep contraction."},
  "Hammer Curl":{muscles:"Brachialis, Biceps, Brachioradialis",tip:"Neutral grip throughout. Targets the brachialis."},
  "Preacher Curl":{muscles:"Biceps, Brachialis",tip:"Full stretch at the bottom is key."},
  "Tricep Pushdown":{muscles:"Triceps",tip:"Keep elbows fixed. Fully extend and squeeze at the bottom."},
  "Skull Crusher":{muscles:"Triceps",tip:"Lower bar to forehead. Upper arms vertical throughout."},
  "Tricep Dip":{muscles:"Triceps, Chest, Shoulders",tip:"Stay upright for tricep focus."},
  "Concentration Curl":{muscles:"Biceps",tip:"Elbow braced on inner thigh. Fully supinate at top."},
  "Overhead Tricep Extension":{muscles:"Triceps Long Head",tip:"Elbows pointing forward. Great stretch on long head."},
  "Cable Curl":{muscles:"Biceps",tip:"Constant tension throughout. Great finishing exercise."},
  "Military Press":{muscles:"All Deltoid Heads, Triceps",tip:"Standing adds core demand. Press from chin to overhead."},
  "Dumbbell Shoulder Press":{muscles:"Shoulders, Triceps",tip:"Lower until elbows just below shoulder height."},
  "Upright Row":{muscles:"Side Delts, Traps",tip:"Wider grip reduces impingement risk. Pull to chin height."},
  "Front Raise":{muscles:"Front Delts",tip:"Lift to shoulder height only."},
  "Reverse Flye":{muscles:"Rear Delts, Rhomboids",tip:"Hinge forward. Lead with elbows, not hands."},
  "Cable Lateral Raise":{muscles:"Side Delts",tip:"Cross cable in front. Constant tension unlike dumbbells."},
  "Behind-the-Neck Press":{muscles:"Shoulders, Triceps",tip:"Requires good mobility. Use lighter weight."},
  "Seated DB Press":{muscles:"Shoulders, Triceps",tip:"Backrest reduces lower back strain. Press overhead."},
  "Machine Shoulder Press":{muscles:"Shoulders, Triceps",tip:"Fixed path great for beginners or finishers."},
  "Push Press":{muscles:"Shoulders, Triceps, Legs",tip:"Use slight leg drive to initiate then lock out overhead."},
};
const CAT_COLORS={Push:"#f97316",Pull:"#3b82f6",Legs:"#22c55e","Arms & Shoulders":"#a855f7",Arms:"#a855f7",Shoulders:"#a855f7"};
const QUOTES=["The only bad workout is the one that didn't happen.","Train hard, recover harder.","Progress, not perfection.","Every rep is a step forward.","Discipline is the bridge between goals and accomplishment.","Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't."];
const CAT_MET={Push:5,Pull:5,Legs:6,"Arms & Shoulders":4,Arms:4,Shoulders:4};

function load(k,fb){try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch{return fb;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
const initSet=()=>({weight:"",reps:"",bodyweight:false,done:false,warmup:false});
const fmtTime=s=>{const m=Math.floor(s/60),sec=s%60;return`${m}:${String(sec).padStart(2,"0")}`;};

function useTheme(){
  const [dark,setDark]=useState(()=>load("pt_dark",false));
  useEffect(()=>{save("pt_dark",dark);},[dark]);
  const th=dark?{bg:"#0f172a",card:"#1e293b",text:"#f1f5f9",muted:"#94a3b8",accent:"#3b9eff",border:"#334155",radius:16,dark:true}
                :{bg:"#f0f4f8",card:"#ffffff",text:"#0f172a",muted:"#64748b",accent:"#3b9eff",border:"#e2e8f0",radius:16,dark:false};
  return[th,()=>setDark(d=>!d)];
}

const mkCard=(t)=>({children,style={},onClick})=>(
  <div onClick={onClick} style={{background:t.card,borderRadius:t.radius,padding:"16px",marginBottom:10,boxShadow:t.dark?"none":"0 1px 4px rgba(0,0,0,0.07)",border:t.dark?`1px solid ${t.border}`:"none",cursor:onClick?"pointer":"default",...style}}>{children}</div>
);
const mkBack=(t)=>({onClick,label})=>(
  <button onClick={onClick} style={{background:"none",border:"none",color:t.accent,fontWeight:700,fontSize:14,cursor:"pointer",padding:"16px 0 8px",display:"flex",alignItems:"center",gap:4}}>
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
    {label}
  </button>
);

// ── Isolated Set Row — prevents keyboard dismissal ───────────────────────────
const SetRow = memo(({s, i, t, onSave, onBW, onDone, onWarmup, onRemove}) => {
  const wRef = useRef(s.weight||"");
  const rRef = useRef(s.reps||"");
  const wInput = useRef(null);
  const rInput = useRef(null);

  useEffect(()=>{
    if(wInput.current && document.activeElement !== wInput.current) wInput.current.value = s.weight||"";
    if(rInput.current && document.activeElement !== rInput.current) rInput.current.value = s.reps||"";
  },[s.weight, s.reps]);

  const bg = s.warmup?(t.dark?"#1e293b":"#fef9c3"):s.done?(t.dark?"#14532d":"#f0fdf4"):t.bg;

  return(
    <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 36px 36px 36px 24px",gap:4,marginBottom:6,alignItems:"center",background:bg,borderRadius:10,padding:"6px 4px"}}>
      <div style={{textAlign:"center",fontSize:12,fontWeight:700,color:s.warmup?"#f59e0b":t.muted}}>{s.warmup?"W":i+1}</div>
      <input
        ref={wInput}
        disabled={s.bodyweight}
        type="text"
        inputMode="decimal"
        placeholder={s.bodyweight?"BW":"0"}
        defaultValue={s.weight||""}
        onChange={e=>{wRef.current=e.target.value;}}
        onBlur={()=>onSave("weight", wRef.current)}
        style={{padding:"6px",borderRadius:8,border:`1px solid ${t.border}`,fontSize:14,textAlign:"center",background:s.bodyweight?(t.dark?"#0f172a":"#f1f5f9"):t.card,color:t.text,outline:"none",width:"100%",boxSizing:"border-box"}}
      />
      <input
        ref={rInput}
        type="text"
        inputMode="numeric"
        placeholder="0"
        defaultValue={s.reps||""}
        onChange={e=>{rRef.current=e.target.value;}}
        onBlur={()=>onSave("reps", rRef.current)}
        style={{padding:"6px",borderRadius:8,border:`1px solid ${t.border}`,fontSize:14,textAlign:"center",background:t.card,color:t.text,outline:"none",width:"100%",boxSizing:"border-box"}}
      />
      <button onClick={onBW} style={{height:30,borderRadius:8,border:`1px solid ${s.bodyweight?"#3b82f6":t.border}`,fontSize:10,fontWeight:700,background:s.bodyweight?"#dbeafe":t.card,color:s.bodyweight?"#3b82f6":t.muted,cursor:"pointer"}}>BW</button>
      <button onClick={onWarmup} style={{height:30,borderRadius:8,border:`1px solid ${s.warmup?"#f59e0b":t.border}`,fontSize:10,fontWeight:700,background:s.warmup?"#fef3c7":t.card,color:s.warmup?"#f59e0b":t.muted,cursor:"pointer"}}>WU</button>
      <button onClick={onDone} style={{width:30,height:30,borderRadius:"50%",border:"none",background:s.done?"#22c55e":t.border,color:"#fff",fontSize:14,cursor:"pointer",margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>{s.done?"✓":""}</button>
      <button onClick={onRemove} style={{background:"none",border:"none",color:t.muted,fontSize:16,cursor:"pointer",textAlign:"center"}}>×</button>
    </div>
  );
});

// ── Rest Timer ───────────────────────────────────────────────────────────────
function RestTimer({onClose,t}){
  const [dur,setDur]=useState(90),[sec,setSec]=useState(90),[run,setRun]=useState(true);
  const endRef=useRef(Date.now()+90000),wakeRef=useRef(null),doneRef=useRef(false);
  const notify=()=>{
    try{navigator.vibrate&&navigator.vibrate([200,100,200]);}catch(e){}
    try{const Ctx=window.AudioContext||window.webkitAudioContext;if(Ctx){const ac=new Ctx();const o=ac.createOscillator(),g=ac.createGain();o.connect(g);g.connect(ac.destination);o.type="sine";o.frequency.value=880;g.gain.setValueAtTime(0.0001,ac.currentTime);g.gain.exponentialRampToValueAtTime(0.3,ac.currentTime+0.02);g.gain.exponentialRampToValueAtTime(0.0001,ac.currentTime+0.6);o.start();o.stop(ac.currentTime+0.6);}}catch(e){}
  };
  // Countdown driven by a wall-clock end time so it stays accurate when the
  // device sleeps or the app is backgrounded (JS timers get throttled/paused).
  useEffect(()=>{
    if(!run)return;
    const tick=()=>{const left=Math.max(0,Math.round((endRef.current-Date.now())/1000));setSec(left);if(left<=0&&!doneRef.current){doneRef.current=true;setRun(false);notify();}};
    tick();
    const id=setInterval(tick,250);
    const onVis=()=>{if(document.visibilityState==="visible")tick();};
    document.addEventListener("visibilitychange",onVis);
    window.addEventListener("focus",onVis);
    return()=>{clearInterval(id);document.removeEventListener("visibilitychange",onVis);window.removeEventListener("focus",onVis);};
  },[run]);
  // Hold a screen wake lock while running so the phone doesn't sleep mid-set;
  // re-acquire it when returning to the app.
  useEffect(()=>{
    if(!run)return;
    let active=true;
    const request=async()=>{try{if("wakeLock"in navigator){const wl=await navigator.wakeLock.request("screen");if(active)wakeRef.current=wl;else wl.release();}}catch(e){}};
    request();
    const onVis=()=>{if(document.visibilityState==="visible"&&active)request();};
    document.addEventListener("visibilitychange",onVis);
    return()=>{active=false;document.removeEventListener("visibilitychange",onVis);if(wakeRef.current){wakeRef.current.release().catch(()=>{});wakeRef.current=null;}};
  },[run]);
  const start=s=>{setDur(s);doneRef.current=false;endRef.current=Date.now()+s*1000;setSec(s);setRun(true);};
  const toggle=()=>{if(run){setRun(false);}else{doneRef.current=false;endRef.current=Date.now()+sec*1000;setRun(true);}};
  const pct=Math.min(100,((dur-sec)/dur)*100);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}>
      <div style={{background:t.card,borderRadius:24,padding:32,width:"100%",maxWidth:300,textAlign:"center"}}>
        <div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:20}}>Rest Timer</div>
        <div style={{position:"relative",width:130,height:130,margin:"0 auto 20px"}}>
          <svg width="130" height="130" viewBox="0 0 130 130" style={{transform:"rotate(-90deg)"}}>
            <circle cx="65" cy="65" r="56" fill="none" stroke={t.border} strokeWidth="9"/>
            <circle cx="65" cy="65" r="56" fill="none" stroke={t.accent} strokeWidth="9" strokeDasharray={`${2*Math.PI*56}`} strokeDashoffset={`${2*Math.PI*56*(1-pct/100)}`} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s linear"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:28,fontWeight:800,color:sec<=10?"#ef4444":t.text}}>{fmtTime(sec)}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>
          {[60,90,120].map(s=><button key={s} onClick={()=>start(s)} style={{padding:"4px 12px",borderRadius:99,background:s===dur?t.accent:t.bg,border:`1px solid ${s===dur?t.accent:t.border}`,fontSize:12,fontWeight:600,color:s===dur?"#fff":t.text,cursor:"pointer"}}>{s}s</button>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <button onClick={toggle} style={{flex:1,padding:"10px",borderRadius:12,background:t.bg,border:`1px solid ${t.border}`,fontWeight:700,color:t.text,cursor:"pointer"}}>{run?"Pause":"Resume"}</button>
          <button onClick={onClose} style={{flex:1,padding:"10px",borderRadius:12,background:t.accent,border:"none",fontWeight:700,color:"#fff",cursor:"pointer"}}>Done</button>
        </div>
      </div>
    </div>
  );
}

function CircleProg({pct,color,size=52,stroke=5}){
  const r=(size-stroke*2)/2,circ=2*Math.PI*r;
  return(<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(128,128,128,0.15)" strokeWidth={stroke}/>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.8s ease"}}/>
  </svg>);
}

function Sparkline({data,color,w=120,h=40}){
  if(!data||data.length<2)return null;
  const min=Math.min(...data),max=Math.max(...data),range=max-min||1;
  const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/range)*(h-4)-2}`).join(" ");
  return(<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
}

// ── 1RM Calculator ───────────────────────────────────────────────────────────
function OneRMCalc({t,onClose}){
  const [weight,setWeight]=useState("");const [reps,setReps]=useState("");
  const calc=()=>{const w=parseFloat(weight),r=parseInt(reps);if(!w||!r||r<1)return null;return+(w*(1+r/30)).toFixed(1);};
  const orm=calc();const pcts=[100,95,90,85,80,75,70];
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:16}}>
      <div style={{background:t.card,borderRadius:24,padding:24,width:"100%",maxWidth:320}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:16,fontWeight:700,color:t.text}}>1RM Calculator</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:t.muted,fontSize:20,cursor:"pointer"}}>×</button>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:t.muted,marginBottom:4}}>WEIGHT (KG)</div><input type="text" inputMode="decimal" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="e.g. 100" style={{width:"100%",padding:"10px",borderRadius:10,border:`1px solid ${t.border}`,fontSize:15,color:t.text,background:t.bg,outline:"none",boxSizing:"border-box",textAlign:"center"}}/></div>
          <div style={{flex:1}}><div style={{fontSize:11,fontWeight:700,color:t.muted,marginBottom:4}}>REPS</div><input type="text" inputMode="numeric" value={reps} onChange={e=>setReps(e.target.value)} placeholder="e.g. 8" style={{width:"100%",padding:"10px",borderRadius:10,border:`1px solid ${t.border}`,fontSize:15,color:t.text,background:t.bg,outline:"none",boxSizing:"border-box",textAlign:"center"}}/></div>
        </div>
        {orm&&(<><div style={{background:t.accent+"18",borderRadius:12,padding:"12px",textAlign:"center",marginBottom:12}}><div style={{fontSize:12,fontWeight:700,color:t.accent,marginBottom:2}}>ESTIMATED 1RM</div><div style={{fontSize:32,fontWeight:800,color:t.accent}}>{orm}kg</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>{pcts.map(p=>(<div key={p} style={{background:t.bg,borderRadius:10,padding:"8px",textAlign:"center"}}><div style={{fontSize:11,color:t.muted,fontWeight:600}}>{p}%</div><div style={{fontSize:14,fontWeight:700,color:t.text}}>{+(orm*p/100).toFixed(1)}kg</div></div>))}</div>
        </>)}
      </div>
    </div>
  );
}

// ── Exercise Screen ──────────────────────────────────────────────────────────
function ExerciseScreen({t, activeCat, activeEx, sets, setSets, activePlan, elapsed, workoutStart, sessionNotes, setSessionNotes, onBack, onSave, showTimer, setShowTimer}){
  const pr = (() => {
    const log = load("pt_log",[]);
    const e=log.filter(e=>e.exercise===activeEx);if(!e.length)return null;let b=0;e.forEach(e=>e.sets.forEach(s=>{if(!s.bodyweight&&!s.warmup&&+s.weight>b)b=+s.weight;}));return b>0?b:null;
  })();
  const [showORM,setShowORM]=useState(false);
  const [targetReps,setTargetReps]=useState(()=>{const tgt=load("pt_targets",{});return tgt[activeEx]?.reps||"";});
  const [targetSets,setTargetSets]=useState(()=>{const tgt=load("pt_targets",{});return tgt[activeEx]?.sets||"";});
  const info=EXERCISE_INFO[activeEx];
  const ytUrl=`https://www.youtube.com/results?search_query=${encodeURIComponent(activeEx+" exercise tutorial form")}`;
  const cc=CAT_COLORS[activeCat];
  const workingSets=sets.filter(s=>!s.warmup);

  const updSet=useCallback((i,f,v)=>setSets(p=>p.map((s,idx)=>idx===i?{...s,[f]:v}:s)),[setSets]);
  const togBW=useCallback(i=>setSets(p=>p.map((s,idx)=>idx===i?{...s,bodyweight:!s.bodyweight,weight:""}:s)),[setSets]);
  const togDone=useCallback(i=>{setSets(p=>p.map((s,idx)=>idx===i?{...s,done:!s.done}:s));setShowTimer(true);},[setSets,setShowTimer]);
  const togWarmup=useCallback(i=>setSets(p=>p.map((s,idx)=>idx===i?{...s,warmup:!s.warmup}:s)),[setSets]);
  const remSet=useCallback(i=>setSets(p=>p.filter((_,idx)=>idx!==i)),[setSets]);
  const addSet=useCallback(()=>setSets(p=>[...p,initSet()]),[setSets]);

  return(
    <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:16,paddingBottom:8}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:t.accent,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          {activePlan?activePlan.name:"Back"}
        </button>
        <div style={{display:"flex",gap:8}}>
          <button onClick={()=>setShowORM(true)} style={{padding:"5px 10px",borderRadius:99,border:`1px solid ${t.border}`,background:t.bg,fontSize:11,fontWeight:700,color:t.muted,cursor:"pointer"}}>1RM</button>
          {workoutStart&&<div style={{padding:"5px 10px",borderRadius:99,background:t.accent+"18",fontSize:11,fontWeight:700,color:t.accent}}>{fmtTime(elapsed)}</div>}
        </div>
      </div>
      <div style={{marginBottom:12}}><div style={{fontSize:22,fontWeight:800,color:t.text}}>{activeEx}</div>{pr&&<div style={{fontSize:13,color:t.muted,marginTop:2}}>Current PR: <b style={{color:t.text}}>{pr}kg</b></div>}</div>
      <div style={{background:t.dark?"#1e3a5f":"#f0f7ff",borderRadius:12,padding:"10px 14px",marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontSize:11,fontWeight:700,color:t.accent,whiteSpace:"nowrap"}}>TARGET</div>
        <input type="text" inputMode="numeric" value={targetSets} onChange={e=>setTargetSets(e.target.value)} placeholder="Sets" style={{width:50,padding:"5px 8px",borderRadius:8,border:`1px solid ${t.border}`,fontSize:13,color:t.text,background:t.card,outline:"none",textAlign:"center"}}/>
        <div style={{fontSize:12,color:t.muted}}>sets ×</div>
        <input type="text" inputMode="numeric" value={targetReps} onChange={e=>setTargetReps(e.target.value)} placeholder="Reps" style={{width:50,padding:"5px 8px",borderRadius:8,border:`1px solid ${t.border}`,fontSize:13,color:t.text,background:t.card,outline:"none",textAlign:"center"}}/>
        <div style={{fontSize:12,color:t.muted}}>reps</div>
        {targetSets&&targetReps&&<div style={{fontSize:11,fontWeight:700,color:"#22c55e",marginLeft:"auto"}}>{workingSets.length}/{targetSets}</div>}
      </div>
      {info&&(<div style={{background:t.dark?"#1e3a5f":"#f0f7ff",borderRadius:14,padding:"12px 14px",marginBottom:12,borderLeft:`3px solid ${t.accent}`}}>
        <div style={{fontSize:11,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Muscles worked</div>
        <div style={{fontSize:13,fontWeight:600,color:t.text,marginBottom:8}}>{info.muscles}</div>
        <div style={{fontSize:11,fontWeight:700,color:t.accent,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Form tip</div>
        <div style={{fontSize:13,color:t.text,lineHeight:1.5,marginBottom:10}}>{info.tip}</div>
        <a href={ytUrl} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:99,background:"#ff0000",color:"#fff",fontSize:12,fontWeight:700,textDecoration:"none"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.2 2.8 12 2.8 12 2.8s-4.2 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2.1.3 4.2.3 4.2s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.3 21.6 12 21.6 12 21.6s4.2 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.1.3-4.2v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z"/></svg>
          Watch on YouTube
        </a>
      </div>)}
      <div style={{background:t.card,borderRadius:t.radius,padding:"16px",marginBottom:12,border:t.dark?`1px solid ${t.border}`:"none",boxShadow:t.dark?"none":"0 1px 4px rgba(0,0,0,0.07)"}}>
        <div style={{display:"grid",gridTemplateColumns:"24px 1fr 1fr 36px 36px 36px 24px",gap:4,marginBottom:8}}>
          {["#","Weight","Reps","BW","WU","✓",""].map(h=><div key={h} style={{fontSize:9,fontWeight:700,color:t.muted,textTransform:"uppercase",textAlign:"center"}}>{h}</div>)}
        </div>
        {sets.map((s,i)=>(
          <SetRow key={i} s={s} i={i} t={t}
            onSave={(f,v)=>updSet(i,f,v)}
            onBW={()=>togBW(i)}
            onDone={()=>togDone(i)}
            onWarmup={()=>togWarmup(i)}
            onRemove={()=>remSet(i)}/>
        ))}
        <button onClick={addSet} style={{width:"100%",marginTop:4,padding:"8px",borderRadius:10,border:`1.5px dashed ${t.border}`,background:"none",color:t.muted,fontWeight:600,fontSize:12,cursor:"pointer"}}>+ Add set</button>
      </div>
      <textarea value={sessionNotes} onChange={e=>setSessionNotes(e.target.value)} placeholder="Notes for this exercise…" rows={2} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1px solid ${t.border}`,fontSize:13,color:t.text,background:t.card,outline:"none",marginBottom:10,boxSizing:"border-box",resize:"none",fontFamily:"inherit"}}/>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setShowTimer(true)} style={{flex:1,padding:"13px",borderRadius:14,border:`1px solid ${t.border}`,background:t.card,fontWeight:700,fontSize:14,color:t.text,cursor:"pointer"}}>⏱ Rest</button>
        <button onClick={()=>onSave(targetReps,targetSets)} style={{flex:1,padding:"13px",borderRadius:14,border:"none",background:cc||t.accent,fontWeight:800,fontSize:14,color:"#fff",cursor:"pointer"}}>Save</button>
      </div>
      {showTimer&&<RestTimer onClose={()=>setShowTimer(false)} t={t}/>}
      {showORM&&<OneRMCalc t={t} onClose={()=>setShowORM(false)}/>}
    </div>
  );
}

// ── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({log,t,onGoWorkout,userName}){
  const [now,setNow]=useState(new Date());
  const [water,setWater]=useState(()=>load("pt_water_"+new Date().toDateString(),0));
  useEffect(()=>{const ti=setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(ti);},[]);
  useEffect(()=>{save("pt_water_"+new Date().toDateString(),water);},[water]);
  const Card=mkCard(t);
  const getNext=()=>{if(!log.length)return SPLIT[0];const last=log[0].category;const norm=(last==="Arms"||last==="Shoulders")?"Arms & Shoulders":last;return SPLIT[(SPLIT.indexOf(norm)+1)%SPLIT.length];};
  const getStreak=()=>{if(!log.length)return 0;const days=[...new Set(log.map(e=>e.date))];let s=0;const today=new Date();for(let i=0;i<30;i++){const d=new Date(today);d.setDate(today.getDate()-i);const lbl=d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});if(days.includes(lbl))s++;else if(i>0)break;}return s;};
  const getWeekly=()=>{const wa=new Date();wa.setDate(wa.getDate()-6);const mo={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};const tw=log.filter(e=>{const p=e.date.split(" ");return new Date(+p[2],mo[p[1]],+p[0])>=wa;});const bc={};SPLIT.forEach(c=>{bc[c]=0;});tw.forEach(e=>{const cat=(e.category==="Arms"||e.category==="Shoulders")?"Arms & Shoulders":e.category;bc[cat]=(bc[cat]||0)+e.sets.filter(s=>!s.warmup).length;});return{sets:tw.reduce((a,e)=>a+e.sets.filter(s=>!s.warmup).length,0),sessions:tw.length,byCat:bc};};
  const getPRs=()=>{const prs={};[...log].reverse().forEach(e=>{e.sets.forEach(s=>{if(!s.bodyweight&&!s.warmup&&s.weight&&(!prs[e.exercise]||+s.weight>prs[e.exercise].weight))prs[e.exercise]={weight:+s.weight,date:e.date,category:e.category};});});return Object.entries(prs).sort((a,b)=>b[1].weight-a[1].weight).slice(0,5);};
  const next=getNext(),streak=getStreak(),{sets,sessions,byCat}=getWeekly(),prs=getPRs(),maxSets=Math.max(...Object.values(byCat),1);
  const nc=CAT_COLORS[next],quote=QUOTES[new Date().getDay()%QUOTES.length];
  const greeting=()=>{const h=now.getHours();return h<12?"Good morning":h<17?"Good afternoon":"Good evening";};
  const bwLog=load("pt_bw",[]);const bwLast=bwLog.length?bwLog[bwLog.length-1].w:null;
  return(
    <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
      <div style={{paddingTop:16,paddingBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><div style={{fontSize:13,color:t.muted,fontWeight:500}}>{greeting()}</div><div style={{fontSize:22,fontWeight:800,color:t.text}}>{userName||"PT Trainer"}</div></div>
        {streak>0&&<div style={{background:t.card,borderRadius:99,padding:"6px 14px",boxShadow:t.dark?"none":"0 1px 4px rgba(0,0,0,0.09)",border:t.dark?`1px solid ${t.border}`:"none",display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>🔥</span><span style={{fontSize:13,fontWeight:800,color:"#f97316"}}>{streak} DAY STREAK</span></div>}
      </div>
      <div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:8}}>Your Next Workout</div>
      <div onClick={onGoWorkout} style={{background:t.card,borderRadius:t.radius,padding:"16px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",marginBottom:14,boxShadow:t.dark?"none":"0 1px 4px rgba(0,0,0,0.07)",border:t.dark?`1px solid ${t.border}`:"none"}}>
        <div><div style={{fontSize:10,fontWeight:700,color:t.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{SPLIT.join(" / ")}</div><div style={{fontSize:17,fontWeight:800,color:t.text}}>{next}</div></div>
        <div style={{width:32,height:32,borderRadius:99,background:nc+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={nc} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <Card style={{marginBottom:0}}><div style={{fontSize:11,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Weight</div><div style={{fontSize:22,fontWeight:800,color:t.text,lineHeight:1}}>{bwLast?`${bwLast}kg`:"—"}</div><div style={{fontSize:11,color:t.muted,marginBottom:8}}>Today</div><Sparkline data={bwLog.slice(-7).map(e=>e.w)} color={t.accent}/></Card>
        <Card style={{marginBottom:0}}>
          <div style={{fontSize:11,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Water</div>
          <div style={{fontSize:22,fontWeight:800,color:"#3b82f6",lineHeight:1}}>{water}L <span style={{fontSize:14,color:t.muted}}>/ 3L</span></div>
          <div style={{height:6,borderRadius:99,background:t.border,margin:"8px 0",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min((water/3)*100,100)}%`,background:"#3b82f6",borderRadius:99,transition:"width 0.4s"}}/></div>
          <div style={{display:"flex",gap:6,justifyContent:"center"}}>
            <button onClick={()=>setWater(w=>Math.max(0,+(w-0.25).toFixed(2)))} style={{width:30,height:30,borderRadius:99,border:`1px solid ${t.border}`,background:t.bg,color:t.text,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>−</button>
            <button onClick={()=>setWater(w=>+(w+0.25).toFixed(2))} style={{width:30,height:30,borderRadius:99,border:`1px solid ${t.border}`,background:t.bg,color:t.text,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
          </div>
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        {[{label:"Weekly sets",val:sets,unit:"sets",pct:Math.min(sets/30*100,100),color:"#22c55e"},{label:"Sessions",val:sessions,unit:"sessions",pct:Math.min(sessions/5*100,100),color:t.accent}].map(({label,val,unit,pct,color})=>(
          <Card key={label} style={{marginBottom:0}}>
            <div style={{fontSize:11,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>{label}</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{position:"relative",width:48,height:48,flexShrink:0}}><CircleProg pct={pct} color={color} size={48}/><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:13,fontWeight:800,color:t.text}}>{val}</span></div></div>
              <div><div style={{fontSize:15,fontWeight:800,color:t.text,lineHeight:1.1}}>{val}</div><div style={{fontSize:11,color:t.muted}}>{unit}</div></div>
            </div>
          </Card>
        ))}
      </div>
      <Card style={{marginBottom:10}}>
        <div style={{fontSize:11,fontWeight:700,color:t.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Weekly volume</div>
        {SPLIT.map(cat=>{const val=byCat[cat]||0,pct=Math.round(val/maxSets*100);return(
          <div key={cat} style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:600,color:t.text}}>{cat}</span><span style={{fontSize:12,color:t.muted}}>{val} sets</span></div><div style={{height:6,borderRadius:99,background:t.border,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:CAT_COLORS[cat],borderRadius:99,transition:"width 0.7s"}}/></div></div>
        );})}
      </Card>
      <div style={{fontSize:15,fontWeight:700,color:t.text,marginBottom:8}}>Personal Records</div>
      <Card style={{marginBottom:10}}>
        {prs.length===0?<div style={{fontSize:13,color:t.muted}}>No PRs yet — start lifting!</div>:prs.map(([ex,data])=>(
          <div key={ex} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${t.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:8,height:8,borderRadius:"50%",background:CAT_COLORS[data.category]||"#a855f7",flexShrink:0}}/><div><div style={{fontSize:13,fontWeight:700,color:t.text}}>{ex}</div><div style={{fontSize:11,color:t.muted}}>{data.date}</div></div></div>
            <div style={{fontSize:15,fontWeight:800,color:t.text}}>{data.weight}kg</div>
          </div>
        ))}
      </Card>
      <div style={{background:t.card,borderRadius:t.radius,padding:"14px 16px",borderLeft:`3px solid ${t.accent}`,boxShadow:t.dark?"none":"0 1px 4px rgba(0,0,0,0.07)"}}><div style={{fontSize:13,color:t.muted,lineHeight:1.6,fontStyle:"italic"}}>"{quote}"</div></div>
    </div>
  );
}

// ── More Tab ─────────────────────────────────────────────────────────────────
function MoreTab({t,toggleDark,log,userName,setUserName}){
  const Card=mkCard(t);const BackBtn=mkBack(t);
  const [view,setView]=useState("menu");
  const [bwLog,setBwLog]=useState(()=>load("pt_bw",[]));
  const [bwInput,setBwInput]=useState("");
  const [schedule,setSchedule]=useState(()=>load("pt_schedule",{Mon:"",Tue:"",Wed:"",Thu:"",Fri:"",Sat:"",Sun:""}));
  const [histEx,setHistEx]=useState(null);
  const [measurements,setMeasurements]=useState(()=>load("pt_measurements",[]));
  const [measInputs,setMeasInputs]=useState({});
  const [nameInput,setNameInput]=useState(userName||"");
  const plans=load("pt_plans",[]);
  useEffect(()=>{save("pt_bw",bwLog);},[bwLog]);
  useEffect(()=>{save("pt_schedule",schedule);},[schedule]);
  useEffect(()=>{save("pt_measurements",measurements);},[measurements]);
  const logBW=()=>{const w=parseFloat(bwInput);if(!w||w<20||w>400)return;const today=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});setBwLog(prev=>{const f=prev.filter(e=>e.d!==today);return[...f,{d:today,w}].sort((a,b)=>new Date(a.d)-new Date(b.d));});setBwInput("");};
  const loggedExercises=[...new Set(log.map(e=>e.exercise))].sort();
  const getExHistory=(ex)=>log.filter(e=>e.exercise===ex).slice(0,10).reverse().map(e=>{const best=e.sets.filter(s=>!s.bodyweight&&!s.warmup&&s.weight).reduce((a,s)=>Math.max(a,+s.weight),0);return{date:e.date,best:best||null,reps:e.sets.filter(s=>!s.warmup).map(s=>s.reps).join(", "),sets:e.sets.filter(s=>!s.warmup).length,duration:e.duration};});
  const getMonthly=()=>{const now=new Date();const mo={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};const thisMonth=log.filter(e=>{const p=e.date.split(" ");const d=new Date(+p[2],mo[p[1]],+p[0]);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});return{totalSets:thisMonth.reduce((a,e)=>a+e.sets.filter(s=>!s.warmup).length,0),totalVol:Math.round(thisMonth.reduce((a,e)=>a+e.sets.filter(s=>!s.warmup&&s.weight&&!s.bodyweight).reduce((b,s)=>b+(+s.weight*(+s.reps||0)),0),0)),sessions:[...new Set(thisMonth.map(e=>e.date))].length,prs:thisMonth.filter(e=>e.isPR).length,totalCals:Math.round(thisMonth.reduce((a,e)=>a+(e.calories||0),0)),raw:thisMonth};};

  if(view==="monthly"){
    const {totalSets,totalVol,sessions,prs,totalCals,raw}=getMonthly();
    const monthName=new Date().toLocaleDateString("en-GB",{month:"long",year:"numeric"});
    const mo={Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11};const now=new Date();
    return(
      <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
        <BackBtn onClick={()=>setView("menu")} label="More"/>
        <div style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Monthly Report</div>
        <div style={{fontSize:13,color:t.muted,marginBottom:16}}>{monthName}</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          {[{label:"Sessions",val:sessions,icon:"📅"},{label:"Working sets",val:totalSets,icon:"💪"},{label:"Total volume",val:`${totalVol.toLocaleString()}kg`,icon:"⬆️"},{label:"New PRs",val:prs,icon:"🏆"},{label:"Cals burned",val:`~${totalCals}`,icon:"🔥"}].map(({label,val,icon})=>(
            <Card key={label} style={{marginBottom:0,textAlign:"center"}}><div style={{fontSize:24,marginBottom:4}}>{icon}</div><div style={{fontSize:22,fontWeight:800,color:t.text}}>{val}</div><div style={{fontSize:11,color:t.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div></Card>
          ))}
        </div>
        <Card>
          <div style={{fontSize:12,fontWeight:700,color:t.muted,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.07em"}}>By category</div>
          {SPLIT.map(cat=>{const catSets=raw.filter(e=>e.category===cat||(cat==="Arms & Shoulders"&&(e.category==="Arms"||e.category==="Shoulders"))).reduce((a,e)=>a+e.sets.filter(s=>!s.warmup).length,0);return(<div key={cat} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${t.border}`}}><span style={{fontSize:13,color:t.text,fontWeight:600}}>{cat}</span><span style={{fontSize:13,fontWeight:700,color:CAT_COLORS[cat]}}>{catSets} sets</span></div>);})}
        </Card>
      </div>
    );
  }
  if(view==="measurements"){
    const fields=["Chest","Waist","Hips","Left arm","Right arm","Left thigh","Right thigh"];
    const logMeasurements=()=>{const today=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});const entry={date:today,...measInputs};setMeasurements(prev=>[entry,...prev.filter(e=>e.date!==today)]);setMeasInputs({});};
    return(
      <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
        <BackBtn onClick={()=>setView("menu")} label="More"/>
        <div style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:16}}>Body measurements</div>
        <Card>
          <div style={{fontSize:13,color:t.muted,marginBottom:12}}>Log today's measurements (cm)</div>
          {fields.map(f=>(<div key={f} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,fontWeight:600,color:t.text}}>{f}</span><input type="text" inputMode="decimal" value={measInputs[f]||""} onChange={e=>setMeasInputs(p=>({...p,[f]:e.target.value}))} placeholder="0 cm" style={{width:80,padding:"6px 10px",borderRadius:10,border:`1px solid ${t.border}`,fontSize:14,color:t.text,background:t.bg,outline:"none",textAlign:"center"}}/></div>))}
          <button onClick={logMeasurements} style={{width:"100%",padding:"12px",borderRadius:12,border:"none",background:t.accent,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",marginTop:8}}>Save measurements</button>
        </Card>
        {measurements.length>0&&<Card><div style={{fontSize:12,fontWeight:700,color:t.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>History</div>{measurements.slice(0,5).map((m,i)=>(<div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${t.border}`}}><div style={{fontSize:12,fontWeight:700,color:t.muted,marginBottom:4}}>{m.date}</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{fields.filter(f=>m[f]).map(f=><span key={f} style={{fontSize:11,background:t.bg,color:t.text,padding:"2px 8px",borderRadius:99,fontWeight:600}}>{f}: {m[f]}cm</span>)}</div></div>))}</Card>}
      </div>
    );
  }
  if(view==="bodyweight")return(
    <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
      <BackBtn onClick={()=>setView("menu")} label="More"/>
      <div style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:16}}>Body weight</div>
      <Card><div style={{fontSize:13,color:t.muted,marginBottom:8}}>Log today's weight</div><div style={{display:"flex",gap:8}}><input value={bwInput} onChange={e=>setBwInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&logBW()} type="text" inputMode="decimal" placeholder="e.g. 85.5" style={{flex:1,padding:"10px 12px",borderRadius:12,border:`1px solid ${t.border}`,fontSize:15,fontWeight:600,color:t.text,background:t.bg,outline:"none"}}/><span style={{display:"flex",alignItems:"center",fontSize:14,fontWeight:600,color:t.muted,marginRight:4}}>kg</span><button onClick={logBW} style={{padding:"10px 18px",borderRadius:12,border:"none",background:t.accent,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Log</button></div></Card>
      {bwLog.length>1&&<Card><div style={{fontSize:12,fontWeight:700,color:t.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.07em"}}>Progress</div><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div><div style={{fontSize:11,color:t.muted}}>Start</div><div style={{fontSize:18,fontWeight:800,color:t.text}}>{bwLog[0].w}kg</div></div><div style={{textAlign:"center"}}><div style={{fontSize:11,color:t.muted}}>Change</div><div style={{fontSize:18,fontWeight:800,color:(bwLog[bwLog.length-1].w-bwLog[0].w)<0?"#22c55e":"#ef4444"}}>{(bwLog[bwLog.length-1].w-bwLog[0].w>0?"+":"")+((bwLog[bwLog.length-1].w-bwLog[0].w).toFixed(1))}kg</div></div><div style={{textAlign:"right"}}><div style={{fontSize:11,color:t.muted}}>Current</div><div style={{fontSize:18,fontWeight:800,color:t.text}}>{bwLog[bwLog.length-1].w}kg</div></div></div><Sparkline data={bwLog.map(e=>e.w)} color={t.accent} w={300} h={60}/></Card>}
      <Card><div style={{fontSize:12,fontWeight:700,color:t.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>History</div>{bwLog.length===0?<div style={{fontSize:13,color:t.muted}}>No entries yet.</div>:[...bwLog].reverse().map((e,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${t.border}`}}><span style={{fontSize:13,color:t.muted}}>{e.d}</span><span style={{fontSize:14,fontWeight:700,color:t.text}}>{e.w}kg</span></div>))}</Card>
    </div>
  );
  if(view==="schedule")return(
    <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
      <BackBtn onClick={()=>setView("menu")} label="More"/>
      <div style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Weekly schedule</div>
      <div style={{fontSize:13,color:t.muted,marginBottom:16}}>Set training or rest for each day</div>
      {DAYS.map(day=>(<div key={day} style={{background:t.card,borderRadius:14,padding:"12px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10,border:t.dark?`1px solid ${t.border}`:"none"}}><div style={{width:38,fontSize:13,fontWeight:700,color:t.muted}}>{day}</div><div style={{display:"flex",gap:6,flex:1,flexWrap:"wrap"}}>{["Rest",...plans.map(p=>p.name)].map(opt=>(<button key={opt} onClick={()=>setSchedule(s=>({...s,[day]:opt}))} style={{padding:"5px 12px",borderRadius:99,border:`1.5px solid ${schedule[day]===opt?t.accent:t.border}`,background:schedule[day]===opt?t.accent+"18":t.bg,color:schedule[day]===opt?t.accent:t.muted,fontSize:12,fontWeight:700,cursor:"pointer"}}>{opt}</button>))}</div></div>))}
    </div>
  );
  if(view==="history"){
    if(histEx){const hist=getExHistory(histEx);const weights=hist.filter(e=>e.best).map(e=>e.best);return(<div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}><BackBtn onClick={()=>setHistEx(null)} label="Exercise history"/><div style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>{histEx}</div><div style={{fontSize:13,color:t.muted,marginBottom:16}}>{hist.length} session{hist.length!==1?"s":""} logged</div>{weights.length>1&&<Card><div style={{fontSize:12,fontWeight:700,color:t.muted,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.07em"}}>Weight over time</div><Sparkline data={weights} color={t.accent} w={280} h={60}/></Card>}{hist.map((h,i)=>(<Card key={i}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:13,fontWeight:700,color:t.text}}>{h.date}</span>{h.best&&<span style={{fontSize:13,fontWeight:800,color:t.accent}}>{h.best}kg best</span>}</div><div style={{fontSize:12,color:t.muted}}>{h.sets} sets · reps: {h.reps}{h.duration?` · ${fmtTime(h.duration)}`:""}</div></Card>))}</div>);}
    return(<div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}><BackBtn onClick={()=>setView("menu")} label="More"/><div style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:4}}>Exercise history</div><div style={{fontSize:13,color:t.muted,marginBottom:16}}>Tap an exercise to see your progress</div>{loggedExercises.length===0?<div style={{textAlign:"center",color:t.muted,marginTop:40,fontSize:14}}>No exercises logged yet.</div>:loggedExercises.map(ex=>{const sessions=log.filter(e=>e.exercise===ex);const pr=sessions.reduce((best,e)=>e.sets.reduce((b,s)=>(!s.bodyweight&&!s.warmup&&+s.weight>b?+s.weight:b),best),0);return(<div key={ex} onClick={()=>setHistEx(ex)} style={{background:t.card,borderRadius:14,padding:"13px 16px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",border:t.dark?`1px solid ${t.border}`:"none",boxShadow:t.dark?"none":"0 1px 3px rgba(0,0,0,0.06)"}}><div><div style={{fontSize:14,fontWeight:700,color:t.text}}>{ex}</div><div style={{fontSize:11,color:t.muted}}>{sessions.length} session{sessions.length!==1?"s":""}</div></div><div style={{display:"flex",alignItems:"center",gap:8}}>{pr>0&&<span style={{fontSize:12,fontWeight:700,color:"#f59e0b",background:"#fef3c7",padding:"2px 8px",borderRadius:99}}>PR {pr}kg</span>}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div></div>);})}</div>);
  }
  if(view==="settings")return(<div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}><BackBtn onClick={()=>setView("menu")} label="More"/><div style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:16}}>Settings</div><Card><div style={{fontSize:13,fontWeight:700,color:t.text,marginBottom:8}}>Your name</div><div style={{display:"flex",gap:8}}><input value={nameInput} onChange={e=>setNameInput(e.target.value)} placeholder="Your name" style={{flex:1,padding:"10px 12px",borderRadius:12,border:`1px solid ${t.border}`,fontSize:14,color:t.text,background:t.bg,outline:"none"}}/><button onClick={()=>setUserName(nameInput)} style={{padding:"10px 16px",borderRadius:12,border:"none",background:t.accent,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>Save</button></div></Card></div>);

  const menuItems=[
    {icon:"📊",label:"Monthly report",sub:"Summary of this month's training",action:()=>setView("monthly")},
    {icon:"⚖️",label:"Body weight tracker",sub:"Log and track your weight",action:()=>setView("bodyweight")},
    {icon:"📏",label:"Body measurements",sub:"Track chest, waist, arms and more",action:()=>setView("measurements")},
    {icon:"📅",label:"Weekly schedule",sub:"Plan your training days",action:()=>setView("schedule")},
    {icon:"📈",label:"Exercise history",sub:"See progress per exercise",action:()=>setView("history")},
    {icon:"👤",label:"Settings",sub:"Change your name and preferences",action:()=>setView("settings")},
    {icon:t.dark?"☀️":"🌙",label:t.dark?"Light mode":"Dark mode",sub:"Switch app appearance",action:toggleDark},
  ];
  return(<div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}><div style={{paddingTop:16,paddingBottom:16}}><div style={{fontSize:22,fontWeight:800,color:t.text}}>More</div></div>{menuItems.map((item,i)=>(<div key={i} onClick={item.action} style={{background:t.card,borderRadius:14,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:14,cursor:"pointer",border:t.dark?`1px solid ${t.border}`:"none",boxShadow:t.dark?"none":"0 1px 3px rgba(0,0,0,0.06)"}}><div style={{width:40,height:40,borderRadius:12,background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.icon}</div><div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:t.text}}>{item.label}</div><div style={{fontSize:12,color:t.muted,marginTop:1}}>{item.sub}</div></div><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.muted} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></div>))}</div>);
}

// ── Planner ──────────────────────────────────────────────────────────────────
function AddExModal({category,onAdd,onClose,t}){
  const [name,setName]=useState("");const submit=()=>{const n=name.trim();if(n){onAdd(n);onClose();}};
  return(<div style={{background:t.card,borderRadius:24,padding:24,width:"100%",maxWidth:300}}><div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:4}}>Add custom exercise</div><div style={{fontSize:13,color:t.muted,marginBottom:16}}>Adding to <b>{category}</b></div><input autoFocus value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} placeholder="Exercise name…" style={{width:"100%",padding:"10px 12px",borderRadius:12,border:`1px solid ${t.border}`,fontSize:14,color:t.text,background:t.bg,outline:"none",marginBottom:16,boxSizing:"border-box"}}/><div style={{display:"flex",gap:8}}><button onClick={onClose} style={{flex:1,padding:"10px",borderRadius:12,background:t.bg,border:`1px solid ${t.border}`,fontWeight:700,color:t.text,cursor:"pointer"}}>Cancel</button><button onClick={submit} style={{flex:1,padding:"10px",borderRadius:12,background:t.accent,border:"none",fontWeight:700,color:"#fff",cursor:"pointer"}}>Add</button></div></div>);
}

function Planner({exercises,setExercises,t}){
  const [plans,setPlans]=useState(()=>load("pt_plans",[]));
  const [view,setView]=useState("list");
  const [editPlan,setEditPlan]=useState(null);
  const [planName,setPlanName]=useState("");const [planNotes,setPlanNotes]=useState("");
  const [selectedCat,setSelectedCat]=useState(Object.keys(exercises)[0]);
  const [selectedExs,setSelectedExs]=useState([]);const [supersets,setSupersets]=useState({});
  const [showAddEx,setShowAddEx]=useState(false);
  const Card=mkCard(t);const BackBtn=mkBack(t);
  useEffect(()=>{save("pt_plans",plans);},[plans]);
  const startNew=()=>{setPlanName("");setPlanNotes("");setSelectedExs([]);setSupersets({});setSelectedCat(Object.keys(exercises)[0]);setEditPlan(null);setView("create");};
  const startEdit=(plan)=>{setPlanName(plan.name);setPlanNotes(plan.notes||"");setSelectedExs([...plan.exercises]);setSupersets(plan.supersets||{});setSelectedCat(Object.keys(exercises)[0]);setEditPlan(plan);setView("create");};
  const dupPlan=(plan)=>setPlans(prev=>[...prev,{...plan,id:Date.now(),name:plan.name+" (copy)",created:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}]);
  const toggleEx=(cat,ex)=>{const key=`${cat}||${ex}`;setSelectedExs(prev=>prev.includes(key)?prev.filter(k=>k!==key):[...prev,key]);};
  const savePlan=()=>{if(!planName.trim()||!selectedExs.length)return;const plan={id:editPlan?.id||Date.now(),name:planName.trim(),notes:planNotes.trim(),exercises:selectedExs,supersets,created:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})};setPlans(prev=>editPlan?prev.map(p=>p.id===editPlan.id?plan:p):[...prev,plan]);setView("list");};

  if(view==="list")return(
    <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
      <div style={{paddingTop:16,paddingBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><div style={{fontSize:22,fontWeight:800,color:t.text}}>Planner</div><div style={{fontSize:13,color:t.muted,marginTop:2}}>Build and save workout plans</div></div><button onClick={startNew} style={{background:t.accent,border:"none",borderRadius:12,padding:"8px 16px",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>+ New</button></div>
      {plans.length===0?(<div style={{textAlign:"center",marginTop:60}}><div style={{fontSize:40,marginBottom:12}}>📋</div><div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:6}}>No plans yet</div><div style={{fontSize:13,color:t.muted,marginBottom:24}}>Create a plan to build your workout</div><button onClick={startNew} style={{background:t.accent,border:"none",borderRadius:14,padding:"12px 28px",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>Create first plan</button></div>)
      :plans.map(plan=>{const cats=[...new Set(plan.exercises.map(k=>k.split("||")[0]))];return(<Card key={plan.id}><div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:8}}><div><div style={{fontSize:16,fontWeight:800,color:t.text}}>{plan.name}</div><div style={{fontSize:12,color:t.muted,marginTop:2}}>{plan.exercises.length} exercises · {plan.created}</div></div><div style={{display:"flex",gap:6,flexShrink:0}}><button onClick={()=>startEdit(plan)} style={{background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,padding:"5px 10px",fontSize:12,fontWeight:600,color:t.muted,cursor:"pointer"}}>Edit</button><button onClick={()=>dupPlan(plan)} style={{background:t.bg,border:`1px solid ${t.border}`,borderRadius:8,padding:"5px 10px",fontSize:12,fontWeight:600,color:t.accent,cursor:"pointer"}}>Copy</button><button onClick={()=>{if(window.confirm("Delete this plan?"))setPlans(p=>p.filter(x=>x.id!==plan.id));}} style={{background:"#fff0f0",border:"1px solid #fecaca",borderRadius:8,padding:"5px 10px",fontSize:12,fontWeight:600,color:"#ef4444",cursor:"pointer"}}>Del</button></div></div>{plan.notes&&<div style={{fontSize:12,color:t.muted,marginBottom:8,fontStyle:"italic"}}>"{plan.notes}"</div>}<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{cats.map(cat=><span key={cat} style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,background:CAT_COLORS[cat]+"18",color:CAT_COLORS[cat]}}>{cat}</span>)}</div></Card>);})}
    </div>
  );
  return(
    <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
      <BackBtn onClick={()=>setView("list")} label="Plans"/>
      <div style={{fontSize:22,fontWeight:800,color:t.text,marginBottom:16}}>{editPlan?"Edit plan":"New plan"}</div>
      <input value={planName} onChange={e=>setPlanName(e.target.value)} placeholder="Plan name" style={{width:"100%",padding:"12px 14px",borderRadius:14,border:`1.5px solid ${planName?t.accent:t.border}`,fontSize:15,fontWeight:600,color:t.text,background:t.card,outline:"none",marginBottom:10,boxSizing:"border-box"}}/>
      <textarea value={planNotes} onChange={e=>setPlanNotes(e.target.value)} placeholder="Notes (optional)" rows={2} style={{width:"100%",padding:"10px 14px",borderRadius:14,border:`1px solid ${t.border}`,fontSize:14,color:t.text,background:t.card,outline:"none",marginBottom:14,boxSizing:"border-box",resize:"none",fontFamily:"inherit"}}/>
      <div style={{display:"flex",gap:6,marginBottom:12,overflowX:"auto",paddingBottom:4}}>{Object.keys(exercises).map(cat=>(<button key={cat} onClick={()=>setSelectedCat(cat)} style={{padding:"6px 14px",borderRadius:99,border:"none",background:selectedCat===cat?CAT_COLORS[cat]:t.bg,color:selectedCat===cat?"#fff":t.muted,fontWeight:700,fontSize:12,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}}>{cat}</button>))}</div>
      <div style={{marginBottom:12}}>{exercises[selectedCat].map(ex=>{const key=`${selectedCat}||${ex}`;const checked=selectedExs.includes(key);return(<div key={ex} onClick={()=>toggleEx(selectedCat,ex)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",borderRadius:12,marginBottom:6,cursor:"pointer",background:checked?CAT_COLORS[selectedCat]+"15":t.card,border:`1.5px solid ${checked?CAT_COLORS[selectedCat]:t.border}`,transition:"all 0.15s"}}><span style={{fontSize:14,fontWeight:checked?700:500,color:t.text}}>{ex}</span><div style={{width:22,height:22,borderRadius:"50%",border:`2px solid ${checked?CAT_COLORS[selectedCat]:t.border}`,background:checked?CAT_COLORS[selectedCat]:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{checked&&<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 6 5 9 10 3"/></svg>}</div></div>);})}</div>
      <button onClick={()=>setShowAddEx(true)} style={{width:"100%",padding:"11px",borderRadius:12,border:`1.5px dashed ${t.border}`,background:"none",color:t.muted,fontWeight:600,fontSize:13,cursor:"pointer",marginBottom:12}}>+ Add custom exercise to {selectedCat}</button>
      {selectedExs.length>0&&<div style={{background:t.bg,borderRadius:12,padding:"10px 14px",marginBottom:16}}><div style={{fontSize:12,fontWeight:700,color:t.muted,marginBottom:6}}>{selectedExs.length} selected</div><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{selectedExs.map(k=>{const[cat,ex]=k.split("||");return <span key={k} style={{fontSize:11,background:CAT_COLORS[cat]+"20",color:CAT_COLORS[cat],padding:"3px 8px",borderRadius:99,fontWeight:700}}>{ex}</span>;})}</div></div>}
      <button onClick={savePlan} disabled={!planName.trim()||!selectedExs.length} style={{width:"100%",padding:"14px",borderRadius:14,border:"none",background:(!planName.trim()||!selectedExs.length)?"#cbd5e1":t.accent,color:"#fff",fontWeight:800,fontSize:15,cursor:(!planName.trim()||!selectedExs.length)?"not-allowed":"pointer"}}>{editPlan?"Save changes":"Save plan"}</button>
      {showAddEx&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:16}}><AddExModal category={selectedCat} onAdd={name=>setExercises(prev=>({...prev,[selectedCat]:[...prev[selectedCat],name]}))} onClose={()=>setShowAddEx(false)} t={t}/></div>)}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App(){
  const [theme,toggleDark]=useTheme();const t=theme;
  const [tab,setTab]=useState("dashboard");
  const [userName,setUserName]=useState(()=>load("pt_username","PT Trainer"));
  const [exercises,setExercises]=useState(()=>{const stored=load("pt_exercises",null);if(!stored||stored["Arms"]||stored["Shoulders"]){save("pt_exercises",EXERCISES_DEFAULT);return EXERCISES_DEFAULT;}return stored;});
  const [log,setLog]=useState(()=>load("pt_log",[]));
  const [wv,setWv]=useState("list");
  const [activePlan,setActivePlan]=useState(null);
  const [planDone,setPlanDone]=useState({});
  const [activeCat,setActiveCat]=useState(null);
  const [activeEx,setActiveEx]=useState(null);
  const [sets,setSets]=useState([initSet(),initSet(),initSet()]);
  const [showTimer,setShowTimer]=useState(false);
  const [savedEntry,setSavedEntry]=useState(null);
  const [sessionNotes,setSessionNotes]=useState("");
  const [workoutStart,setWorkoutStart]=useState(null);
  const [elapsed,setElapsed]=useState(0);
  const [swipeId,setSwipeId]=useState(null);
  const timerRef=useRef();

  useEffect(()=>{save("pt_exercises",exercises);},[exercises]);
  useEffect(()=>{save("pt_log",log);},[log]);
  useEffect(()=>{save("pt_username",userName);},[userName]);
  useEffect(()=>{if(workoutStart){timerRef.current=setInterval(()=>setElapsed(Math.floor((Date.now()-workoutStart)/1000)),1000);}else{clearInterval(timerRef.current);setElapsed(0);}return()=>clearInterval(timerRef.current);},[workoutStart]);

  const getPR=useCallback(ex=>{const e=log.filter(e=>e.exercise===ex);if(!e.length)return null;let b=0;e.forEach(e=>e.sets.forEach(s=>{if(!s.bodyweight&&!s.warmup&&+s.weight>b)b=+s.weight;}));return b>0?b:null;},[log]);
  const plans=load("pt_plans",[]);

  const selectPlan=(plan)=>{setActivePlan(plan);setPlanDone({});setSessionNotes("");setWorkoutStart(Date.now());setWv("active");};

  const openEx=useCallback((cat,ex)=>{
    setActiveCat(cat);setActiveEx(ex);
    const prev=log.find(e=>e.exercise===ex);
    const tgt=load("pt_targets",{});
    if(prev&&prev.sets&&prev.sets.length){setSets(prev.sets.map(s=>({weight:s.weight||"",reps:s.reps||"",bodyweight:s.bodyweight||false,done:false,warmup:false})));}
    else{setSets([initSet(),initSet(),initSet()]);}
    setWv("exercise");
  },[log]);

  const updSet=useCallback((i,f,v)=>setSets(p=>p.map((s,idx)=>idx===i?{...s,[f]:v}:s)),[]);
  const togBW=useCallback(i=>setSets(p=>p.map((s,idx)=>idx===i?{...s,bodyweight:!s.bodyweight,weight:""}:s)),[]);
  const togDone=useCallback(i=>{setSets(p=>p.map((s,idx)=>idx===i?{...s,done:!s.done}:s));setShowTimer(true);},[]);
  const togWarmup=useCallback(i=>setSets(p=>p.map((s,idx)=>idx===i?{...s,warmup:!s.warmup}:s)),[]);

  const handleSave=(targetReps,targetSets)=>{
    const valid=sets.filter(s=>(s.bodyweight||s.weight!=="")&&s.reps!=="");
    if(!valid.length)return;
    const pr=getPR(activeEx),newBest=valid.filter(s=>!s.warmup).some(s=>!s.bodyweight&&+s.weight>(pr||0));
    if(targetReps||targetSets){const tgt=load("pt_targets",{});tgt[activeEx]={reps:targetReps,sets:targetSets};save("pt_targets",tgt);}
    const bwLog=load("pt_bw",[]);const bw=bwLog.length?bwLog[bwLog.length-1].w:80;
    const met=CAT_MET[activeCat]||5;const hrs=valid.length*2.5/60;
    const calories=Math.round(met*bw*hrs);
    const entry={id:Date.now(),date:new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}),category:activeCat,exercise:activeEx,sets:valid,isPR:newBest,notes:sessionNotes,duration:elapsed,calories};
    setLog(p=>[entry,...p]);setSavedEntry(entry);setWv("saved");
  };

  // Workout views
  const renderWorkout=()=>{
    if(wv==="list")return(
      <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
        <div style={{paddingTop:16,paddingBottom:16}}><div style={{fontSize:22,fontWeight:800,color:t.text}}>Workout</div><div style={{fontSize:13,color:t.muted,marginTop:2}}>Choose a plan to start</div></div>
        {plans.length===0?(<div style={{textAlign:"center",marginTop:60}}><div style={{fontSize:40,marginBottom:12}}>📋</div><div style={{fontSize:16,fontWeight:700,color:t.text,marginBottom:6}}>No plans yet</div><div style={{fontSize:13,color:t.muted,marginBottom:24}}>Head to the Planner tab to build your first workout plan</div><button onClick={()=>setTab("planner")} style={{background:t.accent,border:"none",borderRadius:14,padding:"12px 28px",color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>Go to Planner</button></div>)
        :plans.map(plan=>{const cats=[...new Set(plan.exercises.map(k=>k.split("||")[0]))];return(
          <div key={plan.id} style={{background:t.card,borderRadius:t.radius,padding:"16px",marginBottom:10,boxShadow:t.dark?"none":"0 1px 4px rgba(0,0,0,0.07)",border:t.dark?`1px solid ${t.border}`:"none"}}>
            <div style={{marginBottom:8}}><div style={{fontSize:17,fontWeight:800,color:t.text}}>{plan.name}</div><div style={{fontSize:12,color:t.muted,marginTop:2}}>{plan.exercises.length} exercises</div></div>
            {plan.notes&&<div style={{fontSize:12,color:t.muted,marginBottom:8,fontStyle:"italic"}}>"{plan.notes}"</div>}
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{cats.map(cat=><span key={cat} style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:99,background:CAT_COLORS[cat]+"18",color:CAT_COLORS[cat]}}>{cat}</span>)}</div>
            <button onClick={()=>selectPlan(plan)} style={{width:"100%",padding:"13px",borderRadius:12,border:"none",background:t.accent,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer"}}>Start workout</button>
          </div>
        );})}
      </div>
    );

    if(wv==="active"&&activePlan){
      const total=activePlan.exercises.length,doneCount=Object.keys(planDone).length,allDone=doneCount===total;
      return(
        <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
          <div style={{paddingTop:16,paddingBottom:4,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div><div style={{fontSize:22,fontWeight:800,color:t.text}}>{activePlan.name}</div><div style={{fontSize:13,color:t.muted,marginTop:2}}>{doneCount} of {total} completed</div></div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:14,fontWeight:700,color:t.accent}}>{fmtTime(elapsed)}</div>
              <button onClick={()=>{setActivePlan(null);setPlanDone({});setWorkoutStart(null);setWv("list");}} style={{background:"none",border:`1px solid ${t.border}`,borderRadius:10,padding:"6px 12px",fontSize:12,fontWeight:700,color:t.muted,cursor:"pointer"}}>Exit</button>
            </div>
          </div>
          <div style={{height:6,borderRadius:99,background:t.border,margin:"12px 0",overflow:"hidden"}}><div style={{height:"100%",width:`${(doneCount/total)*100}%`,background:"#22c55e",borderRadius:99,transition:"width 0.4s ease"}}/></div>
          <textarea value={sessionNotes} onChange={e=>setSessionNotes(e.target.value)} placeholder="Session notes…" rows={2} style={{width:"100%",padding:"10px 14px",borderRadius:12,border:`1px solid ${t.border}`,fontSize:13,color:t.text,background:t.card,outline:"none",marginBottom:12,boxSizing:"border-box",resize:"none",fontFamily:"inherit"}}/>
          {activePlan.exercises.map((key)=>{const [cat,ex]=key.split("||"),col=CAT_COLORS[cat],done=planDone[key],pr=getPR(ex);const isSuper=activePlan.supersets&&activePlan.supersets[key];return(
            <div key={key}>
              <div style={{background:t.card,borderRadius:14,padding:"14px",marginBottom:isSuper?0:8,border:t.dark?`1px solid ${t.border}`:"none",boxShadow:t.dark?"none":"0 1px 3px rgba(0,0,0,0.06)",opacity:done?0.55:1,transition:"opacity 0.2s"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
                    <div style={{width:36,height:36,borderRadius:10,background:col+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{done?<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2 8 6 12 14 4"/></svg>:<div style={{width:10,height:10,borderRadius:"50%",background:col}}/>}</div>
                    <div style={{minWidth:0}}><div style={{fontSize:14,fontWeight:700,color:done?"#94a3b8":t.text,textDecoration:done?"line-through":"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ex}</div><div style={{fontSize:11,color:t.muted}}>{cat}{pr?` · PR ${pr}kg`:""}</div></div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0,marginLeft:8}}>
                    <button onClick={()=>openEx(cat,ex)} style={{padding:"6px 12px",borderRadius:10,border:`1px solid ${t.border}`,background:t.bg,fontSize:12,fontWeight:700,color:t.accent,cursor:"pointer"}}>Log</button>
                    <button onClick={()=>setPlanDone(p=>done?Object.fromEntries(Object.entries(p).filter(([k])=>k!==key)):{...p,[key]:true})} style={{width:34,height:34,borderRadius:10,border:"none",background:done?"#22c55e":t.border,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{done?"✓":""}</button>
                  </div>
                </div>
              </div>
              {isSuper&&<div style={{textAlign:"center",fontSize:11,fontWeight:700,color:t.accent,padding:"2px 0",marginBottom:2}}>↕ SUPERSET</div>}
            </div>
          );})}
          {allDone&&(<div style={{textAlign:"center",marginTop:16,padding:"20px 0"}}><div style={{fontSize:36,marginBottom:8}}>🎉</div><div style={{fontSize:18,fontWeight:800,color:t.text,marginBottom:4}}>Workout complete!</div><div style={{fontSize:15,fontWeight:700,color:t.accent,marginBottom:16}}>{fmtTime(elapsed)}</div><button onClick={()=>{setActivePlan(null);setPlanDone({});setWorkoutStart(null);setWv("list");}} style={{padding:"13px 32px",borderRadius:14,border:"none",background:"#22c55e",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer"}}>Finish ✓</button></div>)}
        </div>
      );
    }

    if(wv==="exercise"){
      return(
        <ExerciseScreen
          t={t}
          activeCat={activeCat}
          activeEx={activeEx}
          sets={sets}
          setSets={setSets}
          activePlan={activePlan}
          elapsed={elapsed}
          workoutStart={workoutStart}
          sessionNotes={sessionNotes}
          setSessionNotes={setSessionNotes}
          onBack={()=>setWv(activePlan?"active":"list")}
          onSave={handleSave}
          showTimer={showTimer}
          setShowTimer={setShowTimer}
        />
      );
    }

    if(wv==="saved")return(
      <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",minHeight:"70vh"}}>
        <div style={{textAlign:"center",width:"100%"}}>
          <div style={{fontSize:56,marginBottom:12}}>{savedEntry?.isPR?"🏆":"🎉"}</div>
          <div style={{fontSize:22,fontWeight:800,color:t.text}}>{savedEntry?.isPR?"New personal record!":"Exercise saved!"}</div>
          <div style={{fontSize:13,color:t.muted,marginTop:4,marginBottom:20}}>{savedEntry?.exercise} · {savedEntry?.date}</div>
          <div style={{background:t.card,borderRadius:t.radius,padding:"16px",marginBottom:12,border:t.dark?`1px solid ${t.border}`:"none",boxShadow:t.dark?"none":"0 1px 4px rgba(0,0,0,0.07)"}}>
            {savedEntry?.sets.filter(s=>!s.warmup).map((s,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${t.border}`}}><span style={{fontSize:13,color:t.muted}}>Set {i+1}</span><span style={{fontSize:14,fontWeight:700,color:t.text}}>{s.bodyweight?"BW":`${s.weight}kg`} × {s.reps} reps</span></div>))}
            {savedEntry?.calories>0&&<div style={{fontSize:12,color:t.muted,marginTop:8}}>~{savedEntry.calories} calories burned</div>}
            {savedEntry?.notes&&<div style={{fontSize:12,color:t.muted,marginTop:4,fontStyle:"italic"}}>"{savedEntry.notes}"</div>}
          </div>
          <button onClick={()=>{const key=`${activeCat}||${activeEx}`;if(activePlan)setPlanDone(p=>({...p,[key]:true}));setWv(activePlan?"active":"list");}} style={{width:"100%",padding:"13px",borderRadius:14,border:"none",background:t.accent,fontWeight:700,color:"#fff",cursor:"pointer",fontSize:14}}>{activePlan?"Back to plan":"Done"}</button>
        </div>
      </div>
    );
    return null;
  };

  const renderLog=()=>(
    <div style={{padding:"0 16px 100px",maxWidth:480,margin:"0 auto"}}>
      <div style={{paddingTop:16,paddingBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{fontSize:22,fontWeight:800,color:t.text}}>Workout log</div>
        {log.length>0&&<button onClick={()=>{if(window.confirm("Clear all logs?"))setLog([]);}} style={{background:"none",border:"none",color:"#ef4444",fontSize:13,fontWeight:600,cursor:"pointer"}}>Clear all</button>}
      </div>
      {log.length===0?<div style={{textAlign:"center",color:t.muted,marginTop:60,fontSize:14}}>No workouts logged yet.</div>
        :log.map(entry=>{const col=CAT_COLORS[entry.category];const isSwipe=swipeId===entry.id;return(
          <div key={entry.id} style={{position:"relative",marginBottom:10,overflow:"hidden",borderRadius:t.radius}}>
            <div style={{position:"absolute",right:0,top:0,bottom:0,width:80,background:"#ef4444",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}} onClick={()=>{setLog(p=>p.filter(e=>e.id!==entry.id));setSwipeId(null);}}>
              <span style={{color:"#fff",fontWeight:700,fontSize:13}}>Delete</span>
            </div>
            <div style={{background:t.card,borderRadius:t.radius,padding:"16px",transform:isSwipe?"translateX(-80px)":"translateX(0)",transition:"transform 0.25s ease",border:t.dark?`1px solid ${t.border}`:"none",boxShadow:t.dark?"none":"0 1px 4px rgba(0,0,0,0.07)",position:"relative"}}
              onTouchStart={e=>{e.currentTarget._tx=e.touches[0].clientX;}}
              onTouchEnd={e=>{const dx=e.currentTarget._tx-e.changedTouches[0].clientX;if(dx>50)setSwipeId(entry.id);else if(dx<-20)setSwipeId(null);}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                  <span style={{background:col+"22",color:col,fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99}}>{entry.category}</span>
                  <span style={{fontSize:14,fontWeight:700,color:t.text}}>{entry.exercise}</span>
                  {entry.isPR&&<span style={{background:"#fef3c722",color:"#f59e0b",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:99}}>🏆 PR</span>}
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  {entry.duration>0&&<span style={{fontSize:11,color:t.muted}}>⏱ {fmtTime(entry.duration)}</span>}
                  {entry.calories>0&&<span style={{fontSize:11,color:t.muted}}>🔥 {entry.calories}cal</span>}
                  <span style={{fontSize:11,color:t.muted}}>{entry.date}</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
                {entry.sets.filter(s=>!s.warmup).map((s,i)=>(<div key={i} style={{background:t.bg,borderRadius:10,padding:"8px",textAlign:"center"}}><div style={{fontSize:10,color:t.muted,fontWeight:600}}>Set {i+1}</div><div style={{fontSize:13,fontWeight:800,color:t.text}}>{s.bodyweight?"BW":`${s.weight}kg`}</div><div style={{fontSize:11,color:t.muted}}>{s.reps} reps</div></div>))}
              </div>
              {entry.notes&&<div style={{fontSize:12,color:t.muted,fontStyle:"italic",marginTop:6}}>"{entry.notes}"</div>}
              <div style={{fontSize:10,color:t.muted,marginTop:4,textAlign:"right"}}>← Swipe to delete</div>
            </div>
          </div>
        );})}
    </div>
  );

  const tabs=[
    {id:"dashboard",label:"Home",icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?t.accent:"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>},
    {id:"home",label:"Workout",icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?t.accent:"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4v16M18 4v16M6 12h12M2 7h4M18 7h4M2 17h4M18 17h4"/></svg>},
    {id:"planner",label:"Planner",icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?t.accent:"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="8.01" y2="14" strokeWidth="3"/><line x1="12" y1="14" x2="12.01" y2="14" strokeWidth="3"/><line x1="16" y1="14" x2="16.01" y2="14" strokeWidth="3"/></svg>},
    {id:"log",label:"Log",icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?t.accent:"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>},
    {id:"more",label:"More",icon:(a)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?t.accent:"#94a3b8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>},
  ];

  return(
    <div style={{minHeight:"100vh",background:t.bg,fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif"}}>
      <div style={{paddingBottom:80}}>
        {tab==="dashboard"&&<Dashboard log={log} t={t} onGoWorkout={()=>setTab("home")} userName={userName}/>}
        {tab==="home"&&renderWorkout()}
        {tab==="planner"&&<Planner exercises={exercises} setExercises={setExercises} t={t}/>}
        {tab==="log"&&renderLog()}
        {tab==="more"&&<MoreTab t={t} toggleDark={toggleDark} log={log} userName={userName} setUserName={setUserName}/>}
      </div>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:t.dark?"rgba(15,23,42,0.97)":"rgba(255,255,255,0.95)",backdropFilter:"blur(12px)",borderTop:`1px solid ${t.border}`,display:"flex",zIndex:50,paddingBottom:"env(safe-area-inset-bottom)"}}>
        {tabs.map(tb=>{const active=tab===tb.id;return(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"10px 0",background:"none",border:"none",cursor:"pointer",gap:3}}>
            {tb.icon(active)}
            <span style={{fontSize:11,fontWeight:active?700:500,color:active?t.accent:"#94a3b8"}}>{tb.label}</span>
          </button>
        );})}
      </div>
    </div>
  );
}
