document.addEventListener('DOMContentLoaded', function() {
    // Authentication Modal Handling
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.querySelector('.close');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Show auth modal
    function showAuthModal(tab = 'login') {
        authModal.style.display = 'block';
        switchTab(tab);
    }

    // Switch between login/register tabs
    function switchTab(tab) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
        document.getElementById('registerForm').style.display = tab === 'register' ? 'block' : 'none';
    }

    // Event listeners for auth modal
    loginBtn.addEventListener('click', () => showAuthModal('login'));
    registerBtn.addEventListener('click', () => showAuthModal('register'));
    closeModal.addEventListener('click', () => authModal.style.display = 'none');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // Form submissions
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // In a real app, you would validate and send to server
        console.log('Login attempt with:', email, password);
        showToast('Logged in successfully', 'success');
        authModal.style.display = 'none';
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;
        
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        
        // In a real app, you would validate and send to server
        console.log('Registration with:', name, email, password);
        showToast('Account created successfully', 'success');
        switchTab('login');
    });

    // Toast notifications
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Booking tabs functionality
    const bookingTabs = document.querySelectorAll('.booking-tabs .tab-btn');
    const bookingLists = document.querySelectorAll('.booking-list');

    bookingTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            bookingTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all booking lists
            bookingLists.forEach(list => list.style.display = 'none');
            // Show the corresponding booking list
            const targetList = document.querySelector(tab.dataset.tab);
            if (targetList) targetList.style.display = 'block';
        });
    });

    // Booking details modal
    const bookingModal = document.getElementById('bookingModal');
    const viewDetailBtns = document.querySelectorAll('.view-details');

    viewDetailBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // In a real app, you would fetch actual booking details
            const bookingCard = btn.closest('.booking-card');
            const location = bookingCard.querySelector('h4').textContent;
            const spot = bookingCard.querySelectorAll('p')[2].textContent;
            const time = bookingCard.querySelectorAll('p')[1].textContent;
            const status = bookingCard.querySelector('.status-badge').textContent;
            
            // Populate modal with data
            document.getElementById('bookingLocation').textContent = location;
            document.getElementById('bookingSpot').textContent = spot.split(': ')[1];
            document.getElementById('bookingTime').textContent = time.split(': ')[1];
            document.getElementById('bookingStatus').textContent = status;
            document.getElementById('bookingStatus').className = `status-badge ${status.toLowerCase()}`;
            
            // Show modal
            bookingModal.style.display = 'block';
        });
    });

    // Close booking modal
    document.querySelector('#bookingModal .close').addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });

    // Initialize stats counter animation
    function animateStats() {
        const statItems = document.querySelectorAll('.stat-item h3');
        const durations = [1000, 1200, 800, 1500];
        
        statItems.forEach((stat, index) => {
            const target = parseInt(stat.textContent.replace(/[+,%]/g, ''));
            const duration = durations[index];
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    clearInterval(timer);
                    stat.textContent = index === 2 ? target + '%' : 
                                      index === 3 ? '24/7' : 
                                      target.toLocaleString() + (index === 1 ? '+' : '');
                    return;
                }
                stat.textContent = Math.floor(current).toLocaleString();
            }, 16);
        });
    }

    // Intersection Observer for stats animation
    const statsSection = document.querySelector('.stats');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        observer.observe(statsSection);
    }

    // Initialize features with hover effects
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            const icon = card.querySelector('i');
            icon.style.transform = 'rotate(15deg) scale(1.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            const icon = card.querySelector('i');
            icon.style.transform = 'rotate(0) scale(1)';
        });
    });

    // Mobile menu toggle (if needed)
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    document.querySelector('header .container').appendChild(mobileMenuToggle);

    mobileMenuToggle.addEventListener('click', () => {
        document.querySelector('nav').classList.toggle('show');
    });

    // Admin link visibility (just for demo)
    const adminLink = document.querySelector('.admin-link');
    if (adminLink && !localStorage.getItem('isAdmin')) {
        adminLink.style.display = 'none';
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // In a real app, you would clear session/token
            showToast('Logged out successfully', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
});

