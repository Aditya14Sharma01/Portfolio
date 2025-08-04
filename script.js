function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu functionality
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navBackdrop = document.getElementById('navBackdrop');

  function toggleMenu() {
    navLinks.classList.toggle('active');
    navBackdrop.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  if (menuToggle && navLinks && navBackdrop) {
    menuToggle.addEventListener('click', toggleMenu);
    navBackdrop.addEventListener('click', toggleMenu);
  }

  // Close mobile menu when clicking on a nav link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navBackdrop.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });

  // Smooth scrolling with offset for fixed navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // 3D Experience Helix Animation
  const expCanvas = document.getElementById('experience3d');
  if (expCanvas && window.THREE) {
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ canvas: expCanvas, alpha: true, antialias: true });
    renderer.setSize(expCanvas.clientWidth, expCanvas.clientHeight, false);
    renderer.setClearColor(0x000000, 0); // transparent

    // Set up scene and camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, expCanvas.clientWidth / expCanvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 15); // Move camera closer for a tighter view

    // Neon glow effect for helix
    function createGlowLine(geometry, color, size) {
      return new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(geometry.attributes.position.array.reduce((arr, v, i) => {
          if (i % 3 === 0) arr.push(new THREE.Vector3(geometry.attributes.position.array[i], geometry.attributes.position.array[i+1], geometry.attributes.position.array[i+2]));
          return arr;
        }, [])), 100, size, 8, false),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18 })
      );
    }

    // Helix parameters
    const helixRadius = 2;
    const helixTurns = 3;
    const helixHeight = 8; // Fixed height for spiral
    const helixPoints = 200;
    let helixGeometry = new THREE.BufferGeometry();
    let helixVertices = new Float32Array(helixPoints * 3);
    const helixMaterial = new THREE.LineBasicMaterial({ color: 0x00fff7, linewidth: 4 });
    const helixLine = new THREE.Line(helixGeometry, helixMaterial);
    scene.add(helixLine);
    // Neon glow (tube)
    let glowMesh = null;

    // Experience clouds (spheres)
    const cloudData = [
      { y: 3.5, angle: Math.PI / 3, color: 0x00ffae, labelId: 'exp-label-0', icon: '\uf0b1' }, // briefcase
      { y: 1, angle: Math.PI - 0.5, color: 0xffd700, labelId: 'exp-label-1', icon: '\uf51c' },      // chalkboard-teacher
      { y: -6.5, angle: -Math.PI / 2, color: 0xb388ff, labelId: 'exp-label-2', icon: '\uf059' }  // question-circle
    ];
    const cloudMeshes = [];
    const cloudHelixAttach = [];
    cloudData.forEach((cloud, idx) => {
      const sphereGeom = new THREE.SphereGeometry(0.7, 32, 32);
      const sphereMat = new THREE.MeshPhongMaterial({ color: cloud.color, shininess: 120, emissive: cloud.color, emissiveIntensity: 0.5 });
      const mesh = new THREE.Mesh(sphereGeom, sphereMat);
      // Position around helix
      const x = (helixRadius + 1.5) * Math.cos(cloud.angle);
      const z = (helixRadius + 1.5) * Math.sin(cloud.angle);
      mesh.position.set(x, cloud.y, z);
      scene.add(mesh);
      cloudMeshes.push(mesh);
      // Connect to helix with a line
      const helixX = helixRadius * Math.cos(cloud.angle);
      const helixZ = helixRadius * Math.sin(cloud.angle);
      cloudHelixAttach.push(new THREE.Vector3(helixX, cloud.y, helixZ));
      // Glowing line from helix to sphere
      const lineGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(helixX, cloud.y, helixZ),
        new THREE.Vector3(x, cloud.y, z)
      ]);
      const lineMat = new THREE.LineBasicMaterial({ color: cloud.color, linewidth: 2 });
      const glowLine = new THREE.Line(lineGeom, lineMat);
      scene.add(glowLine);
    });

    // Particle effect (floating binary)
    const particles = [];
    const particleCount = 32;
    for (let i = 0; i < particleCount; i++) {
      const spriteMat = new THREE.SpriteMaterial({ color: 0x00fff7 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * helixHeight,
        (Math.random() - 0.5) * 7
      );
      sprite.scale.set(0.3, 0.3, 0.3);
      scene.add(sprite);
      particles.push(sprite);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0x00fff7, 0.7);
    dirLight.position.set(5, 10, 10);
    scene.add(dirLight);

    // Animate helix and update label positions
    function animateHelix(time) {
      // Animate helix: undulate/wave as it rotates
      for (let i = 0; i < helixPoints; i++) {
        const t = (i / (helixPoints - 1)) * Math.PI * 2 * helixTurns;
        const y = (i / (helixPoints - 1)) * helixHeight - helixHeight / 2;
        // Add a sine wave for DNA-like undulation
        const wave = Math.sin(t * 2 + time * 0.002) * 0.5;
        const x = (helixRadius + wave) * Math.cos(t + time * 0.0015);
        const z = (helixRadius + wave) * Math.sin(t + time * 0.0015);
        helixVertices[i * 3] = x;
        helixVertices[i * 3 + 1] = y;
        helixVertices[i * 3 + 2] = z;
      }
      helixGeometry.setAttribute('position', new THREE.BufferAttribute(helixVertices, 3));
      helixGeometry.attributes.position.needsUpdate = true;
      helixLine.rotation.y += 0.01;
      // Neon glow tube
      if (glowMesh) scene.remove(glowMesh);
      glowMesh = createGlowLine(helixGeometry, 0x00fff7, 0.18);
      scene.add(glowMesh);
      // Pulse spheres
      cloudMeshes.forEach((mesh, idx) => {
        const scale = 1 + 0.13 * Math.sin(time * 0.003 + idx * 2);
        mesh.scale.set(scale, scale, scale);
        mesh.material.emissiveIntensity = 0.7 + 0.3 * Math.abs(Math.sin(time * 0.003 + idx));
        mesh.rotation.y += 0.01;
      });
      // Animate particles
      particles.forEach((sprite, i) => {
        sprite.position.y += 0.01 * Math.sin(time * 0.001 + i);
        sprite.position.x += 0.008 * Math.cos(time * 0.0012 + i * 2);
        sprite.material.opacity = 0.7 + 0.3 * Math.sin(time * 0.002 + i);
      });
    }

    // Project 3D sphere positions to 2D and move HTML labels
    function updateLabels() {
      cloudMeshes.forEach((mesh, idx) => {
        const label = document.getElementById(cloudData[idx].labelId);
        if (!label) return;
        // Project 3D position to 2D
        const vector = mesh.position.clone();
        vector.project(camera);
        const x = (vector.x * 0.5 + 0.5) * expCanvas.clientWidth;
        const y = (1 - (vector.y * 0.5 + 0.5)) * expCanvas.clientHeight;
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        label.style.transform = 'translate(-50%, -50%)';
        label.style.display = 'block';
      });
    }

    // Animation loop
    function animate(time) {
      requestAnimationFrame(animate);
      animateHelix(time || 0);
      renderer.render(scene, camera);
      updateLabels();
    }
    animate();
  }

  // Initialize timeline animation
  initTimelineAnimation();
});

