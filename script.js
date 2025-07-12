document.addEventListener('DOMContentLoaded', () => {

    // --- DYNAMIC CONTENT LOADING ---
    const loadDynamicContent = async () => {
        try {
            const res = await fetch('admin/db.json');
            const db = await res.json();

            renderServices(db.services);
            renderTeam(db.team);
            renderPortfolio(db.portfolio);
            renderEquipment(db.equipment);

        } catch (error) {
            console.error('Error loading dynamic content:', error);
        }
    };

    const renderServices = (services) => {
        const servicesGrid = document.querySelector('.services-grid-v2');
        if (!servicesGrid) return;
        servicesGrid.innerHTML = services.map(service => `
            <div class="service-card-v2">
                <div class="service-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></div>
                <h4>${service.name}</h4>
                <p>${service.description || ''}</p>
            </div>
        `).join('');
    };

    const renderTeam = (team) => {
        const teamTrack = document.querySelector('.team-scroller-track');
        if (!teamTrack) return;
        teamTrack.innerHTML = team.map(member => `
            <div class="team-member-card">
                <div class="team-member-photo-wrapper">
                    <img src="${member.image || 'assets/images/team-placeholder-1.png'}" alt="${member.name}" class="team-member-photo">
                    <div class="team-member-overlay"><p>${member.description || ''}</p></div>
                </div>
                <div class="team-member-info">
                    <h4 class="team-member-name">${member.name}</h4>
                    <p class="team-member-role">${member.role}</p>
                </div>
            </div>
        `).join('');
    };

    const renderPortfolio = (portfolio) => {
        const portfolioGrid = document.querySelector('.portfolio-grid');
        if (!portfolioGrid) return;
        portfolioGrid.innerHTML = portfolio.map(item => `
            <div class="portfolio-item" data-category="${item.category || ''}">
                <img src="${item.image || 'assets/images/placeholder.png'}" alt="${item.title}">
                <div class="portfolio-info">
                    <h3>${item.title}</h3>
                    <p>${item.description || ''}</p>
                </div>
            </div>
        `).join('');
    };

    const renderEquipment = (equipment) => {
        const equipmentShowcase = document.querySelector('.equipment-showcase');
        if (!equipmentShowcase) return;
        equipmentShowcase.innerHTML = equipment.map(item => `
            <div class="equipment-card-main">
                <div class="card-header">
                    <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></div>
                    <div class="card-title">
                        <h3>${item.name}</h3>
                        <p>${item.type || ''}</p>
                    </div>
                    <div class="card-badge">${item.badge || ''}</div>
                </div>
                <div class="card-body">
                    <div class="features-section">
                        <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Key Features</h4>
                        <ul class="features-list">
                            ${(item.features || []).map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="specs-section">
                        <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M20 9l-8 8-8-8"/></svg> Technical Specs</h4>
                        <ul class="specs-list">
                            ${(item.specs || []).map(spec => `<li><span>${spec.key}</span><span>${spec.value}</span></li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');
    };

    loadDynamicContent();

    // --- HAMBURGER MENU LOGIC ---
    const hamburger = document.getElementById('hamburger-menu');
    const navLinksContainer = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = document.querySelectorAll('section[data-section]');

    // --- COUNTER ANIMATION LOGIC ---
    const animateCounter = (element) => {
        const target = +element.getAttribute('data-target');
        const duration = 2000; // ms
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const current = Math.min(Math.floor(progress / duration * target), target);
            element.innerText = current.toLocaleString();
            if (current < target) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    // --- OBSERVER FOR SECTION VISIBILITY & NAV LINKS ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);

            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (navLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));

    // --- OBSERVER FOR ELEMENT ANIMATIONS (FADE-IN, COUNTERS) ---
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    if (!counter.dataset.animated) {
                        animateCounter(counter);
                        counter.dataset.animated = 'true';
                    }
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        animationObserver.observe(el);
    });

    // --- PORTFOLIO FILTERING ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.getAttribute('data-filter');

                portfolioItems.forEach(item => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    item.style.display = 'none';
                });

                setTimeout(() => {
                    const visibleItems = [];
                    portfolioItems.forEach(item => {
                        if (filter === '*' || item.classList.contains(filter.substring(1))) {
                            item.style.display = 'block';
                            visibleItems.push(item);
                        }
                    });

                    visibleItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, index * 80);
                    });
                }, 300);
            });
        });
    }
});
