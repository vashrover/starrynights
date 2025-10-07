const canvas = document.getElementById('starry-background');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const stars = [];
const shootingStars = [];
const dialog = document.getElementById('dialog');
const wishForm = document.getElementById('wish-form');

function createStar() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5
  };
}

function createShootingStar() {
  const startX = Math.random() * canvas.width;
  const startY = Math.random() * canvas.height / 2;
  return {
    x: startX,
    y: startY,
    dx: Math.random() * 5 + 5,
    dy: Math.random() * 2 + 2,
    length: 100,
    caught: false
  };
}

for (let i = 0; i < 150; i++) {
  stars.push(createStar());
}

function animate() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw stars
  ctx.fillStyle = 'white';
  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > canvas.height) s.y = 0;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });

  // Draw shooting stars
  let hovered = false;

  shootingStars.forEach((s, index) => {
    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x - s.length, s.y - s.length / 2);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();

    s.x += s.dx;
    s.y += s.dy;

    // If mouse is near a shooting star, set hovered to true
    if (mouse && Math.hypot(mouse.x - s.x, mouse.y - s.y) < 50) {
      hovered = true;
    }

    // Remove if off screen
    if (s.x > canvas.width || s.y > canvas.height) {
      shootingStars.splice(index, 1);
    }
  });

  // Change cursor
  canvas.style.cursor = hovered ? 'pointer' : 'default';

  requestAnimationFrame(animate);
}

// Pause shooting star spawning when tab is hidden
let shootingStarInterval = setInterval(() => {
  shootingStars.push(createShootingStar());
}, 5000);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clearInterval(shootingStarInterval);
  } else {
    shootingStarInterval = setInterval(() => {
      shootingStars.push(createShootingStar());
    }, 5000);
  }
});

canvas.addEventListener('click', e => {
  shootingStars.forEach(s => {
    const dist = Math.hypot(e.clientX - s.x, e.clientY - s.y);
    if (dist < 50 && !s.caught) {
      s.caught = true;
      fetchQuality(); // ✅ show the next quality instead of just opening dialog
    }

  });
});

let currentIndex = 0;

function fetchQuality() {
  // ✅ updated to match Spring Boot controller
  fetch("/next-quality")
      .then(res => res.text())
      .then(msg => {
        document.getElementById("quality-text").innerText = msg;

        // If it's the final message, add some surprise
        if (msg.includes("Happy Boyfriend’s Day")) {
          launchFireworks(); // 🎆 surprise effect
        }

        dialog.classList.remove("hidden");
        currentIndex++; // (not really needed anymore, but fine to keep)
      })
      .catch(err => console.error("Error fetching quality:", err));
}

function closeDialog() {
  dialog.classList.add("hidden");
}




// Track mouse for pointer detection
let mouse = null;
canvas.addEventListener('mousemove', e => {
  mouse = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener('touchstart', e => {
  // get the first touch point
  const touch = e.touches[0];
  const touchX = touch.clientX;
  const touchY = touch.clientY;

  shootingStars.forEach(s => {
    const dist = Math.hypot(touchX - s.x, touchY - s.y);
    if (dist < 50 && !s.caught) {
      s.caught = true;
      fetchQuality(); // show quality popup
    }
  });

  e.preventDefault(); // prevent scrolling while touching canvas
});

animate();

function launchFireworks() {
  const particles = [];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: (Math.random() - 0.5) * 8,
      dy: (Math.random() - 0.5) * 8,
      size: Math.random() * 3 + 2,
      life: 100,
      color: `hsl(${Math.random() * 360}, 100%, 60%)`
    });
  }

  function animateFireworks() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.05; // gravity
      p.life--;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.life <= 0) particles.splice(i, 1);
    });

    if (particles.length > 0) {
      requestAnimationFrame(animateFireworks);
    }
  }

  animateFireworks();
}

