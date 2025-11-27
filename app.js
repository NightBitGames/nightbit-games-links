// =======================
// NightBit LinkHub v1.0
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const linksContainer = document.getElementById("linksContainer");
    const themeToggle = document.getElementById("themeToggle");
    const logo = document.querySelector(".logo");

    // ----------------------------------
    // 1. LOGO SWAP (SVG)
    // ----------------------------------
    function swapLogo(mode) {
        if (!logo) return;
        const darkSrc = logo.dataset.dark;   // logo blanco
        const lightSrc = logo.dataset.light; // logo negro
        logo.src = mode === "light" ? lightSrc : darkSrc;
    }

    // ----------------------------------
    // 2. Cargar tema guardado
    // ----------------------------------
    const savedTheme = localStorage.getItem("nb-theme");

    if (savedTheme === "light") {
        body.classList.remove("theme-dark");
        body.classList.add("theme-light");
        swapLogo("light");
        updateThemeToggleLabel("light");
    } else {
        body.classList.remove("theme-light");
        body.classList.add("theme-dark");
        swapLogo("dark");
        updateThemeToggleLabel("dark");
    }

    // ----------------------------------
    // 3. Botón de tema
    // ----------------------------------
    themeToggle.addEventListener("click", () => {
        const isDark = body.classList.contains("theme-dark");

        if (isDark) {
            body.classList.remove("theme-dark");
            body.classList.add("theme-light");
            swapLogo("light");
            updateThemeToggleLabel("light");
            localStorage.setItem("nb-theme", "light");
        } else {
            body.classList.remove("theme-light");
            body.classList.add("theme-dark");
            swapLogo("dark");
            updateThemeToggleLabel("dark");
            localStorage.setItem("nb-theme", "dark");
        }
    });

    function updateThemeToggleLabel(mode) {
        const icon = themeToggle.querySelector(".theme-toggle__icon");
        const label = themeToggle.querySelector(".theme-toggle__label");
        if (mode === "light") {
            icon.textContent = "☀️";
            label.textContent = "Modo claro";
        } else {
            icon.textContent = "🌙";
            label.textContent = "Modo oscuro";
        }
    }

    // ----------------------------------
    // 4. Cargar links desde JSON
    // ----------------------------------
    fetch("links.json")
        .then(res => res.json())
        .then(links => {
            links.forEach((link, index) => {
                const a = document.createElement("a");
                a.className = "link-card";
                a.href = link.url;
                a.target = link.url.startsWith("mailto:") ? "_self" : "_blank";

                a.style.transitionDelay = `${index * 0.06}s`;

                a.innerHTML = `
                    <img src="${link.icon}" class="link-card__icon" alt="">
                    <span class="link-card__label">${link.name}</span>
                `;

                linksContainer.appendChild(a);
            });

            requestAnimationFrame(() => {
                document.body.classList.add("is-ready");
            });
        })
        .catch(err => {
            console.error("Error cargando links.json:", err);
            linksContainer.innerHTML = "<p style='opacity:0.6;'>No se pudieron cargar los enlaces.</p>";
        });

    // ----------------------------------
    // 5. Estrellas de fondo
    // ----------------------------------
    const canvas = document.getElementById("stars");
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let stars = [];
    const STAR_COUNT = 90;

    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.2 + 0.3,
            speed: Math.random() * 0.25 + 0.05,
            opacity: Math.random() * 0.8 + 0.2,
        });
    }

    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (const s of stars) {
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${s.opacity})`;
            ctx.fill();

            s.y += s.speed;
            if (s.y > canvas.height) {
                s.x = Math.random() * canvas.width;
                s.y = -5;
            }
        }

        requestAnimationFrame(animateStars);
    }

    animateStars();
});
