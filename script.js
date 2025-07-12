const API_GATEWAY_ENDPOINT = 'YOUR_API_GATEWAY_ENDPOINT_HERE'; // IMPORTANT: Replace with your actual API Gateway endpoint

document.addEventListener('DOMContentLoaded', () => {

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

    // --- DYNAMIC CONTENT LOADING ---
    async function fetchAndRenderContent(type, containerId, renderFunction) {
        try {
            const response = await fetch(`${API_GATEWAY_ENDPOINT}/items/${type.toUpperCase()}`);
            const items = await response.json();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = ''; // Clear existing content
                if (items.length > 0) {
                    items.forEach(item => renderFunction(item, container));
                } else {
                    container.innerHTML = `<p>No ${type} found.</p>`;
                }
            }
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `<p>Error loading ${type}.</p>`;
            }
        }
    }

    // Render functions for each content type
    function renderService(service, container) {
        const serviceCard = document.createElement('div');
        serviceCard.classList.add('service-card-v2');
        serviceCard.innerHTML = `
            <div class="service-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></div>
            <h4>${service.name}</h4>
            <p>${service.description}</p>
        `;
        container.appendChild(serviceCard);
    }

    function renderPortfolioItem(item, container) {
        const portfolioItem = document.createElement('div');
        portfolioItem.classList.add('portfolio-item');
        portfolioItem.setAttribute('data-category', item.category || 'all'); // Assuming a category field
        portfolioItem.innerHTML = `
            <img src="${item.image_url || 'assets/images/placeholder.png'}" alt="${item.name}">
            <div class="portfolio-info">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>
        `;
        container.appendChild(portfolioItem);
    }

    function renderEquipment(equipment, container) {
        const equipmentCard = document.createElement('div');
        equipmentCard.classList.add('equipment-card-main');
        equipmentCard.innerHTML = `
            <div class="card-header">
                <div class="card-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg></div>
                <div class="card-title">
                    <h3>${equipment.name}</h3>
                    <p>${equipment.subtitle || ''}</p>
                </div>
                ${equipment.badge ? `<div class="card-badge">${equipment.badge}</div>` : ''}
            </div>
            <div class="card-body">
                <div class="features-section">
                    <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Key Features</h4>
                    <ul class="features-list">
                        ${equipment.features ? equipment.features.map(f => `<li>${f}</li>`).join('') : ''}
                    </ul>
                </div>
                <div class="specs-section">
                    <h4><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M20 9l-8 8-8-8"/></svg> Technical Specs</h4>
                    <ul class="specs-list">
                        ${equipment.specs ? Object.entries(equipment.specs).map(([key, value]) => `<li><span>${key}</span><span>${value}</span></li>`).join('') : ''}
                    </ul>
                </div>
            </div>
        `;
        container.appendChild(equipmentCard);
    }

    function renderTeamMember(member, container) {
        const memberCard = document.createElement('div');
        memberCard.classList.add('team-member-card');
        memberCard.innerHTML = `
            <div class="team-member-photo-wrapper">
                <img src="${member.image_url || 'assets/images/placeholder.png'}" alt="${member.name}" class="team-member-photo">
                <div class="team-member-overlay"><p>${member.description || ''}</p></div>
            </div>
            <div class="team-member-info">
                <h4 class="team-member-name">${member.name}</h4>
                <p class="team-member-role">${member.role || ''}</p>
            </div>
        `;
        container.appendChild(memberCard);
    }

    // Initial content load
    fetchAndRenderContent('service', 'services-container', renderService);
    fetchAndRenderContent('portfolio', 'portfolio-grid', renderPortfolioItem);
    fetchAndRenderContent('equipment', 'equipment-showcase', renderEquipment);
    fetchAndRenderContent('team_member', 'team-scroller-track', renderTeamMember);

    // --- PORTFOLIO FILTERING (UPDATED FOR DYNAMIC CONTENT) ---
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.getAttribute('data-filter');
                const portfolioItems = document.querySelectorAll('#portfolio-grid .portfolio-item'); // Get dynamically loaded items

                portfolioItems.forEach(item => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    item.style.display = 'none';
                });

                setTimeout(() => {
                    const visibleItems = [];
                    portfolioItems.forEach(item => {
                        if (filter === 'all' || item.getAttribute('data-category') === filter) {
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