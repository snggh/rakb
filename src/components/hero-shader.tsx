"use client";

import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform vec2 u_ptr;
uniform float u_time;
uniform float u_interactive;
uniform vec3 u_bg;
uniform vec3 u_ink;
uniform vec3 u_accent;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float aspect = u_res.x / max(u_res.y, 1.0);

  vec2 cols = vec2(16.0, 6.0);
  vec2 scaled = vec2(uv.x * aspect, uv.y);
  vec2 gv = scaled * vec2(cols.x / aspect, cols.y);
  vec2 id = floor(gv);
  vec2 f = fract(gv);

  vec2 k = abs(f - 0.5);
  float key = 1.0 - smoothstep(0.42, 0.455, max(k.x, k.y));
  float well = 1.0 - smoothstep(0.28, 0.32, max(k.x, k.y));

  vec2 cellUv = (id + 0.5) / vec2(cols.x, cols.y);
  cellUv.x /= aspect;
  float dist = length(cellUv - u_ptr);
  float hover = exp(-dist * 10.0) * u_interactive;

  float breath = 0.5 + 0.5 * sin(u_time * 0.7 + hash(id) * 6.28);
  float accentKey = step(0.92, hash(id + 3.1));

  vec3 col = u_bg;
  col = mix(col, mix(u_bg, u_ink, 0.12), key);
  col = mix(col, mix(u_bg, u_ink, 0.2), well * 0.45);
  col = mix(col, u_accent, key * (hover * 0.55 + accentKey * 0.08 * breath));

  float stem = step(0.42, f.x) * step(f.x, 0.58) * step(0.38, f.y) * step(f.y, 0.62);
  float bar = step(0.32, f.x) * step(f.x, 0.68) * step(0.46, f.y) * step(f.y, 0.54);
  float glyph = max(stem, bar) * step(0.45, hash(id + 9.0));
  col = mix(col, mix(u_ink, u_accent, hover), glyph * key * 0.35);

  float grain = (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.03;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  return [r, g, b];
}

type HeroShaderProps = {
  className?: string;
  interactive?: boolean;
};

export function HeroShader({ className, interactive = true }: HeroShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn(gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_res");
    const uPtr = gl.getUniformLocation(program, "u_ptr");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uInteractive = gl.getUniformLocation(program, "u_interactive");
    const uBg = gl.getUniformLocation(program, "u_bg");
    const uInk = gl.getUniformLocation(program, "u_ink");
    const uAccent = gl.getUniformLocation(program, "u_accent");

    // Palette comes from the active theme/colorway, and is re-read when it
    // changes so the hero does not stay on the old board colour.
    const styles = getComputedStyle(document.documentElement);
    const readToken = (name: string, fallback: string) =>
      hexToRgb((styles.getPropertyValue(name) || fallback).trim());

    let bg = readToken("--shader-bg", "#000000");
    let ink = readToken("--shader-ink", "#ededed");
    let accent = readToken("--shader-accent", "#ffffff");

    const syncPalette = () => {
      const next = getComputedStyle(document.documentElement);
      const read = (name: string, fallback: string) =>
        hexToRgb((next.getPropertyValue(name) || fallback).trim());
      bg = read("--shader-bg", "#000000");
      ink = read("--shader-ink", "#ededed");
      accent = read("--shader-accent", "#ffffff");
    };

    const themeObserver = new MutationObserver(syncPalette);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-colorway"],
    });

    const ptr = { x: 0.72, y: 0.45 };
    const target = { x: 0.72, y: 0.45 };
    let raf = 0;
    const start = performance.now();
    let visible = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      target.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      target.y = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
    };

    const draw = (now: number) => {
      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      resize();
      ptr.x += (target.x - ptr.x) * 0.08;
      ptr.y += (target.y - ptr.y) * 0.08;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uPtr, ptr.x, ptr.y);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uInteractive, interactive ? 1 : 0);
      gl.uniform3f(uBg, ...bg);
      gl.uniform3f(uInk, ...ink);
      gl.uniform3f(uAccent, ...accent);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(draw);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.05 },
    );
    io.observe(canvas);

    const parent = canvas.parentElement ?? canvas;
    parent.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      themeObserver.disconnect();
      parent.removeEventListener("pointermove", onMove);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [interactive]);

  return (
    <div className={`hero-shader ${className ?? ""}`}>
      <canvas ref={canvasRef} className="hero-shader-canvas absolute inset-0 h-full w-full" aria-hidden />
      <div className="image-slot-ph shader-fallback">
        <span>Hero</span>
      </div>
    </div>
  );
}
