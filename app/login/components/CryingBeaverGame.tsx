
"use client";
import React, { useEffect, useRef } from "react";

// Dikey telefon formatında, sağa-sola hareket eden ve ağlayan kunduz, yaşlar ve kova
export default function CryingBeaverGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = React.useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Boyutlar (dikey telefon)
    let width = (canvas.width = Math.min(360, window.innerWidth - 20));
    let height = (canvas.height = Math.min(640, window.innerHeight - 40));

    // Sad arka plan görseli
    const sadBg = new window.Image();
    sadBg.src = "/bears/sadbackground.avif";

    // Proportional beaver and bucket (adjusted)
    const BEAVER_WIDTH = width * 0.36; // larger beaver
    const BEAVER_ASPECT = 1.1;
    const BEAVER_HEIGHT = BEAVER_WIDTH / BEAVER_ASPECT;
    const BUCKET_WIDTH = width * 0.15; // smaller bucket
    const BUCKET_ASPECT = 1.2;
    const BUCKET_HEIGHT = BUCKET_WIDTH / BUCKET_ASPECT;
  // Block ground image
  const blockImg = new window.Image();
  blockImg.src = "/crying-beaver-game/block.png";

    // Beaver state
    const beaver = {
      x: width / 2 - BEAVER_WIDTH / 2,
      y: 48,
      w: BEAVER_WIDTH,
      h: BEAVER_HEIGHT,
      vx: (Math.random() > 0.5 ? 1 : -1) * (1.1 + Math.random() * 1.1),
      dirTimer: 0,
      dirInterval: 60 + Math.floor(Math.random() * 80),
    };

    // Bucket state
    const bucket = {
      x: width / 2 - BUCKET_WIDTH / 2,
      y: height - BUCKET_HEIGHT - 16,
      w: BUCKET_WIDTH,
      h: BUCKET_HEIGHT,
      vx: 0,
      speed: 6.5,
    };

    // Tears
    let tears: {
      x: number;
      y: number;
      vy: number;
      vx: number;
      t: number;
      phase: number;
      dirTimer: number;
      dirInterval: number;
      isLeft: boolean;
      width: number;
      height: number;
      caught: boolean;
    }[] = [];
    let tearTimer = 0;
    let localScore = 0;

    // PNG assets
    const beaverImg = new window.Image();
    beaverImg.src = "/crying-beaver-game/beaver.png";
    const bucketImg = new window.Image();
    bucketImg.src = "/crying-beaver-game/bucket.png";
    // Use new tear.png for both left and right tears
    const tearImg = new window.Image();
    tearImg.src = "/crying-beaver-game/tear.png";

    // Draw beaver
    function drawBeaver(x: number, y: number, w: number, h: number) {
      if (!ctx) return;
      if (beaverImg.complete && beaverImg.naturalWidth > 0) {
        const ratio = beaverImg.naturalWidth / beaverImg.naturalHeight;
        let drawW = w, drawH = h;
        if (ratio > 1) drawH = w / ratio;
        else drawW = h * ratio;
        ctx.drawImage(beaverImg, x + (w - drawW) / 2, y + (h - drawH) / 2, drawW, drawH);
      } else {
        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.scale(w / 48, h / 48);
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, 2 * Math.PI);
        ctx.fillStyle = "#b36b3c";
        ctx.fill();
        ctx.restore();
      }
    }

    // Draw bucket
    function drawBucket(x: number, y: number, w: number, h: number) {
      if (!ctx) return;
      if (bucketImg.complete && bucketImg.naturalWidth > 0) {
        const ratio = bucketImg.naturalWidth / bucketImg.naturalHeight;
        let drawW = w, drawH = h;
        if (ratio > 1) drawH = w / ratio;
        else drawW = h * ratio;
        ctx.drawImage(bucketImg, x + (w - drawW) / 2, y + (h - drawH) / 2, drawW, drawH);
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = "#90caf9";
        ctx.fill();
        ctx.strokeStyle = "#1976d2";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      }
    }

    // Draw tear (random size, swapped PNGs)
    function drawTear(x: number, y: number, w: number, h: number, phase: number, isLeft: boolean) {
        if (!ctx) return;
      if (tearImg.complete && tearImg.naturalWidth > 0) {
        // Preserve aspect ratio of tear.png
        const ratio = tearImg.naturalWidth / tearImg.naturalHeight;
        let drawW = w, drawH = h;
        if (ratio > 1) drawH = w / ratio;
        else drawW = h * ratio;
          ctx.drawImage(tearImg, x - drawW / 2, y - drawH / 2, drawW, drawH);
      } else {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(x, y, w / 2, h / 2, 0, 0, 2 * Math.PI);
        ctx.fillStyle = phase === 0 ? "#b3e5fc" : "#4fc3f7";
        ctx.fill();
        ctx.restore();
      }
    }

    // Main game loop
    function step() {
      // Beaver movement
      beaver.x += beaver.vx;
      beaver.dirTimer++;
      // Clamp beaver inside game area
      if (beaver.x < 0) {
        beaver.x = 0;
        beaver.vx = Math.abs(beaver.vx);
      }
      if (beaver.x + beaver.w > width) {
        beaver.x = width - beaver.w;
        beaver.vx = -Math.abs(beaver.vx);
      }
      // Randomly change beaver direction
      if (beaver.dirTimer > beaver.dirInterval) {
        beaver.vx = (Math.random() > 0.5 ? 1 : -1) * (1.1 + Math.random() * 1.1);
        beaver.dirTimer = 0;
        beaver.dirInterval = 60 + Math.floor(Math.random() * 80);
      }
      // Clamp beaver speed
      if (beaver.vx > 2.2) beaver.vx = 2.2;
      if (beaver.vx < -2.2) beaver.vx = -2.2;

      // Bucket movement
      bucket.x += bucket.vx;
      if (bucket.x < 0) bucket.x = 0;
      if (bucket.x + bucket.w > width) bucket.x = width - bucket.w;

      // Tear spawn (make tears larger)
        tearTimer++;
        if (tearTimer > 55) {
          const tearW1 = 32 + Math.random() * 22; // larger min/max
          const tearH1 = tearW1 * 0.8;
          const tearW2 = 32 + Math.random() * 22;
          const tearH2 = tearW2 * 0.8;
          tears.push({
            x: beaver.x + beaver.w * 0.28,
            y: beaver.y + beaver.h * 0.38,
            vy: 2.2 + Math.random() * 1.5,
            vx: (Math.random() - 0.5) * 1.2,
            t: 0,
            phase: 0,
            caught: false,
            dirTimer: 0,
            dirInterval: 10 + Math.floor(Math.random() * 18),
            isLeft: true,
            width: tearW1,
            height: tearH1,
          });
          tears.push({
            x: beaver.x + beaver.w * 0.72,
            y: beaver.y + beaver.h * 0.38,
            vy: 2.2 + Math.random() * 1.5,
            vx: (Math.random() - 0.5) * 1.2,
            t: 0,
            phase: 0,
            caught: false,
            dirTimer: 0,
            dirInterval: 10 + Math.floor(Math.random() * 18),
            isLeft: false,
            width: tearW2,
            height: tearH2,
          });
          tearTimer = 0;
        }

      // Move tears (up then down, random drift)
      for (const tear of tears) {
        if (!tear.caught) {
          tear.t++;
          // Random drift
          tear.dirTimer++;
          if (tear.dirTimer > tear.dirInterval) {
            tear.vx += (Math.random() - 0.5) * 0.8;
            if (tear.vx > 1.2) tear.vx = 1.2;
            if (tear.vx < -1.2) tear.vx = -1.2;
            tear.dirTimer = 0;
            tear.dirInterval = 10 + Math.floor(Math.random() * 18);
          }
          if (tear.t < 12) {
            tear.y -= 1.2;
            tear.x += tear.vx * 0.5;
            tear.phase = 0;
          } else {
            tear.y += tear.vy;
            tear.x += tear.vx;
            tear.phase = 1;
          }
        }
        // Collision with bucket
        if (
          !tear.caught &&
          tear.y + tear.height / 2 > bucket.y &&
          tear.x > bucket.x &&
          tear.x < bucket.x + bucket.w
        ) {
          tear.caught = true;
          localScore++;
          setScore(localScore);
        }
      }
      // Remove out-of-bounds or caught tears
      tears = tears.filter((t) => t.y < height && !t.caught);

      // Draw
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      // Arka plan görseli (sadbackground.avif) orijinal oranında, ortalanmış şekilde
      if (sadBg.complete && sadBg.naturalWidth > 0 && sadBg.naturalHeight > 0) {
        const imgRatio = sadBg.naturalWidth / sadBg.naturalHeight;
        const canvasRatio = width / height;
        let drawW = width, drawH = height, dx = 0, dy = 0;
        if (imgRatio > canvasRatio) {
          // Görsel daha geniş: yükseklik tam, genişlik taşarsa ortala
          drawH = height;
          drawW = height * imgRatio;
          dx = (width - drawW) / 2;
        } else {
          // Görsel daha dar: genişlik tam, yükseklik taşarsa ortala
          drawW = width;
          drawH = width / imgRatio;
          dy = (height - drawH) / 2;
        }
        ctx.drawImage(sadBg, dx, dy, drawW, drawH);
      } else {
        ctx.fillStyle = "#b3e5c7"; // fallback background color
        ctx.fillRect(0, 0, width, height);
      }
      // Draw ground block at the bottom
      // Sadece kunduzun ayağının altına, orijinal boyutunda ve ortalanmış olarak çim bloğu koy
      if (blockImg.complete && blockImg.naturalWidth > 0 && blockImg.naturalHeight > 0) {
        const blockW = blockImg.naturalWidth;
        const blockH = blockImg.naturalHeight;
        const thinH = blockH * 0.35;
        const grassY = beaver.y + beaver.h - thinH / 2;
        const grassX = beaver.x + beaver.w / 2 - blockW / 2;
        ctx.drawImage(blockImg, grassX, grassY, blockW, thinH);
      }
      drawBeaver(beaver.x, beaver.y, beaver.w, beaver.h);
      for (const tear of tears) drawTear(tear.x, tear.y, tear.width, tear.height, tear.phase, tear.isLeft);
      drawBucket(bucket.x, bucket.y, bucket.w, bucket.h);
      ctx.fillStyle = "#1976d2";
      ctx.font = "18px sans-serif";
      ctx.fillText(`Toplanan yaş: ${localScore}`, 10, 30);
      requestAnimationFrame(step);
    }
    step();

    // Keyboard controls
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") bucket.vx = -bucket.speed;
      else if (e.key === "ArrowRight") bucket.vx = bucket.speed;
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") bucket.vx = 0;
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);

    // Touch controls for mobile
    function onTouch(e: TouchEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      if (x < width / 2) {
        bucket.vx = -bucket.speed;
      } else {
        bucket.vx = bucket.speed;
      }
    }
    function onTouchEnd() {
      bucket.vx = 0;
    }
    canvas.addEventListener("touchstart", onTouch);
    canvas.addEventListener("touchmove", onTouch);
    canvas.addEventListener("touchend", onTouchEnd);

    // Responsive
    function resize() {
      width = canvas.width = Math.min(360, window.innerWidth - 20);
      height = canvas.height = Math.min(640, window.innerHeight - 40);
    }
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("touchstart", onTouch);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 8 }}>
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: 16,
          boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
          touchAction: "none",
          background: "#e3f2fd",
        }}
      />
      <div style={{ fontWeight: 600, fontSize: 18, marginTop: 8 }}>Toplanan yaş: {score}</div>
    </div>
  );
}
