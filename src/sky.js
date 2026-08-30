export function initSky(canvas) {
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false, powerPreference: 'high-performance' })
  if (!gl) return null

  const vs = `#version 300 es
in vec2 a;void main(){gl_Position=vec4(a,0,1);}`

  const fs = `#version 300 es
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

  function cs(type, src) {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('shader:', gl.getShaderInfoLog(s)); gl.deleteShader(s); return null
    }
    return s
  }

  const prog = gl.createProgram()
  gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs))
  gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs))
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error('link:', gl.getProgramInfoLog(prog)); return null
  }
  gl.useProgram(prog)

  const uR = gl.getUniformLocation(prog, 'uR')
  const uP = gl.getUniformLocation(prog, 'uP')
  const uT = gl.getUniformLocation(prog, 'uT')

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW)
  const aPos = gl.getAttribLocation(prog, 'a')
  gl.enableVertexAttribArray(aPos)
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

  let progress = 0, time = 0, raf = 0, running = false
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

  function resize() {
    const w = window.innerWidth, h = window.innerHeight
    canvas.width = w * dpr | 0
    canvas.height = h * dpr | 0
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    gl.viewport(0, 0, canvas.width, canvas.height)
  }

  function draw() {
    gl.uniform2f(uR, canvas.width, canvas.height)
    gl.uniform1f(uP, progress)
    gl.uniform1f(uT, time)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  let lastT = 0
  function loop(ts) {
    if (!running) return
    const dt = Math.min((ts - lastT) / 1000, .05)
    lastT = ts
    time += dt
    draw()
    raf = requestAnimationFrame(loop)
  }

  function start() {
    if (running) return
    running = true
    lastT = performance.now()
    draw()
    raf = requestAnimationFrame(loop)
  }

  function stop() {
    running = false
    if (raf) { cancelAnimationFrame(raf); raf = 0 }
  }

  function destroy() { stop(); gl.deleteProgram(prog); gl.deleteBuffer(buf) }

  resize()
  window.addEventListener('resize', resize)
  const visH = () => { document.hidden ? stop() : start() }
  document.addEventListener('visibilitychange', visH)
  start()

  return {
    set progress(v) { progress = Math.max(0, Math.min(1, v)); if (!running) draw() },
    destroy() { window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visH); destroy() }
  }
}