// Parking Spot Reservation Modal
function setupSpotModal() {
    const spotModal = document.getElementById('spotModal');
    const reserveButtons = document.querySelectorAll('.reserve-btn, #reserveSpot');
    const closeButtons = document.querySelectorAll('.spot-modal .close, .cancel-btn');

    // Sample spot data
    const sampleSpots = [
        {
            id: 1,
            name: "Downtown Parking Garage",
            address: "123 Main St, Anytown, USA",
            price: 3.50,
            maxDaily: 25.00,
            rating: 4,
            reviews: 24,
            features: ["Covered", "Security", "EV Charging", "Accessible"],
            images: ["assets/parking-lot.jpg", "assets/parking-garage.jpg", "assets/street-parking.jpg"],
            availability: {
                "9:00 AM": true,
                "10:00 AM": true,
                "11:00 AM": false,
                "12:00 PM": true,
                "1:00 PM": true,
                "2:00 PM": false,
                "3:00 PM": true,
                "4:00 PM": true
            }
        },
        {
            id: 2,
            name: "City Center Parking Lot",
            address: "456 Central Ave, Anytown, USA",
            price: 4.00,
            maxDaily: 28.00,
            rating: 4.5,
            reviews: 32,
            features: ["EV Charging", "Security"],
            images: ["assets/parking-lot.jpg", "assets/parking-garage.jpg"],
            availability: {
                "9:00 AM": false,
                "10:00 AM": true,
                "11:00 AM": true,
                "12:00 PM": false,
                "1:00 PM": true,
                "2:00 PM": true,
                "3:00 PM": false,
                "4:00 PM": true
            }
        }
    ];

    // Open modal with spot data
    function openSpotModal(spotId) {
        const spot = sampleSpots.find(s => s.id === spotId) || sampleSpots[0];
        
        // Populate modal with spot data
        document.getElementById('spotName').textContent = spot.name;
        document.getElementById('spotAddress').textContent = spot.address;
        document.getElementById('spotPrice').textContent = `$${spot.price.toFixed(2)}`;
        document.getElementById('spotMaxDaily').textContent = `$${spot.maxDaily.toFixed(2)}`;
        document.querySelector('.spot-rating .stars').textContent = '★★★★☆'.slice(0, spot.rating) + '☆☆☆☆☆'.slice(spot.rating);
        document.querySelector('.spot-rating span').textContent = `(${spot.reviews} reviews)`;
        
        // Set features
        const featuresContainer = document.querySelector('.spot-features');
        featuresContainer.innerHTML = '';
        spot.features.forEach(feature => {
            const icon = {
                "Covered": "fa-car",
                "Security": "fa-camera",
                "EV Charging": "fa-bolt",
                "Accessible": "fa-wheelchair"
            }[feature] || "fa-check";
            
            const span = document.createElement('span');
            span.innerHTML = `<i class="fas ${icon}"></i> ${feature}`;
            featuresContainer.appendChild(span);
        });
        
        // Set main image
        const mainImage = document.getElementById('spotMainImage');
        mainImage.src = spot.images[0];
        mainImage.alt = spot.name;
        
        // Set thumbnails
        const thumbnails = document.querySelector('.spot-thumbnails');
        thumbnails.innerHTML = '';
        spot.images.forEach((img, index) => {
            const thumbnail = document.createElement('img');
            thumbnail.src = img;
            thumbnail.alt = `Thumbnail ${index + 1}`;
            thumbnail.addEventListener('click', () => {
                mainImage.src = img;
                document.querySelectorAll('.spot-thumbnails img').forEach(t => {
                    t.style.borderColor = 'transparent';
                });
                thumbnail.style.borderColor = '#3498db';
            });
            thumbnails.appendChild(thumbnail);
        });
        
        // Set availability grid
        const availabilityGrid = document.getElementById('availabilityGrid');
        availabilityGrid.innerHTML = '';
        for (const [time, available] of Object.entries(spot.availability)) {
            const slot = document.createElement('div');
            slot.className = `time-slot ${available ? '' : 'booked'}`;
            slot.textContent = time;
            if (available) {
                slot.addEventListener('click', function() {
                    document.querySelectorAll('.time-slot').forEach(s => {
                        s.classList.remove('selected');
                    });
                    this.classList.add('selected');
                });
            }
            availabilityGrid.appendChild(slot);
        }
        
        // Show modal
        spotModal.style.display = 'block';
    }

    // Close modal
    function closeSpotModal() {
        spotModal.style.display = 'none';
    }

    // Event listeners
    reserveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const spotId = parseInt(btn.dataset.spotId) || 1;
            openSpotModal(spotId);
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeSpotModal);
    });

    window.addEventListener('click', (e) => {
        if (e.target === spotModal) {
            closeSpotModal();
        }
    });

    // Reserve spot form submission
    document.getElementById('reserveSpot').addEventListener('click', function(e) {
        e.preventDefault();
        const selectedTime = document.querySelector('.time-slot.selected');
        
        if (!selectedTime) {
            showToast('Please select a time slot', 'error');
            return;
        }
        
        const spotName = document.getElementById('spotName').textContent;
        const time = selectedTime.textContent;
        
        showToast(`Reservation confirmed for ${spotName} at ${time}`, 'success');
        closeSpotModal();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setupSpotModal();
    
    // If on map page, initialize map
    if (document.getElementById('parkingMap')) {
        initParkingMap();
    }
});

