"use client";
import React, { useRef, useEffect, useState } from "react";

// --- Oyun Sabitleri ---
const CANVAS_W = 400;
const CANVAS_H = 700;
const BEAVER_Y = CANVAS_H - 100;
const ARROW_SPEED = 12;
const TARGET_RADIUS = 32;
const GAME_TIME = 30; // saniye

// --- Tipler ---
type Arrow = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  power: number;
  active: boolean;
};

type TargetType = "lover" | "broken" | "bonus" | "timer";

type Target = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: TargetType;
  radius: number;
  hit: boolean;
};

// --- Yardımcılar ---
function randomTarget(id: number, level: number): Target {
  // Hedef türü ve hızını seviyeye göre belirle
  const tRand = Math.random();
  let type: TargetType = "lover";
  if (tRand < 0.20) type = "broken";
  else if (tRand > 0.97) type = "timer"; // çok nadir
  else if (tRand > 0.90) type = "bonus";
  const y = 80 + Math.random() * 180;
  const vx = (Math.random() < 0.5 ? -1 : 1) * (3 + Math.random() * (3 + level * 0.8));
  // lover ve broken tipleri için dikeyde de rastgele hareket
  const vy = (type === "lover" || type === "broken") ? (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * (1.5 + level * 0.3)) : 0;
  return {
    id,
    x: Math.random() * (CANVAS_W - 2 * TARGET_RADIUS) + TARGET_RADIUS,
    y,
    vx,
    vy,
    type,
    radius: TARGET_RADIUS + (type === "lover" ? Math.random() * 12 : 0),
    hit: false,
  };
}

function getArrowColor(): string {
  return "#e75480";
}

function getTargetColor(type: TargetType): string {
  if (type === "lover") return "#ffb6c1";
  if (type === "broken") return "#b71c1c";
  if (type === "bonus") return "gold";
  if (type === "timer") return "#6ec6ff";
  return "#ccc";
}

