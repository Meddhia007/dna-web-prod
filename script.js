document.addEventListener('DOMContentLoaded', async () => {
    if (typeof window.aws_amplify === 'undefined') {
        console.error('Amplify library not loaded.');
        return;
    }
    if (typeof window.awsExports === 'undefined') {
        console.error('aws-exports.js not loaded.');
        return;
    }

    const { Amplify, API } = window.aws_amplify;
    Amplify.configure(window.awsExports);

    const listTeamMembers = /* GraphQL */ `
      query ListTeamMembers(
        $filter: ModelTeamMemberFilterInput
        $limit: Int
        $nextToken: String
      ) {
        listTeamMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
          items {
            id
            name
            role
            description
            image
            createdAt
            updatedAt
          }
          nextToken
        }
      }
    `;

    const listServices = /* GraphQL */ `
      query ListServices(
        $filter: ModelServiceFilterInput
        $limit: Int
        $nextToken: String
      ) {
        listServices(filter: $filter, limit: $limit, nextToken: $nextToken) {
          items {
            id
            title
            description
            createdAt
            updatedAt
          }
          nextToken
        }
      }
    `;

    const listPortfolioItems = /* GraphQL */ `
      query ListPortfolioItems(
        $filter: ModelPortfolioItemFilterInput
        $limit: Int
        $nextToken: String
      ) {
        listPortfolioItems(
          filter: $filter
          limit: $limit
          nextToken: $nextToken
        ) {
          items {
            id
            title
            category
            image
            createdAt
            updatedAt
          }
          nextToken
        }
      }
    `;

    const listEquipments = /* GraphQL */ `
      query ListEquipments(
        $filter: ModelEquipmentFilterInput
        $limit: Int
        $nextToken: String
      ) {
        listEquipments(filter: $filter, limit: $limit, nextToken: $nextToken) {
          items {
            id
            name
            description
            badge
            image
            createdAt
            updatedAt
          }
          nextToken
        }
      }
    `;

    async function fetchAndRenderData() {
        try {
            const [teamData, serviceData, portfolioData, equipmentData] = await Promise.all([
                API.graphql({ query: listTeamMembers }),
                API.graphql({ query: listServices }),
                API.graphql({ query: listPortfolioItems }),
                API.graphql({ query: listEquipments })
            ]);

            renderTeam(teamData.data.listTeamMembers.items);
            renderServices(serviceData.data.listServices.items);
            renderPortfolio(portfolioData.data.listPortfolioItems.items);
            renderEquipment(equipmentData.data.listEquipments.items);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function renderTeam(members) {
        const container = document.getElementById('team-members-container');
        if (!container) return;
        container.innerHTML = members.map(member => `
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
    }

    function renderServices(services) {
        const container = document.querySelector('.services-grid-v2');
        if (!container) return;
        container.innerHTML = services.map(service => `
            <div class="service-card-v2">
                <div class="service-icon-v2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <h4>${service.title}</h4>
                <p>${service.description}</p>
            </div>
        `).join('');
    }

    function renderPortfolio(items) {
        const container = document.querySelector('.portfolio-grid');
        if (!container) return;
        container.innerHTML = items.map(item => `
            <div class="portfolio-item ${item.category}">
                <img src="${item.image}" alt="${item.title}">
                <div class="portfolio-info">
                    <h3>${item.title}</h3>
                    <p>${item.category}</p>
                </div>
            </div>
        `).join('');
        // Re-initialize portfolio filtering
        initializePortfolioFilter();
    }

    function renderEquipment(equipments) {
        const container = document.querySelector('.equipment-showcase');
        if (!container) return;
        container.innerHTML = equipments.map(equipment => `
            <div class="equipment-card-main">
                 <div class="card-header">
                     <img src="${equipment.image}" alt="${equipment.name}" class="card-image">
                     <div class="card-title">
                         <h3>${equipment.name}</h3>
                         <p>${equipment.description}</p>
                     </div>
                     <div class="card-badge">${equipment.badge}</div>
                 </div>
            </div>
        `).join('');
    }

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
    function initializePortfolioFilter() {
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
                            if (filter === 'all' || item.classList.contains(filter)) {
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
    }

    fetchAndRenderData();
});