// Parking Map Functionality
function initParkingMap() {
    const map = L.map('parkingMap').setView([51.505, -0.09], 15);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Sample parking locations
    const parkingLocations = [
        {
            id: 1,
            name: "Downtown Parking Garage",
            address: "123 Main St, Anytown, USA",
            position: [51.505, -0.09],
            spots: 45,
            available: 12,
            price: 3.50,
            features: ["Covered", "Security", "EV Charging"],
            type: "garage"
        },
        {
            id: 2,
            name: "City Center Parking Lot",
            address: "456 Central Ave, Anytown, USA",
            position: [51.51, -0.1],
            spots: 32,
            available: 8,
            price: 4.00,
            features: ["EV Charging"],
            type: "lot"
        },
        {
            id: 3,
            name: "Riverfront Street Parking",
            address: "789 Riverside Dr, Anytown, USA",
            position: [51.515, -0.08],
            spots: 24,
            available: 5,
            price: 2.50,
            features: [],
            type: "street"
        }
    ];

    // Add markers to map
    parkingLocations.forEach(location => {
        const marker = L.marker(location.position).addTo(map);
        
        const popupContent = `
            <div class="map-popup">
                <h3>${location.name}</h3>
                <p>${location.address}</p>
                <p>Available: ${location.available}/${location.spots} spots</p>
                <p class="popup-price">$${location.price.toFixed(2)}/hour</p>
                <div class="popup-actions">
                    <button class="reserve-btn" data-spot-id="${location.id}">Reserve</button>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        marker.on('click', function() {
            // Highlight corresponding item in parking list
            const parkingList = document.getElementById('parkingList');
            const parkingItems = parkingList.querySelectorAll('.parking-item');
            
            parkingItems.forEach(item => {
                item.classList.remove('active');
                if (parseInt(item.dataset.spotId) === location.id) {
                    item.classList.add('active');
                    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });
    });

    // Populate parking list
    const parkingList = document.getElementById('parkingList');
    
    parkingLocations.forEach(location => {
        const item = document.createElement('div');
        item.className = 'parking-item';
        item.dataset.spotId = location.id;
        
        const featuresHTML = location.features.map(feature => {
            const icon = {
                "Covered": "fa-car",
                "Security": "fa-camera",
                "EV Charging": "fa-bolt"
            }[feature] || "fa-check";
            
            return `<span><i class="fas ${icon}"></i> ${feature}</span>`;
        }).join('');
        
        item.innerHTML = `
            <h4>${location.name}</h4>
            <p>${location.address}</p>
            <div class="parking-features">${featuresHTML}</div>
            <div class="parking-price">
                <span>$${location.price.toFixed(2)}/hr</span>
                <button class="reserve-btn" data-spot-id="${location.id}">Reserve</button>
            </div>
        `;
        
        item.addEventListener('click', function() {
            // Center map on this location
            map.setView(location.position, 16);
            
            // Open popup
            const marker = Object.values(map._layers).find(layer => {
                return layer instanceof L.Marker && 
                       layer.getLatLng().lat === location.position[0] &&
                       layer.getLatLng().lng === location.position[1];
            });
            
            if (marker) {
                marker.openPopup();
            }
            
            // Highlight this item
            document.querySelectorAll('.parking-item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
        });
        
        parkingList.appendChild(item);
    });

    // Filter functionality
    document.getElementById('applyFilters').addEventListener('click', function() {
        const parkingType = document.getElementById('parkingType').value;
        const priceRange = document.getElementById('priceRange').value;
        const availability = document.getElementById('availability').value;
        
        parkingLocations.forEach(location => {
            let show = true;
            
            // Filter by type
            if (parkingType !== 'all' && location.type !== parkingType) {
                show = false;
            }
            
            // Filter by price
            if (priceRange !== 'all') {
                const price = location.price;
                if (priceRange === 'free' && price > 0) {
                    show = false;
                } else if (priceRange === '0-5' && (price < 0 || price > 5)) {
                    show = false;
                } else if (priceRange === '5-10' && (price < 5 || price > 10)) {
                    show = false;
                } else if (priceRange === '10+' && price < 10) {
                    show = false;
                }
            }
            
            // Filter by availability
            if (availability === 'available' && location.available <= 0) {
                show = false;
            }
            
            // Update map marker visibility
            const marker = Object.values(map._layers).find(layer => {
                return layer instanceof L.Marker && 
                       layer.getLatLng().lat === location.position[0] &&
                       layer.getLatLng().lng === location.position[1];
            });
            
            if (marker) {
                if (show) {
                    map.addLayer(marker);
                } else {
                    map.removeLayer(marker);
                }
            }
            
            // Update list item visibility
            const listItem = document.querySelector(`.parking-item[data-spot-id="${location.id}"]`);
            if (listItem) {
                listItem.style.display = show ? 'block' : 'none';
            }
        });
    });
}