// --- Ana Component ---
export default function LoveGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const beaverImgRef = useRef<HTMLImageElement | null>(null);
  const brokenHeartImgRef = useRef<HTMLImageElement | null>(null);
  const coupleImgRef = useRef<HTMLImageElement | null>(null);

  const arrowImgRef = useRef<HTMLImageElement | null>(null);
  // Ok görselini yükle (hook kurallarına uygun şekilde en üstte, sadece bir tane)
  useEffect(() => {
    if (!arrowImgRef.current) {
      const img = new window.Image();
      img.src = "/love%20game/arrow.png";
      arrowImgRef.current = img;
    }
  }, []);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [timer, setTimer] = useState(GAME_TIME);
  const [charging, setCharging] = useState(false);
  const [chargeStart, setChargeStart] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [powerUp, setPowerUp] = useState<string | null>(null);
  const [wind, setWind] = useState(0);
  const [windActive, setWindActive] = useState(true);
  const [windTimer, setWindTimer] = useState(8);
  const [beaverX, setBeaverX] = useState(CANVAS_W / 2);
  const [arrowAnim, setArrowAnim] = useState(false);
  const [effect, setEffect] = useState<{x:number,y:number,type:string}|null>(null);
  const [lastHitType, setLastHitType] = useState<TargetType|null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // --- Oyun Başlat ---
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    setTargets(Array.from({length: 6}, (_,i) => randomTarget(i, level)));
    setArrows([]);
    setCombo(0);
    setEnergy(100);
    setTimer(GAME_TIME);
    setPowerUp(null);
    setWind((Math.random()-0.5)*4);
    setWindActive(true);
    setWindTimer(8);
    setBeaverX(CANVAS_W/2);
    setArrowAnim(false);
    setEffect(null);
    setLastHitType(null);
    // eslint-disable-next-line
  }, [gameOver, level]);

  // --- Zamanlayıcı ---
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    let t: NodeJS.Timeout | null = null;
    if (timer > 0) {
      t = setInterval(() => {
        setTimer(ti => {
          if (ti <= 1) {
            if (!gameOver) setGameOver(true);
            return 0;
          }
          return ti - 1;
        });
      }, 1000);
    }
    return () => { if (t) clearInterval(t); };
    // Sadece gameOver ve level değişince başlasın
  }, [gameOver, level]);

  // --- Rüzgar Zamanlayıcı ---
  useEffect(() => {
    if (gameOver || !windActive || !gameStarted) return;
    let t: NodeJS.Timeout | null = null;
    if (windTimer > 0) {
      t = setInterval(() => {
        setWindTimer(wt => {
          if (wt <= 1) {
            setWind((Math.random()-0.5)*4);
            return 8;
          }
          return wt - 1;
        });
      }, 1000);
    }
    return () => { if (t) clearInterval(t); };
  }, [gameOver, windActive]);

  // --- Hedefleri ve Okları Güncelle ---
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    const anim = setInterval(() => {
      setTargets(ts => ts.map(t => {
        let nx = t.x + t.vx + (windActive ? wind : 0);
        let ny = t.y + t.vy;
        // lover ve broken tipleri ekranda rastgele hareket etsin (hem yatay hem dikey)
        if (nx < t.radius || nx > CANVAS_W-t.radius) t.vx *= -1;
        if ((t.type === "lover" || t.type === "broken") && (ny < t.radius+40 || ny > CANVAS_H-t.radius-180)) t.vy *= -1;
        // bonus ve timer sadece yatayda hareket
        if (t.type === "lover" || t.type === "broken") {
          return {...t, x: Math.max(t.radius, Math.min(CANVAS_W-t.radius, nx)), y: Math.max(t.radius+40, Math.min(CANVAS_H-t.radius-180, ny))};
        } else {
          return {...t, x: Math.max(t.radius, Math.min(CANVAS_W-t.radius, nx))};
        }
      }));
      setArrows(arrs => arrs.map(a => ({...a, x: a.x + a.vx + (windActive ? wind : 0), y: a.y + a.vy}))
        .filter(a => a.y > -40 && a.active));
    }, 16);
    return () => clearInterval(anim);
  }, [gameOver, wind]);

  // --- Çarpışma ve Skor ---
  useEffect(() => {
    if (gameOver) return;
    
    let scoreChange = 0;
    let comboChange = 0;
    let timerChange = 0;
    let energyChange = 0;
    let levelChange = false;
    let shouldEndGame = false;
    let newEffect: any = null;
    let newLastHitType: any = null;
    
    // Check collisions
    const updatedArrows = arrows.map(a => {
      for (const t of targets) {
        if (!t.hit && Math.hypot(a.x-t.x, a.y-t.y) < t.radius) {
          t.hit = true;
          newLastHitType = t.type;
          newEffect = {x:t.x, y:t.y, type:t.type};
          if (t.type === "lover") {
            scoreChange += 10;
            comboChange += 1;
          } else if (t.type === "bonus") {
            scoreChange += 50;
            newEffect = {x:t.x, y:t.y, type:"bonus"};
          } else if (t.type === "timer") {
            timerChange += 5;
          } else if (t.type === "broken") {
            comboChange = -combo; // Reset combo
            energyChange -= 30;
          }
          a.active = false;
        }
      }
      return a;
    });
    
    // Apply all state changes at once
    if (scoreChange !== 0) {
      setScore(s => {
        const newScore = s + scoreChange;
        if (newScore > 0 && newScore % 100 === 0 && Math.floor(newScore/100) > Math.floor(s/100)) {
          setLevel(l => l + 1);
        }
        return newScore;
      });
    }
    if (comboChange !== 0) {
      setCombo(c => {
        const newCombo = comboChange < 0 ? 0 : c + comboChange;
        if (newCombo > 0 && newCombo % 5 === 0 && newCombo !== c) {
          setEffect({x:CANVAS_W/2, y:60, type:"combo"});
        }
        return newCombo;
      });
    }
    if (timerChange !== 0) setTimer(tm => tm + timerChange);
    if (energyChange !== 0) {
      setEnergy(e => {
        const newEnergy = Math.max(0, e + energyChange);
        if (newEnergy <= 0) {
          setGameOver(true);
        }
        return newEnergy;
      });
    }
    if (newEffect) setEffect(newEffect);
    if (newLastHitType) setLastHitType(newLastHitType);
    
    // Update arrows
    setArrows(updatedArrows);
    
    // Update targets - regenerate hit targets
    setTargets(ts => ts.map(t => t.hit ? randomTarget(Math.random()*10000, level) : t));
  }, [arrows.length, score]); // Only depend on arrow count and score to avoid infinite loop

  // --- Canvas Çizimi ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0,0,CANVAS_W,CANVAS_H);
    // Arka plan
    ctx.fillStyle = "#f7eaff";
    ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    // Bulutlar
    for(let i=0;i<4;i++){
      ctx.save();
      ctx.globalAlpha=0.15;
      ctx.beginPath();
      ctx.arc(60+i*90,60+20*Math.sin(i),40+10*Math.cos(i),0,2*Math.PI);
      ctx.fillStyle="#fff";
      ctx.fill();
      ctx.restore();
    }
    // Hedefler
    for(const t of targets){
      ctx.save();
      // Sadece bonus ve timer için arka plan dairesi çiz
      if(t.type==="bonus" || t.type==="timer") {
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius, 0, 2*Math.PI);
        ctx.fillStyle = getTargetColor(t.type);
        ctx.shadowColor = t.type==="bonus"?"gold":"#e75480";
        ctx.shadowBlur = t.type==="bonus"?20:0;
        ctx.fill();
      }
      ctx.restore();
      // Hedef tipi simgesi veya görseli
      ctx.save();
      if(t.type==="lover") {
        const img = coupleImgRef.current;
        if (img && img.complete) {
          const scale = 0.05;
          const w = img.width * scale;
          const h = img.height * scale;
          ctx.drawImage(img, t.x - w/2, t.y - h/2, w, h);
        } else if (img) {
          img.onload = () => {
            if (!ctx) return;
            const scale = 0.05;
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, t.x - w/2, t.y - h/2, w, h);
          };
        }
      }
      if(t.type==="bonus") {
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("💛", t.x, t.y);
      }
      if(t.type==="timer") {
        ctx.font = "bold 22px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("⏰", t.x, t.y);
      }
      if(t.type==="broken") {
        const img = brokenHeartImgRef.current;
        if (img && img.complete) {
          const scale = 0.4;
          const w = img.width * scale;
          const h = img.height * scale;
          ctx.drawImage(img, t.x - w/2, t.y - h/2, w, h);
        } else if (img) {
          img.onload = () => {
            if (!ctx) return;
            const scale = 0.4;
            const w = img.width * scale;
            const h = img.height * scale;
            ctx.drawImage(img, t.x - w/2, t.y - h/2, w, h);
          };
        }
      }
      ctx.restore();
    }
    // Oklar
    for(const a of arrows){
      if(!a.active) continue;
      ctx.save();
      const img = arrowImgRef.current;
      if (img && img.complete) {
        const scale = 0.13;
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.translate(a.x, a.y);
        // Okun açısı: sadece yukarı fırlatıldığı için -90 derece
        ctx.rotate(-Math.PI/2);
        ctx.drawImage(img, -w/2, -h/2, w, h);
      }
      ctx.restore();
    }
    // Beaver görseli (%10 boyutunda, orantılı)
    const img = beaverImgRef.current;
    if (img && img.complete) {
      const scale = 0.10; // %10 boyut
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      ctx.drawImage(img, beaverX - drawW / 2, BEAVER_Y - drawH / 2, drawW, drawH);
    }
    // Enerji barı
    ctx.save();
    ctx.fillStyle = "#b71c1c";
    ctx.globalAlpha = 0.18;
    ctx.fillRect(20, CANVAS_H-30, 120, 16);
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "#e75480";
    ctx.fillRect(20, CANVAS_H-30, 120*energy/100, 16);
    ctx.restore();
    // Skor, zaman, combo
    ctx.save();
    ctx.font = "bold 22px sans-serif";
    ctx.fillStyle = "#e75480";
    ctx.fillText(`Skor: ${score}`, 20, 36);
    ctx.fillText(`⏰ ${timer}s`, CANVAS_W-80, 36);
    if(combo>1) ctx.fillText(`🔥 Combo x${combo}`, CANVAS_W/2, 36);
    ctx.restore();
    // Efektler
    if(effect){
      ctx.save();
      if(effect.type==="bonus"){
        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "gold";
        ctx.fillText("+50!", effect.x, effect.y-40);
      } else if(effect.type==="combo"){
        ctx.font = "bold 32px sans-serif";
        ctx.fillStyle = "#e75480";
        ctx.fillText("COMBO!", effect.x, effect.y);
      } else if(effect.type==="broken"){
        ctx.font = "bold 28px sans-serif";
        ctx.fillStyle = "#b71c1c";
        ctx.fillText("Oops!", effect.x, effect.y-40);
      }
      ctx.restore();
    }
    // Rüzgar göstergesi
    ctx.save();
    ctx.font = "16px sans-serif";
    ctx.fillStyle = windActive ? "#6ec6ff" : "#999";
    ctx.fillText(windActive ? `🌬️ ${wind>0?"→":"←"} ${Math.abs(wind).toFixed(1)} (${windTimer}s)` : `🌬️ Kapalı`, CANVAS_W/2, CANVAS_H-20);
    ctx.textAlign = "center";
    ctx.restore();
    // Game over
    if(gameOver){
      ctx.save();
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, CANVAS_H/2-80, CANVAS_W, 160);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#e75480";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("Oyun Bitti!", CANVAS_W/2, CANVAS_H/2-10);
      ctx.font = "bold 22px sans-serif";
      ctx.fillText(`Skorun: ${score}`, CANVAS_W/2, CANVAS_H/2+32);
      ctx.restore();
    }
  }, [arrows, targets, score, combo, energy, timer, gameOver, effect, wind, beaverX]);

  // --- Kontroller: Basılı tut/çek ---
  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (gameOver || !gameStarted) return;
    setCharging(true);
    setChargeStart(Date.now());
  }
  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (gameOver || !gameStarted || !charging || chargeStart === null) return;
    setCharging(false);
    const duration = Math.min(1200, Date.now() - chargeStart);
    const power = 0.5 + duration / 1200;
    // Okun yönü ve gücü
    setArrows(arrs => [
      ...arrs,
      {
        x: beaverX,
        y: BEAVER_Y-32,
        vx: windActive ? wind*0.5 : 0,
        vy: -ARROW_SPEED*power,
        power,
        active: true,
      },
    ]);
    setArrowAnim(true);
    setTimeout(()=>setArrowAnim(false), 200);
  }
  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (gameOver || !gameStarted) return;
    // Mobilde nişan için X eksenini takip et
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(40, Math.min(CANVAS_W-40, x));
    setBeaverX(x);
  }
  function handleRestart() {
    setScore(0);
    setCombo(0);
    setEnergy(100);
    setTimer(GAME_TIME);
    setLevel(1);
    setGameOver(false);
    setGameStarted(false);
    setPowerUp(null);
    setWind((Math.random()-0.5)*4);
    setWindActive(true);
    setWindTimer(8);
    setEffect(null);
  }

  function handleStart() {
    setGameStarted(true);
  }

  function handleHome() {
    window.location.href = "/";
  }

  function toggleWind() {
    setWindActive(!windActive);
    if (windActive) {
      setWind(0);
    } else {
      setWind((Math.random()-0.5)*4);
      setWindTimer(8);
    }
  }

  useEffect(() => {
    if (!beaverImgRef.current) {
      const img = new window.Image();
      img.src = "/love%20game/asktanrisibeaver.png";
      beaverImgRef.current = img;
    }
  }, []);

  useEffect(() => {
    if (!brokenHeartImgRef.current) {
      const img = new window.Image();
      img.src = "/love%20game/broken-heart.png";
      brokenHeartImgRef.current = img;
    }
  }, []);

  useEffect(() => {
    if (!coupleImgRef.current) {
      const img = new window.Image();
      img.src = "/love%20game/couple.png";
      coupleImgRef.current = img;
    }
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#f7eaff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ borderRadius: 18, boxShadow: "0 4px 24px #e75480a0", background: "#fff", touchAction: "none", maxWidth: 400, maxHeight: 700, margin: "auto" }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
      />
      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap", justifyContent: "center" }}>
        {!gameStarted && !gameOver && (
          <>
            <button onClick={handleStart} style={{ fontSize: 18, background: "#e75480", color: "#fff", border: 0, borderRadius: 12, padding: "10px 28px", fontWeight: 700 }}>
              Start
            </button>
            <button onClick={handleHome} style={{ fontSize: 18, background: "#999", color: "#fff", border: 0, borderRadius: 12, padding: "10px 28px", fontWeight: 700 }}>
              Home
            </button>
          </>
        )}
        {gameOver && (
          <>
            <button onClick={handleRestart} style={{ fontSize: 18, background: "#e75480", color: "#fff", border: 0, borderRadius: 12, padding: "10px 28px", fontWeight: 700 }}>
              Play Again
            </button>
            <button onClick={handleHome} style={{ fontSize: 18, background: "#999", color: "#fff", border: 0, borderRadius: 12, padding: "10px 28px", fontWeight: 700 }}>
              Home
            </button>
          </>
        )}
        {gameStarted && !gameOver && (
          <>
            <button onClick={toggleWind} style={{ fontSize: 16, background: windActive ? "#6ec6ff" : "#999", color: "#fff", border: 0, borderRadius: 12, padding: "10px 24px", fontWeight: 700 }}>
              {windActive ? "🌬️ Wind Off" : "🌬️ Wind On"}
            </button>
            <button onClick={handleHome} style={{ fontSize: 16, background: "#999", color: "#fff", border: 0, borderRadius: 12, padding: "10px 24px", fontWeight: 700 }}>
              Home
            </button>
          </>
        )}
      </div>
      <div style={{ marginTop: 16, color: "#e75480", fontWeight: 600, fontSize: 16 }}>🏹 Cupid Beaver</div>
    </div>
  );
}
