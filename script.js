import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

document.addEventListener("DOMContentLoaded", function() {
    const projects = [
        {
            title: "Python Desktop Application",
            description: "Desktop app for automation and data processing. Check out my CRUD projects repo!",
            image: "Capture d'écran 2025-12-21 124336.png",
            tags: ["Python", "Automation", "Desktop"],
            link: "https://github.com/yourusername/CRUD"
        },
        {
            title: "Web Management System",
            description: "Web platform for business and commerce management. Part of my CRUD collection.",
            image: "Capture d'écran 2025-12-21 124813.png",
            tags: ["Web App", "Management", "Full Stack"],
            link: "https://github.com/yourusername/CRUD"
        },
        {
            title: "Mini Desktop Projects",
            description: "Collection of handy utility tools for everyday productivity. Included in CRUD repo.",
            image: "Capture d'écran 2025-12-21 125608.png",
            tags: ["Utilities", "Desktop", "Productivity"],
            link: "https://github.com/yourusername/CRUD"
        }
    ];

    const projectsGrid = document.getElementById("projects-grid");

    projects.forEach((project, index) => {
        const card = document.createElement("article");
        card.className = "project-card reveal";
        card.style.transitionDelay = `${index * 90}ms`;

        card.innerHTML = `
            <img class="project-media" src="${project.image}" alt="${project.title}">
            <div class="project-body">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="chips">
                    ${project.tags.map((tag) => `<span class="chip">${tag}</span>`).join("")}
                </div>
                <a class="project-link" href="${project.link}" target="_blank" rel="noreferrer">View Project →</a>
            </div>
        `;

        projectsGrid.appendChild(card);
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("in-view");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.18 });

    document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

    // 3D Scene Setup
    const canvas = document.getElementById("webgl-canvas");
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 5.5);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 1.25);
    keyLight.position.set(2.4, 1.8, 3);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xe5e7eb, 0.9, 15);
    rimLight.position.set(-2.4, -1.2, 2.5);
    scene.add(rimLight);

    const geometry = new THREE.TorusKnotGeometry(1.1, 0.34, 220, 34);
    const material = new THREE.MeshPhysicalMaterial({
        color: 0x7dd7ff,
        metalness: 0.06,
        roughness: 0.08,
        transmission: 0.66,
        ior: 1.22,
        thickness: 1.6,
        clearcoat: 1,
        clearcoatRoughness: 0.08
    });

    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    const haloGeo = new THREE.RingGeometry(1.65, 1.84, 80);
    const haloMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        opacity: 0.25,
        transparent: true,
        side: THREE.DoubleSide
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.z = -0.8;
    scene.add(halo);

    const hero = document.querySelector(".hero");
    let w = 1;
    let h = 1;

    function resizeScene() {
        const rect = hero.getBoundingClientRect();
        w = Math.max(rect.width * 0.47, 280);
        h = Math.max(rect.height - 22, 300);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    resizeScene();
    window.addEventListener("resize", resizeScene);

    function getScrollProgress() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (max <= 0) return 0;
        return window.scrollY / max;
    }

    const clock = new THREE.Clock();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function animate() {
        const t = clock.getElapsedTime();
        const scrollProgress = getScrollProgress();

        if (!reduceMotion) {
            knot.rotation.x = t * 0.35 + scrollProgress * 2.2;
            knot.rotation.y = t * 0.5 + scrollProgress * 3.1;
            knot.position.y = Math.sin(t * 0.9) * 0.14;
            knot.position.z = Math.sin(scrollProgress * Math.PI * 2) * 0.3;
            halo.rotation.z = -t * 0.24;
            halo.scale.setScalar(1 + Math.sin(t * 1.2) * 0.035);
        }

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
});

