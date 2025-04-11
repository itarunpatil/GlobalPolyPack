// Mobile menu toggle (if needed for smaller screens)
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (input.hasAttribute('required') && !input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff3860';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                // In a real application, you would send the form data to a server
                alert('Thank you for your message. We will get back to you soon!');
                this.reset();
            }
        });
    }
    
    // Chemical details page functionality
    if (window.location.pathname.includes('chemical.html')) {
        loadChemicalData();
    }
    
    // Quote form handling
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        // Pre-select product if URL has product parameter
        const urlParams = new URLSearchParams(window.location.search);
        const productParam = urlParams.get('id');
        
        if (productParam) {
            const productSelect = document.getElementById('product');
            if (productSelect) {
                for (let i = 0; i < productSelect.options.length; i++) {
                    if (productSelect.options[i].value === productParam) {
                        productSelect.options[i].selected = true;
                        break;
                    }
                }
            }
        }
        
        // Handle other product field visibility
        const productSelect = document.getElementById('product');
        const otherProductRow = document.getElementById('other-product-row'); // Use the row ID
        
        if (productSelect && otherProductRow) {
            // Initial check on page load
            checkOtherProductVisibility(productSelect, otherProductRow);
            
            productSelect.addEventListener('change', function() {
                checkOtherProductVisibility(this, otherProductRow);
            });
        }

        function checkOtherProductVisibility(selectElement, rowElement) {
            let otherSelected = false;
            for (let i = 0; i < selectElement.options.length; i++) {
                if (selectElement.options[i].selected && selectElement.options[i].value === 'other') {
                    otherSelected = true;
                    break;
                }
            }
            rowElement.style.display = otherSelected ? 'block' : 'none';
        }
        
        // Form submission
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            const requiredInputs = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredInputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff3860';
                } else {
                    input.style.borderColor = '#ddd';
                }
            });
            
            if (isValid) {
                // In a real application, you would send the form data to a server
                alert('Thank you for your quote request. Our team will contact you shortly with pricing information.');
                this.reset();
                
                // Redirect to thank you page (in a real implementation)
                // window.location.href = 'thank-you.html';
            }
        });
    }
    
    // Counter animation for statistics
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const animateStats = () => {
            stats.forEach(stat => {
                const targetValue = parseInt(stat.textContent);
                let currentValue = 0;
                const duration = 2000; // ms
                const increment = targetValue / (duration / 16);
                
                const animateSingle = () => {
                    currentValue += increment;
                    if (currentValue < targetValue) {
                        stat.textContent = Math.floor(currentValue) + '+';
                        requestAnimationFrame(animateSingle);
                    } else {
                        stat.textContent = targetValue + '+';
                    }
                };
                
                animateSingle();
            });
        };
        
        // Use Intersection Observer to trigger animation when stats are visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        const statsContainer = document.querySelector('.about-stats');
        if (statsContainer) {
            observer.observe(statsContainer);
        }
    }

    // Function to load chemical data from JSON file
    function loadChemicalData() {
        const urlParams = new URLSearchParams(window.location.search);
        const chemicalId = urlParams.get('id');
        
        if (!chemicalId) {
            window.location.href = 'index.html#products';
            return;
        }
        
        fetch('chemicals.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!data[chemicalId]) {
                    throw new Error('Chemical not found');
                }
                
                displayChemicalData(data[chemicalId], chemicalId);
            })
            .catch(error => {
                console.error('Error loading chemical data:', error);
                document.getElementById('chemical-name').textContent = 'Chemical not found';
                document.getElementById('chemical-overview').textContent = 'The requested chemical information could not be loaded. Please try again later or contact us for more information.';
            });
    }
    
    // Function to display chemical data on the page
    function displayChemicalData(chemical, chemicalId) {
        // Set page title
        document.title = `${chemical.name} - Global Poly Pack`;
        
        // Update chemical header
        document.getElementById('chemical-name').textContent = chemical.name;
        document.getElementById('chemical-formula').textContent = chemical.formula;
        
        // Update chemical image
        const imgElement = document.getElementById('chemical-img');
        imgElement.src = chemical.image;
        imgElement.alt = chemical.name;
        
        // Update overview
        document.getElementById('chemical-overview').textContent = chemical.overview;
        
        // Update properties
        document.getElementById('property-cas').textContent = chemical.properties.cas;
        document.getElementById('property-mw').textContent = chemical.properties.molecular_weight;
        document.getElementById('property-appearance').textContent = chemical.properties.appearance;
        document.getElementById('property-mp').textContent = chemical.properties.melting_point;
        document.getElementById('property-bp').textContent = chemical.properties.boiling_point;
        document.getElementById('property-solubility').textContent = chemical.properties.solubility;
        
        // Update applications
        const applicationsList = document.getElementById('applications-list');
        applicationsList.innerHTML = '';
        chemical.applications.forEach(application => {
            const li = document.createElement('li');
            li.textContent = application;
            applicationsList.appendChild(li);
        });
        
        // Update safety information
        document.getElementById('safety-info').textContent = chemical.safety;
        
        // Update packaging options
        const packagingList = document.getElementById('packaging-list');
        packagingList.innerHTML = '';
        chemical.packaging.forEach(packaging => {
            const li = document.createElement('li');
            li.textContent = packaging;
            packagingList.appendChild(li);
        });
        
        // Update quote link
        document.getElementById('quote-link').href = `quote.html?id=${chemicalId}`;
        
        // Load related products
        loadRelatedProducts(chemical.related);
    }
    
    // Function to load related products
    function loadRelatedProducts(relatedIds) {
        fetch('chemicals.json')
            .then(response => response.json())
            .then(data => {
                const relatedGrid = document.getElementById('related-grid');
                relatedGrid.innerHTML = '';
                
                relatedIds.forEach(id => {
                    if (data[id]) {
                        const related = data[id];
                        
                        const relatedProduct = document.createElement('div');
                        relatedProduct.className = 'related-product';
                        
                        const img = document.createElement('img');
                        img.src = related.image;
                        img.alt = related.name;
                        
                        const h4 = document.createElement('h4');
                        h4.textContent = related.name;
                        
                        const link = document.createElement('a');
                        link.href = `chemical.html?id=${id}`;
                        link.className = 'view-btn';
                        link.textContent = 'View Details';
                        
                        relatedProduct.appendChild(img);
                        relatedProduct.appendChild(h4);
                        relatedProduct.appendChild(link);
                        
                        relatedGrid.appendChild(relatedProduct);
                    }
                });
            })
            .catch(error => {
                console.error('Error loading related products:', error);
            });
    }
}); 