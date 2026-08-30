import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

const SKY_VS = `#version 300 es
in vec2 a;void main(){gl_Position=vec4(a,0,1);}`

const SKY_FS = `#version 300 es
precision highp float;
uniform vec2 uR;uniform float uP,uT;out vec4 o;

vec3 palette(float t,vec2 uv){
  vec3 c0t=vec3(.56,.82,.96);vec3 c0b=vec3(.62,.78,.92);
  vec3 c1t=vec3(.95,.82,.55);vec3 c1b=vec3(.90,.70,.42);
  vec3 c2t=vec3(.92,.60,.28);vec3 c2b=vec3(.82,.48,.22);
  vec3 c3t=vec3(.50,.32,.48);vec3 c3b=vec3(.60,.38,.42);
  vec3 c4t=vec3(.12,.14,.24);vec3 c4b=vec3(.18,.18,.28);
  vec3 c5t=vec3(.04,.07,.14);vec3 c5b=vec3(.06,.08,.12);

  float k=t*5.0;
  float s0=clamp(k,0.0,1.0);
  float s1=clamp(k-1.0,0.0,1.0);
  float s2=clamp(k-2.0,0.0,1.0);
  float s3=clamp(k-3.0,0.0,1.0);
  float s4=clamp(k-4.0,0.0,1.0);

  vec3 top=c0t*(1.0-s0);
  vec3 bot=c0b*(1.0-s0);
  top+=s0*c1t;top-=s1*c1t;
  bot+=s0*c1b;bot-=s1*c1b;
  top+=s1*c2t;top-=s2*c2t;
  bot+=s1*c2b;bot-=s2*c2b;
  top+=s2*c3t;top-=s3*c3t;
  bot+=s2*c3b;bot-=s3*c3b;
  top+=s3*c4t;top-=s4*c4t;
  bot+=s3*c4b;bot-=s4*c4b;
  top+=s4*c5t;
  bot+=s4*c5b;

  return mix(bot,top,uv.y);
}

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}

void main(){
  vec2 uv=gl_FragCoord.xy/uR;
  float ar=uR.x/uR.y;
  vec2 auv=vec2(uv.x*ar,uv.y);
  vec3 col=palette(uP,uv);

  float t=clamp(uP/0.55,0.0,1.0);
  float st=t*t;
  float sx=mix(0.82,0.35,t);
  float sy=0.22+st*0.50;
  vec2 sun=vec2(sx*ar,sy);
  float sd=length(auv-sun);
  float disc=smoothstep(0.042,0.018,sd);
  float glow=smoothstep(0.14,0.0,sd);
  float sfade=1.0-smoothstep(0.35,0.55,uP);
  col+=vec3(1.0,.90,.50)*disc*sfade;
  col+=vec3(1.0,.78,.38)*glow*0.22*sfade;

  float hg=smoothstep(0.25,0.40,uP)*smoothstep(0.60,0.42,uP);
  float hy=1.0-abs(uv.y-0.12)/0.18;
  col+=vec3(0.95,0.55,0.20)*hg*max(hy,0.0)*0.15;

  float mf=smoothstep(0.55,0.65,uP);
  vec2 moon=vec2(0.18*ar,0.20);
  float md=length(auv-moon);
  float mfill=smoothstep(0.065,0.035,md);
  float mcut=smoothstep(0.072,0.045,length(auv-moon+vec2(0.025,-0.012)));
  float crescent=(mfill-mcut)*mf;
  float mglow=smoothstep(0.22,0.0,md)*0.10*mf;
  col+=vec3(.96,.93,.84)*crescent+vec3(.90,.88,.82)*mglow;

  float sf=smoothstep(0.65,0.85,uP);
  vec2 gid=floor(auv*18.0);
  float h=hash(gid);
  float star=step(0.935,h)*sf;
  if(star>0.01){
    float d=length(fract(auv*18.0)-0.5);
    float br=0.4+0.6*hash(gid+31.7);
    float tw=0.5+0.5*sin(uT*(1.0+h*3.0)+h*50.0);
    col+=vec3(.93,.94,.97)*smoothstep(0.22,0.0,d)*star*br*tw*0.7;
  }

  float g=hash(auv*800.0+floor(uT*8.0)*0.123)*0.025;
  col+=g-0.0125;

  o=vec4(clamp(col,0.0,1.0),1.0);
}`

export function SkyRig({ progress, time }) {
  const canvasRef = useRef(null)
  const glRef = useRef(null)
  const progRef = useRef(null)
  const uRRef = useRef(null)
  const uPRef = useRef(null)
  const uTRef = useRef(null)
  const bufRef = useRef(null)
  const rafRef = useRef(0)
  const runningRef = useRef(false)
  const lastTRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'high-performance' })
    if (!gl) return
    glRef.current = gl

    const vs = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vs, SKY_VS)
    gl.compileShader(vs)
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) { console.error('sky vs:', gl.getShaderInfoLog(vs)); return }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fs, SKY_FS)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) { console.error('sky fs:', gl.getShaderInfoLog(fs)); return }

    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { console.error('sky link:', gl.getProgramInfoLog(prog)); return }

    gl.useProgram(prog)
    progRef.current = prog
    uRRef.current = gl.getUniformLocation(prog, 'uR')
    uPRef.current = gl.getUniformLocation(prog, 'uP')
    uTRef.current = gl.getUniformLocation(prog, 'uT')

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(prog, 'a')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)
    bufRef.current = buf

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    const resize = () => {
      const w = window.innerWidth, h = window.innerHeight
      canvas.width = w * dpr | 0
      canvas.height = h * dpr | 0
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    const draw = () => {
      const gl = glRef.current
      const prog = progRef.current
      if (!gl || !prog) return
      gl.useProgram(prog)
      gl.uniform2f(uRRef.current, canvas.width, canvas.height)
      gl.uniform1f(uPRef.current, progress)
      gl.uniform1f(uTRef.current, time)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const loop = (ts) => {
      if (!runningRef.current) return
      const dt = Math.min((ts - lastTRef.current) / 1000, 0.05)
      lastTRef.current = ts
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }

    const start = () => {
      if (runningRef.current) return
      runningRef.current = true
      lastTRef.current = performance.now()
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }

    const stop = () => {
      runningRef.current = false
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 }
    }

    const visH = () => { document.hidden ? stop() : start() }

    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', visH)
    start()

    return () => {
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', visH)
      stop()
      if (bufRef.current) gl.deleteBuffer(bufRef.current)
      if (progRef.current) gl.deleteProgram(progRef.current)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [progress, time])

  return <canvas ref={canvasRef} className="sky-canvas" aria-hidden="true" />
}