// Remove theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navBackdrop = document.getElementById('navBackdrop');

    if (menuToggle && navLinks && navBackdrop) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navBackdrop.classList.toggle('active');
        });

        navBackdrop.addEventListener('click', () => {
            navLinks.classList.remove('active');
            navBackdrop.classList.remove('active');
        });
    }
});

function sendEmail(event) {
  event.preventDefault(); // Prevent the default form submission

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const message = document.getElementById('message').value;

  // Basic validation
  if (!name || !email || !phone || !message) {
    alert('Please fill in all fields.');
    return;
  }

  // Send email using EmailJS
  emailjs.send('service_k6cc7gp', 'template_ekpsph9', {
    from_name: name,
    from_email: email,
    phone: phone,
    message: message,
  })
  .then(function(response) {
    console.log('SUCCESS!', response.status, response.text);
    alert('Thank you for your message! We will get back to you soon.');
  }, function(error) {
    console.log('FAILED...', error);
    alert('Failed to send the message. Please try again later.');
  });
}

// Animated Timeline
function initTimelineAnimation() {
  const timelineContainer = document.querySelector('.timeline-container');
  const timelineCards = document.querySelectorAll('.timeline-card');
  
  console.log('Timeline elements found:', {
    container: !!timelineContainer,
    cards: timelineCards.length
  });
  
  if (!timelineContainer || timelineCards.length === 0) return;
  
  // Scroll animation function
  function animateOnScroll() {
    const timelineCards = document.querySelectorAll('.timeline-card');
    
    // Animate timeline cards
    timelineCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        card.style.opacity = '1';
        card.style.transform = 'translateX(0)';
      }
    });
  }
  
  // Initialize timeline cards
  timelineCards.forEach(card => {
    card.style.opacity = '0';
    if (card.classList.contains('left')) {
      card.style.transform = 'translateX(-50px)';
    } else if (card.classList.contains('right')) {
      card.style.transform = 'translateX(50px)';
    }
  });
  
  // Add scroll event listener with throttling
  let ticking = false;
  function updateOnScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        animateOnScroll();
        ticking = false;
      });
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', updateOnScroll, { passive: true });
  
  // Initial animation
  animateOnScroll();
  
  // Also animate on window resize
  window.addEventListener('resize', updateOnScroll, { passive: true });
}
