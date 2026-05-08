"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ReelData {
  vimeoId: string;
  previewSrc: string;
  views: string;
  likes: string;
  comments: string;
}

// ─── Counter Hook ────────────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

// ─── Intersection Observer Hook ──────────────────────────────────────────────
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Stat Counter ─────────────────────────────────────────────────────────────
function StatCounter({ value, label, suffix = "+" }: { value: number; label: string; suffix?: string }) {
  const { ref, inView } = useInView();
  const count = useCounter(value, 2000, inView);
  return (
    <div ref={ref} className="stat-item">
      <span className="stat-number">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({ views, likes, comments, vimeoId }: { views: string; likes: string; comments: string; vimeoId: string }) {
  return (
    <div className="video-card">
      <div className="video-thumb">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autopause=0&loop=0&muted=0&title=0&portrait=0&byline=0`}
          frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        />
      </div>
      <div className="video-stats">
        <div className="vstat"><span className="vstat-num">{views}</span><span className="vstat-lbl">Views</span></div>
        <div className="vstat"><span className="vstat-num">{likes}</span><span className="vstat-lbl">Likes</span></div>
        <div className="vstat"><span className="vstat-num">{comments}</span><span className="vstat-lbl">Comments</span></div>
      </div>
    </div>
  );
}

// ─── Reel Modal ───────────────────────────────────────────────────────────────
function ReelModal({ reel, onClose }: { reel: ReelData; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="reel-modal-backdrop" onClick={onClose}>
      <div className="reel-modal" onClick={e => e.stopPropagation()}>
        <button className="reel-modal-close" onClick={onClose}>✕</button>
        <div className="reel-modal-video-wrap">
          <iframe
            src={`https://player.vimeo.com/video/${reel.vimeoId}?autoplay=1&title=0&portrait=0&byline=0`}
            frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0, borderRadius: "16px 16px 0 0" }}
          />
        </div>
        <div className="reel-modal-stats">
          <div className="reel-modal-stat"><span className="reel-modal-stat-num">{reel.views}</span><span className="reel-modal-stat-lbl">Views</span></div>
          <div className="reel-modal-stat"><span className="reel-modal-stat-num">{reel.likes}</span><span className="reel-modal-stat-lbl">Likes</span></div>
          <div className="reel-modal-stat"><span className="reel-modal-stat-num">{reel.comments}</span><span className="reel-modal-stat-lbl">Comments</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Reel Card ───────────────────────────────────────────────────────────
function HeroReelCard({ reel, index, isCenter, onClick }: { reel: ReelData; index: number; isCenter?: boolean; onClick: () => void }) {
  // Arch: [0, -40, -80, -40, 0] — positive = lower, so we use marginBottom to lift
  const lifts = [0, 40, 80, 40, 0];
  const lift = lifts[index] ?? 0;

  return (
    <div
      className={isCenter ? "reel-card reel-card--center" : "reel-card"}
      onClick={onClick}
      style={{ cursor: "pointer", marginBottom: lift }}
    >
      <video
        src={reel.previewSrc}
        autoPlay muted loop playsInline
        style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }}
      />
      <div className="reel-card-overlay">
        <div className="reel-play-btn">▶</div>
      </div>
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────
function TestimonialCard({ name, vimeoId }: { name: string; vimeoId: string }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-video">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?autopause=0&loop=0&muted=0&title=0&portrait=0&byline=0`}
          frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen
          style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
        />
      </div>
      <p className="testimonial-name">— {name}</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ViralishHomepage({ name = "Kriszy Garcia" }: { name?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeReel, setActiveReel] = useState<ReelData | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const reels: ReelData[] = [
    { vimeoId: "1012531485", previewSrc: "/videos/reel1-preview.mp4", views: "102M+", likes: "540k+",  comments: "6,400+" },
    { vimeoId: "1012531485", previewSrc: "/videos/reel1-preview.mp4", views: "85M+",  likes: "1.2M+",  comments: "18K+"   },
    { vimeoId: "1012531485", previewSrc: "/videos/reel1-preview.mp4", views: "200M+", likes: "4M+",    comments: "42K+"   },
    { vimeoId: "1012531485", previewSrc: "/videos/reel1-preview.mp4", views: "45M+",  likes: "800K+",  comments: "9K+"    },
    { vimeoId: "1012531485", previewSrc: "/videos/reel1-preview.mp4", views: "30M+",  likes: "550K+",  comments: "5K+"    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@900&family=Montserrat:wght@400;500;600;700;800;900&family=Dancing+Script:wght@700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --red: #E8000B; --dark: #1a1a1a; --darker: #111111;
          --darkest: #0a0a0a; --white: #ffffff;
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'Montserrat', sans-serif; background: var(--darkest); color: var(--white); overflow-x: hidden; }

        /* ── NAVBAR ── */
        .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 18px 48px; background: transparent; }
        .nav-logo { display: flex; align-items: center; text-decoration: none; }
        .nav-logo-text { font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: 900; color: var(--white); text-transform: lowercase; }
        .nav-logo-text .accent { color: var(--red); }
        .nav-links { display: flex; gap: 36px; list-style: none; }
        .nav-links a { font-size: 14px; font-weight: 600; letter-spacing: 0.5px; color: rgba(255,255,255,0.9); text-decoration: none; transition: color 0.2s; }
        .nav-links a:hover, .nav-links a.active { color: var(--red); }
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
        .hamburger span { display: block; width: 24px; height: 2px; background: var(--white); }
        .mobile-menu { display: none; position: fixed; inset: 0; background: var(--darkest); z-index: 99; flex-direction: column; align-items: center; justify-content: center; gap: 40px; }
        .mobile-menu.open { display: flex; }
        .mobile-menu a { font-family: 'Bebas Neue', sans-serif; font-size: 48px; letter-spacing: 3px; color: var(--white); text-decoration: none; }
        .mobile-menu a:hover { color: var(--red); }
        .mobile-close { position: absolute; top: 24px; right: 30px; font-size: 32px; color: var(--white); cursor: pointer; background: none; border: none; }

        /* ── HERO ── */
        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 110px;
          text-align: center;
          position: relative;
          background: #0a0a0a;
          /* NO overflow:hidden — cards need to be visible above */
        }
        .hero-bg {
          position: absolute; inset: 0; background-color: #1a1210;
          background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.75)),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='800' height='600' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E");
          background-size: cover; background-position: center; z-index: 0;
        }
        .hero-bg::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%), linear-gradient(225deg, rgba(255,255,255,0.04) 0%, transparent 40%);
          z-index: 1;
        }
        .hero-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; width: 100%; padding-bottom: 0; }

        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(30,30,30,0.85); border: 1px solid rgba(255,255,255,0.12); border-radius: 100px; padding: 8px 20px; font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.85); margin-bottom: 28px; backdrop-filter: blur(8px); }
        .hero-badge-dot { width: 10px; height: 10px; background: var(--red); border-radius: 50%; flex-shrink: 0; }
        .hero-badge strong { color: var(--white); font-weight: 800; }

        .hero-title { font-family: 'Barlow Condensed', sans-serif; font-weight: 900; font-size: clamp(64px, 11vw, 148px); line-height: 0.92; letter-spacing: -1px; text-transform: uppercase; color: var(--white); text-shadow: 0 2px 20px rgba(0,0,0,0.4); }

        .hero-cursive-row { width: 100%; max-width: 900px; display: flex; justify-content: flex-end; padding-right: 24px; margin-top: 8px; margin-bottom: 40px; }
        .hero-cursive { font-family: 'Dancing Script', cursive; font-size: clamp(22px, 3vw, 38px); color: var(--white); display: flex; align-items: center; gap: 8px; }
        .hero-cursive-arrow { display: inline-block; margin-right: 4px; opacity: 0.9; }

        .hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 56px; }
        .btn-hero-red { background: var(--red); color: var(--white); padding: 0 40px; height: 72px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: none; cursor: pointer; text-decoration: none; transition: all 0.25s; border-radius: 4px; min-width: 260px; }
        .btn-hero-red:hover { background: #ff1a24; transform: translateY(-2px); }
        .btn-hero-red-main { font-size: 17px; font-weight: 800; letter-spacing: 0.5px; line-height: 1.2; }
        .btn-hero-red-sub { font-size: 11px; font-weight: 500; opacity: 0.85; margin-top: 3px; }
        .btn-hero-dark { background: rgba(40,40,40,0.92); color: var(--white); padding: 0 40px; height: 72px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.12); cursor: pointer; text-decoration: none; transition: all 0.25s; border-radius: 4px; min-width: 260px; backdrop-filter: blur(8px); }
        .btn-hero-dark:hover { background: rgba(60,60,60,0.95); transform: translateY(-2px); }
        .btn-hero-dark-main { font-size: 17px; font-weight: 800; letter-spacing: 0.5px; line-height: 1.2; }
        .btn-hero-dark-sub { font-size: 11px; font-weight: 500; opacity: 0.65; margin-top: 3px; }

        /* ── HERO REELS — arch layout ── */
        .hero-reels-wrap {
          width: 100%;
          position: relative;
          z-index: 2;
          overflow: visible;
        }
        .hero-reels-annotation {
          position: absolute;
          left: calc(20% + 8px);
          top: 8px;
          display: flex; flex-direction: column; align-items: flex-start;
          z-index: 10; pointer-events: none;
        }
        .hero-reels-annotation-text { font-family: 'Dancing Script', cursive; font-size: 20px; color: var(--white); opacity: 0.95; margin-bottom: 2px; }

        /* Key: align-items: flex-end so all cards bottom-align,
           then marginBottom pushes individual cards UP */
        .hero-reels-scroll {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          width: 100%;
          overflow: visible;
          padding: 0;
        }

        .reel-card {
          flex: 1;
          min-width: 0;
          aspect-ratio: 9/16;
          position: relative;
          border-radius: 18px;
          overflow: hidden;
          background: #111;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .reel-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 20px 60px rgba(0,0,0,0.6); z-index: 5; }
        .reel-card--center { z-index: 3; box-shadow: 0 24px 80px rgba(0,0,0,0.7); border-radius: 18px; }
        .reel-card--center:hover { transform: translateY(-6px) scale(1.02); }
        .reel-card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); display: flex; align-items: center; justify-content: center; transition: background 0.25s ease; z-index: 3; }
        .reel-card:hover .reel-card-overlay { background: rgba(0,0,0,0.35); }
        .reel-play-btn { width: 56px; height: 56px; background: rgba(255,255,255,0.92); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #111; opacity: 0; transform: scale(0.7); transition: opacity 0.25s ease, transform 0.25s ease; padding-left: 4px; }
        .reel-card:hover .reel-play-btn { opacity: 1; transform: scale(1); }

        /* ── REEL MODAL ── */
        .reel-modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .reel-modal { width: min(380px, 92vw); background: #111; border-radius: 20px; overflow: hidden; box-shadow: 0 40px 120px rgba(0,0,0,0.9); animation: slideUp 0.28s cubic-bezier(0.34,1.56,0.64,1); position: relative; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .reel-modal-close { position: absolute; top: 12px; right: 12px; z-index: 10; width: 36px; height: 36px; border-radius: 50%; background: rgba(232,0,11,0.9); color: white; border: none; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .reel-modal-close:hover { background: #ff1a24; }
        .reel-modal-video-wrap { position: relative; width: 100%; aspect-ratio: 7/11; background: #000; }
        .reel-modal-stats { display: grid; grid-template-columns: repeat(3, 1fr); padding: 20px 0; border-top: 1px solid rgba(255,255,255,0.08); background: #111; }
        .reel-modal-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; border-right: 1px solid rgba(255,255,255,0.07); }
        .reel-modal-stat:last-child { border-right: none; }
        .reel-modal-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--white); line-height: 1; }
        .reel-modal-stat-lbl { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.45); }

        /* ── LOGO STRIP ── */
        .logo-strip { width: 100%; overflow: hidden; background: rgba(0,0,0,0.88); padding: 32px 0; position: relative; z-index: 3; }
        .logo-track { display: flex; gap: 64px; align-items: center; animation: scroll-logos 24s linear infinite; width: max-content; }
        @keyframes scroll-logos { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .logo-item { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 3px; color: rgba(255,255,255,0.25); white-space: nowrap; transition: color 0.3s; }
        .logo-item:hover { color: rgba(255,255,255,0.7); }
        .logo-dot { width: 6px; height: 6px; background: var(--red); border-radius: 50%; flex-shrink: 0; }

        /* ── SECTION SHARED ── */
        .section { padding: 100px 60px; max-width: 1300px; margin: 0 auto; }
        .section-tag { font-size: 11px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: var(--red); margin-bottom: 16px; display: block; }
        .section-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(40px, 5vw, 72px); line-height: 1; margin-bottom: 20px; }
        .section-title .accent { color: var(--red); }

        /* ── SERVICES ── */
        .services-header { max-width: 1300px; margin: 0 auto; padding: 80px 60px 48px; display: flex; align-items: flex-end; justify-content: space-between; gap: 40px; }
        .services-header-left { flex: 1; }
        .services-main-title { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: clamp(28px, 4vw, 58px); line-height: 1.05; text-transform: uppercase; color: var(--white); margin-bottom: 20px; letter-spacing: -0.5px; }
        .services-viral-word { position: relative; display: inline-block; color: var(--red); }
        .services-viral-oval { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 115%; height: 140%; pointer-events: none; }
        .services-subtitle { font-size: 16px; color: rgba(255,255,255,0.65); font-weight: 400; line-height: 1.5; }
        .btn-services-cta { background: var(--red); color: var(--white); font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 18px 48px; border: none; cursor: pointer; text-decoration: none; transition: all 0.25s; white-space: nowrap; flex-shrink: 0; }
        .btn-services-cta:hover { background: #ff1a24; transform: translateY(-2px); }

        .services-cards { max-width: 1300px; margin: 0 auto; padding: 0 60px 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .service-video-card { position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 9/11; background: #111; cursor: pointer; }
        .service-video-card:hover .service-video-overlay { background: linear-gradient(to bottom, rgba(0,0,0,0) 20%, rgba(0,0,0,0.92) 65%, rgba(0,0,0,0.97) 100%); }
        .service-video-bg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: hidden; }
        .service-video-overlay { position: absolute; inset: 0; z-index: 2; background: linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.88) 65%, rgba(0,0,0,0.95) 100%); transition: background 0.3s; }
        .service-video-content { position: absolute; bottom: 0; left: 0; right: 0; z-index: 3; padding: 0 32px 0; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px; }
        .service-video-title { font-family: 'Montserrat', sans-serif; font-weight: 900; font-size: clamp(18px, 2.2vw, 26px); letter-spacing: 1px; text-transform: uppercase; color: var(--white); text-shadow: 0 2px 12px rgba(0,0,0,0.8); }
        .service-video-desc { font-size: 15px; color: rgba(255,255,255,0.88); line-height: 1.55; max-width: 360px; text-shadow: 0 1px 8px rgba(0,0,0,0.9); }
        .service-video-desc strong { color: var(--white); }
        .btn-service-video { display: block; width: calc(100% + 64px); margin: 10px -32px 0; background: var(--red); color: var(--white); font-size: 13px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 18px; text-align: center; text-decoration: none; transition: background 0.25s; }
        .btn-service-video:hover { background: #ff1a24; }
        .service-card-play { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 4; opacity: 0; transition: opacity 0.25s; }
        .service-video-card:hover .service-card-play { opacity: 1; }
        .service-video-card .reel-play-btn { width: 64px !important; height: 64px !important; font-size: 22px !important; opacity: 1 !important; transform: scale(1) !important; }

        /* ── RESULTS ── */
        .results-section { background: linear-gradient(180deg, #0a0a0a 0%, #100000 50%, #0a0a0a 100%); padding: 100px 0; }
        .results-inner { max-width: 1300px; margin: 0 auto; padding: 0 60px; }
        .results-header { text-align: center; margin-bottom: 64px; }
        .results-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; }
        .result-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); padding: 32px 24px; text-align: center; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
        .result-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: var(--red); transform: scaleX(0); transition: transform 0.3s; }
        .result-card:hover { background: rgba(232,0,11,0.06); border-color: rgba(232,0,11,0.2); }
        .result-card:hover::after { transform: scaleX(1); }
        .result-num { font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: var(--red); line-height: 1; display: block; }
        .result-label { font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-top: 8px; }

        /* ── FOUNDER ── */
        .founder-section { max-width: 1300px; margin: 0 auto; padding: 100px 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .founder-image-wrap { position: relative; }
        .founder-image-placeholder { width: 100%; aspect-ratio: 1; background: linear-gradient(135deg, #1a0a0a, #2a0808); border: 1px solid rgba(232,0,11,0.2); display: flex; align-items: center; justify-content: center; font-size: 120px; position: relative; overflow: hidden; }
        .founder-image-placeholder::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 60% 40%, rgba(232,0,11,0.15), transparent 60%); }
        .founder-badge { position: absolute; bottom: -16px; right: -16px; background: var(--red); padding: 20px 24px; text-align: center; }
        .founder-badge-num { font-family: 'Bebas Neue', sans-serif; font-size: 42px; line-height: 1; }
        .founder-badge-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; opacity: 0.9; }
        .founder-script { font-family: 'Dancing Script', cursive; font-size: 18px; color: var(--red); margin-bottom: 12px; }
        .founder-title { font-family: 'Bebas Neue', sans-serif; font-size: 62px; line-height: 1; margin-bottom: 24px; }
        .founder-body { font-size: 15px; color: rgba(255,255,255,0.65); line-height: 1.8; margin-bottom: 40px; }
        .founder-body strong { color: var(--white); }
        .founder-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding-top: 40px; border-top: 1px solid rgba(255,255,255,0.08); }
        .stat-item { display: flex; flex-direction: column; gap: 4px; }
        .stat-number { font-family: 'Bebas Neue', sans-serif; font-size: 44px; color: var(--red); line-height: 1; }
        .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.5); }

        /* ── TESTIMONIALS ── */
        .testimonials-section { background: var(--darker); padding: 100px 0; }
        .testimonials-inner { max-width: 1300px; margin: 0 auto; padding: 0 60px; }
        .testimonials-header { text-align: center; margin-bottom: 64px; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .testimonial-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); overflow: hidden; transition: all 0.3s; }
        .testimonial-card:hover { border-color: rgba(232,0,11,0.3); transform: translateY(-4px); }
        .testimonial-video { position: relative; padding-top: 56.25%; }
        .testimonial-name { padding: 16px 20px; font-size: 14px; font-weight: 700; letter-spacing: 1px; color: rgba(255,255,255,0.7); }

        /* ── RESULT VIDEOS ── */
        .videos-section { max-width: 1300px; margin: 0 auto; padding: 100px 60px; }
        .videos-header { text-align: center; margin-bottom: 64px; }
        .videos-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .video-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); overflow: hidden; transition: all 0.3s; border-radius: 8px; }
        .video-card:hover { border-color: rgba(232,0,11,0.25); transform: translateY(-4px); }
        .video-thumb { position: relative; padding-top: 56.25%; }
        .video-stats { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgba(255,255,255,0.06); }
        .vstat { display: flex; flex-direction: column; align-items: center; padding: 16px 12px; border-right: 1px solid rgba(255,255,255,0.06); }
        .vstat:last-child { border-right: none; }
        .vstat-num { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--red); }
        .vstat-lbl { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.4); margin-top: 2px; }

        /* ── FINAL CTA ── */
        .final-cta { text-align: center; padding: 120px 24px; background: linear-gradient(180deg, #0a0a0a 0%, #140000 50%, #0a0a0a 100%); position: relative; overflow: hidden; }
        .final-cta::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 700px; height: 700px; background: radial-gradient(circle, rgba(232,0,11,0.1) 0%, transparent 70%); pointer-events: none; }
        .final-cta-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(48px, 8vw, 100px); line-height: 1; margin-bottom: 24px; position: relative; }
        .final-cta-title .accent { color: var(--red); }
        .final-cta-sub { font-size: 16px; color: rgba(255,255,255,0.5); margin-bottom: 48px; position: relative; }
        .final-cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }

        /* ── BUTTONS ── */
        .btn-primary { background: var(--red); color: var(--white); font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 16px 36px; border: none; cursor: pointer; text-decoration: none; transition: all 0.25s; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); display: inline-block; }
        .btn-primary:hover { background: #ff1a24; transform: translateY(-2px); }
        .btn-outline { background: transparent; color: var(--white); font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 14px 34px; border: 2px solid rgba(255,255,255,0.4); cursor: pointer; text-decoration: none; transition: all 0.25s; clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%); display: inline-block; }
        .btn-outline:hover { border-color: var(--red); color: var(--red); transform: translateY(-2px); }

        /* ── FOOTER ── */
        .footer { background: #050505; border-top: 1px solid rgba(255,255,255,0.05); padding: 60px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
        .footer-logo { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; }
        .footer-logo span { color: var(--red); }
        .footer-links { display: flex; gap: 32px; list-style: none; }
        .footer-links a { font-size: 12px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--red); }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.25); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1024px) {
          .navbar { padding: 16px 24px; }
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .section { padding: 80px 32px; }
          .results-grid { grid-template-columns: repeat(3, 1fr); }
          .founder-section { grid-template-columns: 1fr; padding: 80px 32px; gap: 48px; }
          .testimonials-grid { grid-template-columns: repeat(2, 1fr); }
          .videos-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-inner, .results-inner, .videos-section { padding: 0 32px; }
          .footer { padding: 40px 32px; }
          .services-header { padding: 60px 32px 32px; flex-direction: column; align-items: flex-start; }
          .services-cards { padding: 0 32px 80px; }
        }
        @media (max-width: 640px) {
          .hero-ctas { flex-direction: column; align-items: center; }
          .btn-hero-red, .btn-hero-dark { min-width: 280px; }
          .results-grid { grid-template-columns: repeat(2, 1fr); }
          .testimonials-grid { grid-template-columns: 1fr; }
          .videos-grid { grid-template-columns: 1fr; }
          .founder-stats { grid-template-columns: repeat(2, 1fr); }
          .footer-links { flex-direction: column; gap: 12px; }
          .hero-title { font-size: clamp(44px, 13vw, 80px); }
          .services-cards { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <a href="#" className="nav-logo">
          {/* <span className="nav-logo-text">viral<span className="accent">i</span>sh</span> */}
        {name}
        </a>
        {/* <ul className="nav-links">
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#">Brands</a></li>
          <li><a href="#">Speaking</a></li>
        </ul> */}
        {/* <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button> */}
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button className="mobile-close" onClick={() => setMenuOpen(false)}>✕</button>
        <a href="#" onClick={() => setMenuOpen(false)}>Home</a>
        <a href="#" onClick={() => setMenuOpen(false)}>Brands</a>
        <a href="#" onClick={() => setMenuOpen(false)}>Speaking</a>
      </div>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Viralish Is The Leader In <strong>&nbsp;Viral Videos</strong>
          </div>
          <h1 className="hero-title">
            WE KNOW HOW TO<br />GET ATTENTION
          </h1>
          <div className="hero-cursive-row">
            <span className="hero-cursive">
              <svg className="hero-cursive-arrow" width="32" height="28" viewBox="0 0 32 28" fill="none">
                <path d="M2 4C6 2 14 6 12 14C10 20 4 22 8 26" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                <path d="M6 24L8 27L11 24" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              And A Lot Of It...
            </span>
          </div>
          <div className="hero-ctas">
            <a href="#services" className="btn-hero-red">
              <span className="btn-hero-red-main">Work With Us</span>
              <span className="btn-hero-red-sub">For Entrepreneurs or Big Brands</span>
            </a>
            <a href="#" className="btn-hero-dark">
              <span className="btn-hero-dark-main">Book Adley To Speak</span>
              <span className="btn-hero-dark-sub">For Events</span>
            </a>
          </div>

          {/* Reel cards — arch via marginBottom */}
          <div className="hero-reels-wrap">
            <div className="hero-reels-annotation">
              <span className="hero-reels-annotation-text">Click To View</span>
              <svg width="44" height="40" viewBox="0 0 44 40" fill="none">
                <path d="M8 4C14 2 22 10 18 22C15 30 4 32 8 38" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85"/>
                <path d="M5 34L8 39L12 34" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85"/>
              </svg>
            </div>
            <div className="hero-reels-scroll">
              {reels.map((reel, i) => (
                <HeroReelCard
                  key={i}
                  index={i}
                  reel={reel}
                  isCenter={i === 2}
                  onClick={() => setActiveReel(reel)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REEL MODAL ── */}
      {activeReel && <ReelModal reel={activeReel} onClose={() => setActiveReel(null)} />}

      {/* ── LOGO STRIP ── */}
      <div className="logo-strip">
        <div className="logo-track">
          {["BUSINESS INSIDER","CBS","ENTREPRENEUR","YAHOO FINANCE","LAND ROVER","RED BULL","HP","AIRHEADS","RAISING CANE'S",
            "BUSINESS INSIDER","CBS","ENTREPRENEUR","YAHOO FINANCE","LAND ROVER","RED BULL","HP","AIRHEADS","RAISING CANE'S"].map((name, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <span className="logo-item">{name}</span>
              <span className="logo-dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section id="services" style={{ background: "var(--darkest)" }}>
        <div className="services-header">
          <div className="services-header-left">
            <h2 className="services-main-title">
              WE HELP ENTREPRENEURS &amp; BIG BRANDS<br />
              CREATE{" "}
              <span className="services-viral-word">
                <svg className="services-viral-oval" viewBox="0 0 120 52" fill="none" preserveAspectRatio="none">
                  <ellipse cx="60" cy="26" rx="57" ry="23" stroke="#E8000B" strokeWidth="4"/>
                </svg>
                VIRAL
              </span>
              {" "}CONTENT
            </h2>
            <p className="services-subtitle">Work With Us To Harness The Power Of Viral Videos</p>
          </div>
          <a href="#" className="btn-services-cta">Work With Us</a>
        </div>
        <div className="services-cards">
          <div className="service-video-card"
            onClick={() => setActiveReel({ vimeoId: "1012531485", previewSrc: "/videos/reel1-preview.mp4", views: "102M+", likes: "540k+", comments: "6,400+" })}>
            <div className="service-video-bg">
              <video src="/videos/reel1-preview.mp4" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
              <div className="service-video-overlay" />
              <div className="service-card-play"><div className="reel-play-btn">▶</div></div>
            </div>
            <div className="service-video-content">
              <h3 className="service-video-title">FOR ENTREPRENEURS</h3>
              <p className="service-video-desc">We help your brand get more attention so you can get more sales.</p>
              <a href="#" className="service-video-desc" onClick={e => e.stopPropagation()}>
                {/* Join The Viralish Community */}
                </a>
            </div>
          </div>
          <div className="service-video-card"
            onClick={() => setActiveReel({ vimeoId: "1012531485", previewSrc: "/videos/reel1-preview.mp4", views: "85M+", likes: "1.2M+", comments: "18K+" })}>
            <div className="service-video-bg">
              <video src="/videos/reel1-preview.mp4" autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
              <div className="service-video-overlay" />
              <div className="service-card-play"><div className="reel-play-btn">▶</div></div>
            </div>
            <div className="service-video-content">
              <h3 className="service-video-title">FOR BIG BRANDS</h3>
              <p className="service-video-desc">We integrate <strong>Big Brands</strong> into cultural relevance at scale.</p>
              <a href="#" className="service-video-desc" onClick={e => e.stopPropagation()}>
                {/* Work With Viralish */}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}