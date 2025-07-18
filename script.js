import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';
import awsExports from './src/aws-exports.js';

document.addEventListener('DOMContentLoaded', async () => {

    // Configure Amplify with the credentials from our module
    Amplify.configure(awsExports);

    const client = generateClient();

    const listTeamMembers = /* GraphQL */ `
      query ListTeamMembers(
        $filter: ModelTeamMemberFilterInput
        $nextToken: String
      ) {
        listTeamMembers(filter: $filter, nextToken: $nextToken) {
          items {
            id
            name
            role
            description
            image
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
      }
    `;

    const listServices = /* GraphQL */ `
      query ListServices(
        $filter: ModelServiceFilterInput
        $nextToken: String
      ) {
        listServices(filter: $filter, nextToken: $nextToken) {
          items {
            id
            title
            description
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
      }
    `;

    const listPortfolioItems = /* GraphQL */ `
      query ListPortfolioItems(
        $filter: ModelPortfolioItemFilterInput
        $nextToken: String
      ) {
        listPortfolioItems(filter: $filter, nextToken: $nextToken) {
          items {
            id
            title
            category
            image
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
      }
    `;

    const listEquipments = /* GraphQL */ `
      query ListEquipments(
        $filter: ModelEquipmentFilterInput
        $nextToken: String
      ) {
        listEquipments(filter: $filter, nextToken: $nextToken) {
          items {
            id
            name
            description
            badge
            image
            createdAt
            updatedAt
            __typename
          }
          nextToken
          __typename
        }
      }
    `;

    async function fetchAndRenderData() {
        try {
            // Fetch Team Members
            const teamData = await client.graphql({ query: listTeamMembers });
            const teamMembers = teamData.data.listTeamMembers.items;
            const teamContainer = document.getElementById('team-container');
            if (teamContainer && teamMembers.length > 0) {
                teamContainer.innerHTML = '';
                teamMembers.forEach(member => {
                    const memberDiv = document.createElement('div');
                    memberDiv.className = 'col-lg-4 col-md-6 d-flex align-items-stretch';
                    memberDiv.innerHTML = `
                        <div class="member">
                            <div class="member-img">
                                <img src="${member.image || 'assets/images/team-placeholder-4.png'}" class="img-fluid" alt="${member.name}">
                            </div>
                            <div class="member-info">
                                <h4>${member.name}</h4>
                                <span>${member.role}</span>
                                <p>${member.description}</p>
                            </div>
                        </div>
                    `;
                    teamContainer.appendChild(memberDiv);
                });
            }

            // Fetch Services
            const servicesData = await client.graphql({ query: listServices });
            const services = servicesData.data.listServices.items;
            const servicesContainer = document.getElementById('services-container');
            if (servicesContainer && services.length > 0) {
                servicesContainer.innerHTML = '';
                services.forEach(service => {
                    const serviceDiv = document.createElement('div');
                    serviceDiv.className = 'col-md-6 col-lg-3 d-flex align-items-stretch mb-5 mb-lg-0';
                    serviceDiv.innerHTML = `
                        <div class="icon-box">
                            <h4 class="title"><a href="">${service.title}</a></h4>
                            <p class="description">${service.description}</p>
                        </div>
                    `;
                    servicesContainer.appendChild(serviceDiv);
                });
            }

            // Fetch Portfolio Items
            const portfolioData = await client.graphql({ query: listPortfolioItems });
            const portfolioItems = portfolioData.data.listPortfolioItems.items;
            const portfolioContainer = document.querySelector('.portfolio-container');
            if (portfolioContainer && portfolioItems.length > 0) {
                portfolioContainer.innerHTML = '';
                portfolioItems.forEach(item => {
                    const portfolioDiv = document.createElement('div');
                    portfolioDiv.className = `col-lg-4 col-md-6 portfolio-item filter-${item.category.toLowerCase()}`;
                    portfolioDiv.innerHTML = `
                        <div class="portfolio-wrap">
                            <img src="${item.image.replace('assets/', '')}" class="img-fluid" alt="${item.title}">
                            <div class="portfolio-info">
                                <h4>${item.title}</h4>
                                <p>${item.category}</p>
                                <div class="portfolio-links">
                                    <a href="${item.image.replace('assets/', '')}" data-gallery="portfolioGallery" class="portfolio-lightbox" title="${item.title}"><i class="bx bx-plus"></i></a>
                                </div>
                            </div>
                        </div>
                    `;
                    portfolioContainer.appendChild(portfolioDiv);
                });
            }

            // Fetch Equipment
            const equipmentData = await client.graphql({ query: listEquipments });
            const equipments = equipmentData.data.listEquipments.items;
            const equipmentContainer = document.getElementById('equipment-container');
            if (equipmentContainer && equipments.length > 0) {
                equipmentContainer.innerHTML = '';
                equipments.forEach(equipment => {
                    const equipmentDiv = document.createElement('div');
                    equipmentDiv.className = 'col-lg-3 col-md-4 col-6';
                    equipmentDiv.innerHTML = `
                        <div class="client-logo">
                            <img src="${equipment.image.replace('assets/', '')}" class="img-fluid" alt="${equipment.name}">
                            <span class="badge bg-secondary">${equipment.badge}</span>
                        </div>
                    `;
                    equipmentContainer.appendChild(equipmentDiv);
                });
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.errors) {
                console.error('GraphQL Errors:', error.errors);
            }
        }
    }

    // Fetch data and then initialize third-party libraries
    await fetchAndRenderData();

    // --- INITIALIZE THIRD-PARTY LIBRARIES ---
    if (window.Isotope) {
        const portfolioIsotope = new Isotope('.portfolio-container', {
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        document.querySelectorAll('#portfolio-flters li').forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelectorAll('#portfolio-flters li').forEach(el => el.classList.remove('filter-active'));
                this.classList.add('filter-active');
                portfolioIsotope.arrange({
                    filter: this.getAttribute('data-filter')
                });
            });
        });
    }

    if (window.GLightbox) {
        new GLightbox({
            selector: '.portfolio-lightbox'
        });
    }

    // All other page logic that was outside the listener before
    const sections = document.querySelectorAll('section[data-section]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

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
                if (navLink) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
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
});
