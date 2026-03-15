

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ─── Google Fonts ─── */
const FontLink = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');`}</style>
);

/* ─── GLOBAL STYLES ─── */
const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --hot-pink: #FF2D78;
    --electric-violet: #7B2FFF;
    --acid-lime: #C8FF00;
    --deep-teal: #00F5C4;
    --warm-black: #0A0008;
    --cream: #FFF5E6;
    --font-display: 'Playfair Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--warm-black); color: var(--cream); font-family: var(--font-body); overflow-x: hidden; }
  ::selection { background: var(--hot-pink); color: #fff; }
 
  /* CUSTOM CURSOR — desktop only */
  @media (pointer: fine) {
    body { cursor: none; }
    .cursor {
      position: fixed; width: 12px; height: 12px; border-radius: 50%;
      background: var(--hot-pink); pointer-events: none; z-index: 9999;
      transform: translate(-50%, -50%); transition: transform 0.1s, background 0.2s;
      mix-blend-mode: difference;
    }
    .cursor-ring {
      position: fixed; width: 36px; height: 36px; border-radius: 50%;
      border: 1px solid var(--acid-lime); pointer-events: none; z-index: 9998;
      transform: translate(-50%, -50%); transition: all 0.18s ease;
      mix-blend-mode: difference;
    }
    button, a { cursor: none; }
  }
  @media (pointer: coarse) {
    .cursor, .cursor-ring { display: none; }
  }
 
  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--warm-black); }
  ::-webkit-scrollbar-thumb { background: var(--hot-pink); border-radius: 2px; }
 
  /* NOISE OVERLAY */
  .noise {
    position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.035;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  }
 
  /* ANIMATIONS */
  @keyframes glitch1 {
    0%,100% { clip-path: inset(0 0 95% 0); transform: translateX(0); }
    20% { clip-path: inset(30% 0 50% 0); transform: translateX(-6px); }
    40% { clip-path: inset(60% 0 20% 0); transform: translateX(6px); }
    60% { clip-path: inset(10% 0 80% 0); transform: translateX(-3px); }
    80% { clip-path: inset(80% 0 5% 0); transform: translateX(3px); }
  }
  @keyframes glitch2 {
    0%,100% { clip-path: inset(50% 0 30% 0); transform: translateX(0); }
    25% { clip-path: inset(10% 0 70% 0); transform: translateX(8px); }
    50% { clip-path: inset(70% 0 10% 0); transform: translateX(-8px); }
    75% { clip-path: inset(40% 0 45% 0); transform: translateX(4px); }
  }
  @keyframes gradShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-18px); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes lineSlide {
    from { width: 0; }
    to { width: 100%; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.97); }
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }
 
  /* SECTION BASE */
  .section { position: relative; z-index: 1; padding: 100px 6vw; }
 
  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 6vw;
    background: linear-gradient(to bottom, rgba(10,0,8,0.95), transparent);
    backdrop-filter: blur(8px);
  }
  .nav-logo {
    font-family: var(--font-display); font-size: 1.5rem; font-weight: 900;
    background: linear-gradient(90deg, var(--hot-pink), var(--electric-violet), var(--acid-lime));
    background-size: 200%;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: gradShift 4s linear infinite;
    letter-spacing: 0.05em;
  }
  .nav-links { display: flex; gap: 2rem; list-style: none; }
  .nav-links a {
    color: var(--cream); text-decoration: none; font-size: 0.85rem;
    font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
    position: relative; padding-bottom: 3px; transition: color 0.3s;
  }
  .nav-links a::after {
    content: ''; position: absolute; bottom: 0; left: 0;
    width: 0; height: 1px; background: var(--hot-pink);
    transition: width 0.3s ease;
  }
  .nav-links a:hover { color: var(--hot-pink); }
  .nav-links a:hover::after { width: 100%; }
  .nav-cta {
    background: var(--hot-pink); color: #fff; border: none; padding: 10px 22px;
    font-family: var(--font-body); font-size: 0.82rem; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
    transition: background 0.3s, transform 0.2s;
  }
  .nav-cta:hover { background: var(--electric-violet); transform: scale(1.04); }
 
  /* HAMBURGER BUTTON */
  .hamburger {
    display: none; flex-direction: column; gap: 5px;
    background: none; border: none; padding: 4px; z-index: 101;
  }
  .hamburger span {
    display: block; width: 24px; height: 2px; background: var(--cream);
    transition: transform 0.3s, opacity 0.3s;
    transform-origin: center;
  }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
 
  /* MOBILE MENU DRAWER */
  .mobile-menu {
    display: none;
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(10,0,8,0.97); backdrop-filter: blur(16px);
    z-index: 99; flex-direction: column; align-items: center; justify-content: center;
    gap: 2.5rem;
    animation: slideDown 0.3s ease both;
  }
  .mobile-menu.open { display: flex; }
  .mobile-menu a {
    font-family: var(--font-display); font-size: 2.2rem; font-weight: 700;
    color: var(--cream); text-decoration: none; letter-spacing: 0.05em;
    transition: color 0.3s;
  }
  .mobile-menu a:hover { color: var(--hot-pink); }
  .mobile-menu .mobile-cta {
    margin-top: 1rem; background: var(--hot-pink); color: #fff; border: none;
    padding: 14px 40px; font-family: var(--font-body); font-size: 1rem;
    font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;
    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
  }
 
  /* HERO */
  .hero {
    min-height: 100vh; display: flex; align-items: center;
    position: relative; overflow: hidden; padding-top: 80px;
  }
  .hero-canvas { position: absolute; inset: 0; z-index: 0; }
  .hero-content { position: relative; z-index: 2; max-width: 700px; }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 0.75rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--acid-lime); margin-bottom: 1.5rem;
    animation: fadeUp 0.8s ease both;
  }
  .hero-tag::before {
    content: ''; display: inline-block; width: 32px; height: 1px; background: var(--acid-lime);
  }
  .glitch-wrap { position: relative; display: inline-block; }
  .glitch-text {
    font-family: var(--font-display); font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 900; line-height: 0.95; color: var(--cream);
    animation: fadeUp 0.9s ease 0.1s both;
  }
  .glitch-text span { color: var(--hot-pink); font-style: italic; }
  .glitch-clone {
    position: absolute; inset: 0;
    font-family: var(--font-display); font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 900; line-height: 0.95; color: var(--electric-violet);
    pointer-events: none;
    animation: glitch1 6s infinite, fadeUp 0.9s ease 0.1s both;
  }
  .glitch-clone2 {
    position: absolute; inset: 0;
    font-family: var(--font-display); font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 900; line-height: 0.95; color: var(--acid-lime);
    pointer-events: none;
    animation: glitch2 5s infinite, fadeUp 0.9s ease 0.1s both;
  }
  .hero-sub {
    margin-top: 1.8rem; font-size: 1.05rem; font-weight: 300; line-height: 1.7;
    color: rgba(255,245,230,0.65); max-width: 480px;
    animation: fadeUp 1s ease 0.25s both;
  }
  .hero-btns {
    margin-top: 2.5rem; display: flex; gap: 1rem; flex-wrap: wrap;
    animation: fadeUp 1s ease 0.4s both;
  }
  .btn-primary {
    padding: 14px 36px; background: linear-gradient(135deg, var(--hot-pink), var(--electric-violet));
    color: #fff; border: none; font-family: var(--font-body); font-size: 0.9rem;
    font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
    transition: transform 0.2s, box-shadow 0.3s;
    box-shadow: 0 0 30px rgba(255,45,120,0.4);
  }
  .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 0 50px rgba(255,45,120,0.7); }
  .btn-outline {
    padding: 14px 36px; background: transparent;
    color: var(--cream); border: 1px solid rgba(255,245,230,0.3);
    font-family: var(--font-body); font-size: 0.9rem;
    font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase;
    transition: border-color 0.3s, color 0.3s;
  }
  .btn-outline:hover { border-color: var(--acid-lime); color: var(--acid-lime); }
  .scroll-hint {
    position: absolute; bottom: 2rem; left: 6vw; z-index: 2;
    display: flex; align-items: center; gap: 10px;
    font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase;
    color: rgba(255,245,230,0.4);
    animation: fadeUp 1s ease 0.7s both;
  }
  .scroll-line {
    width: 40px; height: 1px; background: rgba(255,245,230,0.3);
    animation: lineSlide 2s ease 1s both;
  }
 
  /* STATS BAR */
  .stats-bar {
    border-top: 1px solid rgba(255,245,230,0.07);
    border-bottom: 1px solid rgba(255,245,230,0.07);
    padding: 40px 6vw; display: flex; justify-content: space-around;
    flex-wrap: wrap; gap: 2rem; position: relative; z-index: 1;
    background: rgba(255,45,120,0.03);
  }
  .stat-item { text-align: center; }
  .stat-num {
    font-family: var(--font-display); font-size: 3rem; font-weight: 900;
    background: linear-gradient(135deg, var(--hot-pink), var(--acid-lime));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    line-height: 1;
  }
  .stat-label { font-size: 0.78rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,245,230,0.45); margin-top: 6px; }
 
  /* SERVICES */
  .services-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 1.5px; margin-top: 4rem;
    border: 1.5px solid rgba(255,245,230,0.07);
  }
  .service-card {
    padding: 2.5rem 2rem; position: relative; overflow: hidden;
    background: rgba(255,245,230,0.02); transition: background 0.4s;
  }
  .service-card::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,45,120,0.07), rgba(123,47,255,0.07));
    opacity: 0; transition: opacity 0.4s;
  }
  .service-card:hover::before { opacity: 1; }
  .service-card:hover { background: rgba(255,45,120,0.04); }
  .service-num {
    font-family: var(--font-display); font-size: 4rem; font-weight: 900;
    color: rgba(255,245,230,0.06); line-height: 1; margin-bottom: 1rem;
    transition: color 0.4s;
  }
  .service-card:hover .service-num { color: var(--hot-pink); opacity: 0.2; }
  .service-icon { font-size: 2rem; margin-bottom: 1rem; animation: floatY 3s ease-in-out infinite; }
  .service-name {
    font-family: var(--font-display); font-size: 1.4rem; font-weight: 700;
    color: var(--cream); margin-bottom: 0.8rem;
  }
  .service-desc { font-size: 0.88rem; font-weight: 300; line-height: 1.7; color: rgba(255,245,230,0.5); }
  .service-arrow {
    margin-top: 1.5rem; font-size: 1.2rem; color: var(--hot-pink);
    transform: translateX(0); transition: transform 0.3s;
  }
  .service-card:hover .service-arrow { transform: translateX(8px); }
 
  /* SECTION HEADINGS */
  .section-tag {
    font-size: 0.72rem; letter-spacing: 0.25em; text-transform: uppercase;
    color: var(--hot-pink); margin-bottom: 0.8rem;
    display: flex; align-items: center; gap: 10px;
  }
  .section-tag::before { content: ''; display: inline-block; width: 24px; height: 1px; background: var(--hot-pink); }
  .section-heading {
    font-family: var(--font-display); font-size: clamp(2.2rem, 5vw, 4rem); font-weight: 900;
    color: var(--cream); line-height: 1.05;
  }
  .section-heading em { font-style: italic; color: var(--hot-pink); }
 
  /* VIDEO SECTION */
  .video-section { background: rgba(123,47,255,0.04); }
  .video-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 3.5rem; }
  .video-card {
    position: relative; overflow: hidden;
    aspect-ratio: 16/9; background: rgba(255,245,230,0.04);
    border: 1px solid rgba(255,245,230,0.08);
    transition: transform 0.4s, box-shadow 0.4s;
  }
  .video-card:first-child { grid-row: span 2; aspect-ratio: auto; min-height: 500px; }
  .video-card:hover { transform: scale(1.02); box-shadow: 0 0 40px rgba(255,45,120,0.25); }
  .video-card video { width: 100%; height: 100%; object-fit: cover; }
  .video-placeholder {
    width: 100%; height: 100%; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 1rem;
    background: linear-gradient(135deg, rgba(255,45,120,0.12), rgba(123,47,255,0.12), rgba(200,255,0,0.05));
    animation: gradShift 6s linear infinite; background-size: 200%;
  }
  .video-placeholder-icon { font-size: 3rem; animation: pulse 2s ease infinite; }
  .video-placeholder-text {
    font-family: var(--font-display); font-size: 1rem; font-style: italic;
    color: rgba(255,245,230,0.5); text-align: center; padding: 0 1rem;
  }
  .video-label {
    position: absolute; bottom: 0; left: 0; right: 0; padding: 1.5rem;
    background: linear-gradient(to top, rgba(10,0,8,0.9), transparent);
    font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--cream);
  }
  .video-label span { color: var(--acid-lime); }
  .play-btn {
    position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
    width: 60px; height: 60px; border-radius: 50%;
    background: rgba(255,45,120,0.85); display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; transition: transform 0.3s, background 0.3s;
    box-shadow: 0 0 30px rgba(255,45,120,0.5);
  }
  .video-card:hover .play-btn { transform: translate(-50%, -50%) scale(1.15); background: var(--hot-pink); }
 
  /* ABOUT */
  .about-split { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; margin-top: 3rem; }
  .about-visual {
    position: relative; height: 520px;
    background: linear-gradient(135deg, rgba(255,45,120,0.1), rgba(123,47,255,0.15));
    border: 1px solid rgba(255,245,230,0.07);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .about-3d-canvas { width: 100%; height: 100%; }
  .about-text-block { display: flex; flex-direction: column; gap: 1.5rem; }
  .about-para { font-size: 0.95rem; font-weight: 300; line-height: 1.9; color: rgba(255,245,230,0.65); }
  .about-highlights { display: flex; flex-direction: column; gap: 0.8rem; margin-top: 1rem; }
  .highlight-row {
    display: flex; align-items: center; gap: 1rem;
    padding: 0.8rem 0; border-bottom: 1px solid rgba(255,245,230,0.07);
    font-size: 0.88rem; color: rgba(255,245,230,0.7);
  }
  .highlight-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--acid-lime); flex-shrink: 0; }
 
  /* BOOKING */
  .booking-section {
    background: linear-gradient(135deg, rgba(255,45,120,0.08), rgba(123,47,255,0.08));
    border-top: 1px solid rgba(255,245,230,0.07);
    border-bottom: 1px solid rgba(255,245,230,0.07);
    text-align: center;
  }
  .booking-sub { font-size: 1rem; font-weight: 300; color: rgba(255,245,230,0.5); margin-top: 1rem; margin-bottom: 2.5rem; }
 
  /* FIXED BOOKING FORM — stacked layout so errors don't break flex */
  .booking-form {
    display: flex; flex-direction: column; gap: 0.6rem;
    max-width: 480px; margin: 0 auto; align-items: stretch;
  }
  .form-field { display: flex; flex-direction: column; gap: 0.35rem; }
  .book-input {
    width: 100%; padding: 14px 18px;
    background: rgba(255,245,230,0.05); border: 1px solid rgba(255,245,230,0.15);
    color: var(--cream); font-family: var(--font-body); font-size: 0.9rem;
    outline: none; transition: border-color 0.3s;
  }
  .book-input::placeholder { color: rgba(255,245,230,0.3); }
  .book-input:focus { border-color: var(--hot-pink); }
  .book-input.error { border-color: var(--hot-pink); }
  .field-error {
    font-size: 0.76rem; color: var(--hot-pink);
    text-align: left; padding-left: 2px;
    animation: fadeUp 0.2s ease both;
  }
  .booking-form .btn-primary { margin-top: 0.6rem; width: 100%; }
 
  /* FOOTER */
  footer {
    padding: 60px 6vw 30px; position: relative; z-index: 1;
    border-top: 1px solid rgba(255,245,230,0.07);
  }
  .footer-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 3rem; flex-wrap: wrap; margin-bottom: 3rem; }
  .footer-brand { max-width: 320px; }
  .footer-logo {
    font-family: var(--font-display); font-size: 2rem; font-weight: 900;
    background: linear-gradient(90deg, var(--hot-pink), var(--electric-violet));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .footer-tagline { font-size: 0.85rem; color: rgba(255,245,230,0.4); margin-top: 0.7rem; line-height: 1.6; }
  .footer-links h4 { font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--acid-lime); margin-bottom: 1.2rem; }
  .footer-links ul { list-style: none; display: flex; flex-direction: column; gap: 0.7rem; }
  .footer-links a { color: rgba(255,245,230,0.5); text-decoration: none; font-size: 0.9rem; transition: color 0.3s; }
  .footer-links a:hover { color: var(--cream); }
  .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; padding-top: 2rem; border-top: 1px solid rgba(255,245,230,0.06); }
  .footer-copy { font-size: 0.78rem; color: rgba(255,245,230,0.25); }
  .footer-socials { display: flex; gap: 1rem; }
  .social-dot {
    width: 36px; height: 36px; border: 1px solid rgba(255,245,230,0.15);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; color: rgba(255,245,230,0.5);
    transition: border-color 0.3s, color 0.3s, transform 0.3s;
  }
  .social-dot:hover { border-color: var(--hot-pink); color: var(--hot-pink); transform: translateY(-3px); }
 
  /* GRADIENT LINE */
  .grad-line { height: 1px; background: linear-gradient(90deg, transparent, var(--hot-pink), var(--electric-violet), var(--acid-lime), transparent); opacity: 0.4; }
 
  /* ══════════════════════════════
     RESPONSIVE BREAKPOINTS
  ══════════════════════════════ */
 
  /* Tablet */
  @media (max-width: 900px) {
    .about-split { gap: 3rem; }
  }
 
  /* Mobile */
  @media (max-width: 768px) {
    /* Nav */
    .nav-links, .nav-cta { display: none; }
    .hamburger { display: flex; }
 
    /* Hero */
    .hero-content { padding-right: 1rem; }
    .hero-btns { flex-direction: column; }
    .btn-primary, .btn-outline { text-align: center; }
 
    /* Stats — 2x2 grid on mobile */
    .stats-bar { justify-content: center; gap: 1.5rem; }
    .stat-item { min-width: 120px; }
 
    /* Section padding */
    .section { padding: 70px 5vw; }
 
    /* Videos */
    .video-grid { grid-template-columns: 1fr; }
    .video-card:first-child { grid-row: auto; min-height: 260px; }
 
    /* About */
    .about-split { grid-template-columns: 1fr; gap: 2.5rem; }
    .about-visual { height: 280px; }
 
    /* Footer */
    .footer-top { flex-direction: column; gap: 2rem; }
    .footer-links { min-width: 140px; }
  }
 
  /* Small mobile */
  @media (max-width: 420px) {
    .stat-num { font-size: 2.2rem; }
    .hero-btns { gap: 0.8rem; }
    nav { padding: 16px 5vw; }
  }
