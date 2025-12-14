"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MOODS = [
  { id: "cry", label: "Üzgün", emoji: "😢" },
  { id: "happy", label: "Mutlu", emoji: "😄" },
  { id: "sweat", label: "Gergin", emoji: "😅" },
  { id: "sleep", label: "Uykulu", emoji: "😴" },
  { id: "love", label: "Aşık", emoji: "😍" },
  { id: "fire", label: "Ateşli", emoji: "🔥😎" },
];

export default function Home() {
    const router = useRouter();
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const [playing, setPlaying] = React.useState(true);
    // prefer background.mp4 if the user named the file that way
    const [videoSrc, setVideoSrc] = React.useState<string>('/background.mp4');

    // Helper for returning a possible image path in /public/moods/<id>.png
    function moodImagePath(id: string) {
      return `/moods/${id}.png`;
    }

    // Ensure video stays playing in the background and cannot be paused by clicking
    React.useEffect(() => {
      const v = videoRef.current;
      if (!v) return;

      // Try to play automatically
      v.play().catch(() => {});

      function onPause() {
        // Immediately try to resume playback
        const vv = videoRef.current;
        if (!vv) return;
        try { vv.play().catch(() => {}); } catch (_) {}
      }

      v.addEventListener("pause", onPause);

      return () => { v.removeEventListener("pause", onPause); };
    }, []);

    // On mount, try to locate an available intro video file.
    React.useEffect(() => {
      let mounted = true;
      async function findVideo() {
        const candidates = [
          '/background.mp4',
          '/intro.mp4',
          '/WhatsApp Video 2025-12-14 at 15.55.30.mp4',
          '/WhatsApp%20Video%202025-12-14%20at%2015.55.30.mp4'
        ];

        for (const c of candidates) {
          try {
            const res = await fetch(c, { method: 'HEAD' });
            if (res.ok) {
              if (mounted) setVideoSrc(c);
              return;
            }
          } catch (e) {
            // ignore and try next
          }
        }
        // leave default '/intro.mp4' if none found
      }
      findVideo();
      return () => { mounted = false; };
    }, []);

    // no visible controls: video is background and loops until a button is pressed

    // Phone-frame layout: show a centered phone mockup with video playing inside
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="relative w-[360px] sm:w-[420px] bg-black rounded-3xl shadow-2xl overflow-hidden">
          {/* subtle bezel overlay */}
          <div className="absolute inset-0 bg-black/40 z-0" />

          <div className="relative aspect-[9/16] bg-black">
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              autoPlay
              muted
              loop
              playsInline
              poster="/intro-poster.jpg"
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Center marker removed per design request */}

            {/* Title and subtitle */}
            <div className="absolute inset-x-0 top-8 z-10 flex flex-col items-center px-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-300 tracking-tight drop-shadow-[0_2px_0_rgba(0,0,0,0.6)]" style={{ WebkitTextStroke: '2px #111827', lineHeight: '0.9' }}>
                BRAVER
                <br />
                BEAVER
              </h1>

              <div className="mt-2 text-3xl text-cyan-200 font-bold italic" style={{ fontFamily: 'var(--font-pacifico)' }}>CHOOSE!</div>
            </div>

            {/* Mood buttons laid out at bottom inside phone */}
            <div className="absolute bottom-6 left-0 right-0 z-10 px-6">
              <div className="grid grid-cols-3 gap-4">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => router.push(`/mood/${mood.id}`)}
                    className="relative w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-md border border-white/40 overflow-hidden"
                  >
                    <Image
                      src={moodImagePath(mood.id)}
                      alt={mood.label}
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                    <span className="absolute bottom-[-8px] text-xs bg-transparent text-white/90 font-semibold">{mood.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom speaker notch / phone bezel */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/60 rounded-full" />
        </div>
      </div>
    );
  }
