// HERO 3D — clean isometric-style floating device blocks
(function(){
  const canvas = document.getElementById('hero-canvas');
  const visual = document.querySelector('.hero-visual');
  if(!visual || !canvas) return;
  let w = visual.clientWidth, h = visual.clientHeight;
  if(!w || !h) return;


  const scene = new THREE.Scene();
  // Orthographic-feel: wide FOV + far camera = flatter, more isometric look
  const camera = new THREE.PerspectiveCamera(28, w/h, 0.1, 200);
  camera.position.set(0, 1.8, 14);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setSize(w,h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

  const group = new THREE.Group();
  scene.add(group);

  // Add soft directional light for subtle shading (gives 3D depth without wireframe)
  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambient);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight.position.set(4, 8, 6);
  scene.add(dirLight);

  function solidBox(sx, sy, sz, color){
    const geo = new THREE.BoxGeometry(sx, sy, sz);
    // Use Lambert for soft shading instead of flat Basic
    const mat = new THREE.MeshLambertMaterial({ color });
    const mesh = new THREE.Mesh(geo, mat);
    // Thin edge outline
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 })
    );
    mesh.add(line);
    return mesh;
  }

  // === LAPTOP-LIKE BASE PLATFORM ===
  const base = solidBox(3.6, 0.15, 2.2, 0xdde3f0);
  base.position.set(0, -1.5, 0);
  group.add(base);

  // Laptop "screen" (thin tall panel standing on base)
  const screen = solidBox(3.0, 2.0, 0.1, 0xf0f3fa);
  screen.position.set(0, -0.35, -1.05);
  group.add(screen);

  // Screen face (colored area inside the white bezel)
  const screenFace = solidBox(2.6, 1.6, 0.06, 0x1e3a6e);
  screenFace.position.set(0, -0.35, -0.98);
  group.add(screenFace);

  // UI bar elements on screen (red + blue blocks as "UI panels")
  const uiRed = solidBox(1.1, 0.9, 0.05, 0xdc2626);
  uiRed.position.set(-0.65, -0.1, -0.92);
  group.add(uiRed);

  const uiBlue = solidBox(1.1, 0.6, 0.05, 0x2563eb);
  uiBlue.position.set(0.65, 0.1, -0.92);
  group.add(uiBlue);

  const uiWhite = solidBox(1.1, 0.25, 0.05, 0xffffff);
  uiWhite.position.set(0.65, -0.38, -0.92);
  group.add(uiWhite);

  // === FLOATING ACCENT OBJECTS ===
  // Small red diamond/cube top-right
  const cubeRed = solidBox(0.38, 0.38, 0.38, 0xef4444);
  cubeRed.rotation.set(0.4, 0.5, 0.3);
  cubeRed.position.set(1.9, 0.9, 0.3);
  group.add(cubeRed);

  // Small blue cube top
  const cubeBlue = solidBox(0.28, 0.28, 0.28, 0x3b82f6);
  cubeBlue.rotation.set(0.3, 0.7, 0.2);
  cubeBlue.position.set(0.5, 1.4, -0.2);
  group.add(cubeBlue);

  // Tiny white cube bottom-left
  const cubeWhite = solidBox(0.22, 0.22, 0.22, 0xffffff);
  cubeWhite.rotation.set(0.2, 0.3, 0.4);
  cubeWhite.position.set(-2.0, -0.6, 0.8);
  group.add(cubeWhite);

  // Floating ring/torus to the right (techy accent)
  const torusGeo = new THREE.TorusGeometry(0.42, 0.07, 12, 40);
  const torusMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(2.1, -0.2, 0.5);
  torus.rotation.set(1.1, 0.3, 0.2);
  group.add(torus);

  // Isometric group tilt
  group.rotation.x = -0.18;
  group.rotation.y = 0.28;

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  });

  const baseY = 0;
  const clock = new THREE.Clock();

  function animate(){
    const t = clock.getElapsedTime();

    // Gentle float
    group.position.y = baseY + Math.sin(t * 0.7) * 0.1;

    // Floating accent cubes bob independently
    cubeRed.position.y  = 0.9  + Math.sin(t * 1.3 + 0.0) * 0.14;
    cubeBlue.position.y = 1.4  + Math.sin(t * 1.1 + 1.0) * 0.12;
    cubeWhite.position.y = -0.6 + Math.sin(t * 0.9 + 2.0) * 0.10;
    torus.position.y    = -0.2 + Math.sin(t * 1.0 + 1.5) * 0.12;

    // Slow spin on accent pieces
    cubeRed.rotation.y  += 0.008;
    cubeBlue.rotation.y += 0.006;
    torus.rotation.z    += 0.005;

    // Mouse parallax (subtle)
    group.rotation.y += (0.28 + mouseX * 0.3 - group.rotation.y) * 0.04;
    group.rotation.x += (-0.18 + mouseY * 0.15 - group.rotation.x) * 0.04;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  function onResize(){
    w = visual.clientWidth || 500;
    h = visual.clientHeight || 460;
    if(w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
  // delay agar DOM selesai paint sebelum measure
  requestAnimationFrame(onResize);
})();

// PROMO CAROUSEL
(function(){
  const track = document.getElementById('promoTrack');
  const dotsWrap = document.getElementById('promoDots');
  const prevBtn = document.getElementById('promoPrev');
  const nextBtn = document.getElementById('promoNext');
  const carousel = document.getElementById('promoCarousel');
  if(!track) return;

  const slides = track.children;
  const count = slides.length;
  let index = 0;
  let timer = null;

  for(let i=0;i<count;i++){
    const dot = document.createElement('button');
    dot.className = 'promo-dot' + (i===0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Slide ' + (i+1));
    dot.addEventListener('click', ()=> goTo(i));
    dotsWrap.appendChild(dot);
  }

  function update(){
    track.style.transform = `translateX(-${index*100}%)`;
    [...dotsWrap.children].forEach((d,i)=> d.classList.toggle('active', i===index));
  }
  function goTo(i){ index = (i+count)%count; update(); restart(); }
  function next(){ goTo(index+1); }
  function prev(){ goTo(index-1); }
  function restart(){
    clearInterval(timer);
    timer = setInterval(next, 4500);
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);
  carousel.addEventListener('mouseenter', ()=> clearInterval(timer));
  carousel.addEventListener('mouseleave', restart);

  update();
  restart();
})();