`;

/* ─── THREE.JS HERO CANVAS ─── */
function HeroCanvas() {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth,
      H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 5;

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const dirLight = new THREE.DirectionalLight(0xff2d78, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0x7b2fff, 1.2);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);
    const pointLight = new THREE.PointLight(0xc8ff00, 1.5, 15);
    pointLight.position.set(0, 0, 4);
    scene.add(pointLight);

    const orb = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.3, 4),
      new THREE.MeshStandardMaterial({
        color: 0xff2d78,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x3a0020,
        emissiveIntensity: 0.3,
      }),
    );
    orb.position.set(2.5, 0, 0);
    scene.add(orb);

    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5, 1),
      new THREE.MeshBasicMaterial({
        color: 0x7b2fff,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      }),
    );
    shell.position.set(2.5, 0, 0);
    scene.add(shell);

    const orbGroup = new THREE.Group();
    const colors = [0xff2d78, 0x7b2fff, 0xc8ff00, 0x00f5c4];
    for (let i = 0; i < 12; i++) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.08 + Math.random() * 0.14, 16, 16),
        new THREE.MeshStandardMaterial({
          color: colors[i % 4],
          metalness: 0.9,
          roughness: 0.1,
          emissive: colors[i % 4],
          emissiveIntensity: 0.4,
        }),
      );
      const angle = (i / 12) * Math.PI * 2;
      const radius = 1.8 + Math.random() * 1.5;
      mesh.position.set(
        2.5 + Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.6,
        (Math.random() - 0.5) * 2,
      );
      mesh.userData = {
        angle,
        speed: 0.003 + Math.random() * 0.005,
        radius,
        phase: Math.random() * Math.PI * 2,
      };
      orbGroup.add(mesh);
    }
    scene.add(orbGroup);

    const partCount = 400;
    const positions = new Float32Array(partCount * 3);
    const partColors = new Float32Array(partCount * 3);
    const pColors = [
      [1, 0.18, 0.47],
      [0.48, 0.18, 1],
      [0.78, 1, 0],
      [0, 0.96, 0.77],
    ];
    for (let i = 0; i < partCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      const c = pColors[Math.floor(Math.random() * pColors.length)];
      partColors[i * 3] = c[0];
      partColors[i * 3 + 1] = c[1];
      partColors[i * 3 + 2] = c[2];
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    partGeo.setAttribute("color", new THREE.BufferAttribute(partColors, 3));
    const particles = new THREE.Points(
      partGeo,
      new THREE.PointsMaterial({
        size: 0.04,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
      }),
    );
    scene.add(particles);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.02, 8, 80),
      new THREE.MeshBasicMaterial({
        color: 0xc8ff00,
        transparent: true,
        opacity: 0.25,
      }),
    );
    ring.position.set(2.5, 0, 0);
    ring.rotation.x = Math.PI / 4;
    scene.add(ring);

    let mouse = { x: 0, y: 0 };
    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouse);

    let t = 0;
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.012;
      orb.rotation.x += 0.004;
      orb.rotation.y += 0.007;
      shell.rotation.x -= 0.003;
      shell.rotation.y += 0.005;
      ring.rotation.z += 0.006;
      orb.position.y = Math.sin(t * 0.7) * 0.25;
      shell.position.y = Math.sin(t * 0.7) * 0.25;
      ring.position.y = Math.sin(t * 0.7) * 0.25;
      camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      orbGroup.children.forEach((m) => {
        m.userData.angle += m.userData.speed;
        m.position.x = 2.5 + Math.cos(m.userData.angle) * m.userData.radius;
        m.position.y =
          Math.sin(m.userData.angle + m.userData.phase) *
          m.userData.radius *
          0.5;
      });
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0003;
      pointLight.position.x = Math.sin(t) * 3;
      pointLight.position.y = Math.cos(t * 0.7) * 2;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} className="hero-canvas" />;
}

/* ─── ABOUT 3D CANVAS ─── */
function About3D() {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth,
      H = el.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(W, H);
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 3.5;

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const l1 = new THREE.PointLight(0xff2d78, 2, 10);
    l1.position.set(2, 2, 2);
    scene.add(l1);
    const l2 = new THREE.PointLight(0x7b2fff, 1.5, 10);
    l2.position.set(-2, -2, 2);
    scene.add(l2);

    const group = new THREE.Group();
    const bladeGeo = new THREE.CylinderGeometry(0.04, 0.01, 1.6, 8);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xc8ff00,
      metalness: 1,
      roughness: 0.1,
      emissive: 0x506600,
      emissiveIntensity: 0.3,
    });
    const blade1 = new THREE.Mesh(bladeGeo, bladeMat);
    blade1.rotation.z = 0.4;
    blade1.position.set(-0.2, 0.3, 0);
    const blade2 = new THREE.Mesh(bladeGeo, bladeMat.clone());
    blade2.rotation.z = -0.4;
    blade2.position.set(0.2, 0.3, 0);
    const pivot = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xff2d78,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x3a0010,
        emissiveIntensity: 0.5,
      }),
    );
    group.add(blade1, blade2, pivot);
    group.position.set(0, 0.2, 0);
    scene.add(group);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.1, 0.025, 8, 60),
      new THREE.MeshBasicMaterial({
        color: 0x7b2fff,
        transparent: true,
        opacity: 0.35,
      }),
    );
    scene.add(torus);

    const pPos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 5;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pts = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        size: 0.035,
        color: 0x00f5c4,
        transparent: true,
        opacity: 0.6,
      }),
    );
    scene.add(pts);

    let t = 0;
    let rafId2;
    const animate = () => {
      rafId2 = requestAnimationFrame(animate);
      t += 0.015;
      group.rotation.y += 0.01;
      group.rotation.x = Math.sin(t * 0.5) * 0.2;
      torus.rotation.x += 0.005;
      torus.rotation.y += 0.008;
      pts.rotation.y += 0.002;
      l1.position.x = Math.sin(t) * 2;
      l2.position.y = Math.cos(t) * 2;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId2);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} className="about-3d-canvas" />;
}

/* ─── CUSTOM CURSOR ─── */
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
      if (ringRef.current) {
        ringRef.current.style.left = e.clientX + "px";
        ringRef.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <>
      <div className="cursor" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}

/* ─── VIDEO CARD ─── */
function VideoCard({ label, accent, src }) {
  return (
    <div className="video-card">
      {src ? (
        <video autoPlay muted loop playsInline src={src} />
      ) : (
        <div className="video-placeholder">
          <div className="video-placeholder-icon">✂️</div>
          <div className="video-placeholder-text">
            Add your video here
            <br />
            <small style={{ fontSize: "0.75rem", opacity: 0.5 }}>
              ({label})
            </small>
          </div>
        </div>
      )}
      <div className="play-btn">▶</div>
      <div className="video-label">
        {label} <span>{accent}</span>
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function SaloonLanding() {
  const [booked, setBooked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
  });
  const [errors, setErrors] = useState({ name: "", phone: "", service: "" });

  // Close menu on nav link click
  const handleNavClick = () => setMenuOpen(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name required";
    if (!formData.phone.trim() || !/^[0-9]{11}$/.test(formData.phone))
      newErrors.phone = "Valid 11-digit phone number required";
    if (!formData.service.trim()) newErrors.service = "Please enter a service";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const res = await fetch("https://formspree.io/f/xgonllva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      setBooked(true);
    } else {
      alert("Submission failed. Please try again.");
    }
  };

  const services = [
    {
      icon: "✂️",
      name: "Precision Cuts",
      desc: "Master-level cuts tailored to your bone structure, lifestyle, and vision. Every strand placed with intent.",
    },
    {
      icon: "🎨",
      name: "Color Artistry",
      desc: "Balayage, ombré, vivid tones — transformations that turn heads and last the season.",
    },
    {
      icon: "💫",
      name: "Bridal & Events",
      desc: "Your most important moments deserve elite styling. From mehendi to reception, we've got you.",
    },
    {
      icon: "🌿",
      name: "Hair Treatments",
      desc: "Keratin, deep repair, scalp therapy — science-backed rituals for hair that actually heals.",
    },
    {
      icon: "💅",
      name: "Nail Studio",
      desc: "Gel, acrylic, nail art — extension designs as bold or as minimal as you want.",
    },
    {
      icon: "👁️",
      name: "Skin & Brow",
      desc: "Threading, tinting, facials. Your canvas, perfected.",
    },
  ];

  
  const videos = [
    { label: "Color Magic", accent: "Reveal", src: "/video/WhatsApp.mp4" },
    { label: "The Transformation", accent: "Process", src: "/video/b.mp4" },
    {
      label: "Bridal Masterclass",
      accent: "Behind the Scenes",
      src: "/video/c.mp4",
    },
  ];

  const navLinks = ["Services", "Gallery", "About", "Book"];

  return (
    <>
      <FontLink />
      <style>{globalCSS}</style>
      <div className="noise" />
      <Cursor />

      {/* MOBILE MENU DRAWER */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={handleNavClick}>
            {l}
          </a>
        ))}
        <button className="mobile-cta" onClick={handleNavClick}>
          Book Now
        </button>
      </div>

      {/* NAV */}
      <nav>
        <div className="nav-logo">LUMIÈRE</div>
        <ul className="nav-links">
          {navLinks.map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`}>{l}</a>
            </li>
          ))}
        </ul>
        <button className="nav-cta">Book Now</button>
        {/* HAMBURGER — mobile only */}
        <button
          className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <HeroCanvas />
        <div
          className="hero-content section"
          style={{ paddingTop: "80px", paddingBottom: "80px" }}
        >
          <div className="hero-tag">Premium Saloon · Lahore</div>
          <div className="glitch-wrap">
            <h1 className="glitch-text">
              Where Hair
              <br />
              Becomes <span>Art.</span>
            </h1>
            <div className="glitch-clone" aria-hidden>
              Where Hair
              <br />
              Becomes Art.
            </div>
            <div className="glitch-clone2" aria-hidden>
              Where Hair
              <br />
              Becomes Art.
            </div>
          </div>
          <p className="hero-sub">
            Lumière is not your average saloon. We are a creative studio where
            every appointment is a collaboration, and every result is a
            masterpiece.
          </p>
          <div className="hero-btns">
            <button className="btn-primary">Book Appointment</button>
            <button className="btn-outline">View Gallery →</button>
          </div>
        </div>
        <div className="scroll-hint">
          <span className="scroll-line" />
          Scroll to explore
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {[
          ["1200+", "Happy Clients"],
          ["8", "Expert Stylists"],
          ["4.9★", "Rating"],
          ["6", "Years of Art"],
        ].map(([n, l]) => (
          <div className="stat-item" key={l}>
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>
      <div className="grad-line" />

      {/* SERVICES */}
      <section className="section" id="services">
        <div className="section-tag">What We Do</div>
        <h2 className="section-heading">
          Our <em>Services</em>
        </h2>
        <div className="services-grid">
          {services.map((s, i) => (
            <div className="service-card" key={s.name}>
              <div className="service-num">0{i + 1}</div>
              <div className="service-icon">{s.icon}</div>
              <div className="service-name">{s.name}</div>
              <div className="service-desc">{s.desc}</div>
              <div className="service-arrow">→</div>
            </div>
          ))}
        </div>
      </section>
      <div className="grad-line" />

      {/* VIDEO GALLERY */}
      <section className="section video-section" id="gallery">
        <h2 className="section-heading">
          Watch the <em>Magic</em>
        </h2>
        <div className="video-grid">
          {videos.map((v) => (
            <VideoCard key={v.label} {...v} />
          ))}
        </div>
      </section>
      <div className="grad-line" />

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="about-split">
          <div className="about-visual">
            <About3D />
          </div>
          <div className="about-text-block">
            <div>
              <div className="section-tag">Our Story</div>
              <h2 className="section-heading">
                Crafted by
                <br />
                <em>Passion.</em>
              </h2>
            </div>
            <p className="about-para">
              Lumière was born from a simple belief — that a great saloon visit
              should feel like a ritual, not a chore. We built a space where
              cutting-edge technique meets genuine care, and where every client
              leaves feeling like the best version of themselves.
            </p>
            <div className="about-highlights">
              {[
                "Certified master stylists with 5+ years experience",
                "Cruelty-free, salon-grade product lines only",
                "Customized consultations for every appointment",
                "Hygienic, premium salon environment guaranteed",
              ].map((h) => (
                <div className="highlight-row" key={h}>
                  <div className="highlight-dot" />
                  {h}
                </div>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <button className="btn-primary">Meet the Team →</button>
            </div>
          </div>
        </div>
      </section>
      <div className="grad-line" />

      {/* BOOKING */}
      <section className="section booking-section" id="book">
        <div className="section-tag">Reserve Your Slot</div>
        <h2 className="section-heading">
          Book Your <em>Transformation</em>
        </h2>
        <p className="booking-sub">
          Same-day slots available. WhatsApp confirmations sent instantly.
        </p>
        {!booked ? (
          <div className="booking-form">
            {/* Each field wrapped in .form-field so error stays below its input */}
            <div className="form-field">
              <input
                className={`book-input${errors.name ? " error" : ""}`}
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && (
                <span className="field-error">{errors.name}</span>
              )}
            </div>
            <div className="form-field">
              <input
                className={`book-input${errors.phone ? " error" : ""}`}
                type="tel"
                placeholder="Phone Number (11 digits)"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  setErrors({ ...errors, phone: "" });
                }}
              />
              {errors.phone && (
                <span className="field-error">{errors.phone}</span>
              )}
            </div>
            <div className="form-field">
              <input
                className={`book-input${errors.service ? " error" : ""}`}
                type="text"
                placeholder="Service (e.g. Hair Cut, Bridal)"
                value={formData.service}
                onChange={(e) => {
                  setFormData({ ...formData, service: e.target.value });
                  setErrors({ ...errors, service: "" });
                }}
              />
              {errors.service && (
                <span className="field-error">{errors.service}</span>
              )}
            </div>
            <button className="btn-primary" onClick={handleSubmit}>
              Confirm Booking ✓
            </button>
          </div>
        ) : (
          <div
            style={{ textAlign: "center", animation: "fadeUp 0.6s ease both" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                color: "var(--acid-lime)",
              }}
            >
              You're booked! We'll WhatsApp you shortly.
            </p>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">LUMIÈRE</div>
            <p className="footer-tagline">
              Premium beauty studio redefining the saloon experience — one
              transformation at a time.
            </p>
          </div>
          <div className="footer-links">
            <h4>Services</h4>
            <ul>
              {[
                "Haircut & Style",
                "Color & Balayage",
                "Bridal Package",
                "Treatments",
                "Nails",
                "Skin & Brow",
              ].map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-links">
            <h4>Studio</h4>
            <ul>
              {[
                "About Us",
                "Our Team",
                "Testimonials",
                "Gallery",
                "Book Now",
              ].map((l) => (
                <li key={l}>
                  <a href="#">{l}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-links">
            <h4>Contact</h4>
            <ul>
              <li>
                <a href="#">📍 F10, Islamabad</a>
              </li>
              <li>
                <a href="#">📞 0300-1234567</a>
              </li>
              <li>
                <a href="#">✉️ hello@lumiere.pk</a>
              </li>
              <li>
                <a href="#">⏰ Mon–Sat: 10am–8pm</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">
            © 2026 Lumière Studio. All rights reserved.
          </div>
          <div className="footer-socials">
            {["ig", "fb", "yt", "wa"].map((s) => (
              <div className="social-dot" key={s}>
                {s === "ig"
                  ? "📸"
                  : s === "fb"
                    ? "👤"
                    : s === "yt"
                      ? "▶"
                      : "💬"}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}