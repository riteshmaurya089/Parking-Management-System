document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map
    const map = L.map('parkingMap').setView([51.505, -0.09], 15);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Sample parking spot data
    const parkingSpots = [
        {
            id: 1,
            name: "Downtown Parking Garage",
            address: "123 Main St, Anytown, USA",
            position: [51.505, -0.09],
            totalSpots: 120,
            availableSpots: 24,
            pricePerHour: 3.50,
            maxDailyRate: 25.00,
            type: "garage",
            features: ["covered", "security", "ev-charging", "accessible"],
            images: [
                "assets/parking-garage.jpg",
                "assets/parking-interior.jpg",
                "assets/ev-charging.jpg"
            ],
            rating: 4.2,
            reviews: 128
        },
        {
            id: 2,
            name: "City Center Parking Lot",
            address: "456 Central Ave, Anytown, USA",
            position: [51.51, -0.1],
            totalSpots: 80,
            availableSpots: 12,
            pricePerHour: 4.00,
            maxDailyRate: 28.00,
            type: "lot",
            features: ["ev-charging"],
            images: [
                "assets/parking-lot.jpg",
                "assets/city-center.jpg"
            ],
            rating: 3.9,
            reviews: 87
        },
        {
            id: 3,
            name: "Riverfront Street Parking",
            address: "789 Riverside Dr, Anytown, USA",
            position: [51.515, -0.08],
            totalSpots: 40,
            availableSpots: 8,
            pricePerHour: 2.50,
            maxDailyRate: 15.00,
            type: "street",
            features: [],
            images: [
                "assets/street-parking.jpg",
                "assets/riverfront.jpg"
            ],
            rating: 4.0,
            reviews: 64
        },
        {
            id: 4,
            name: "Shopping Mall Parking",
            address: "101 Retail Rd, Anytown, USA",
            position: [51.5, -0.095],
            totalSpots: 200,
            availableSpots: 45,
            pricePerHour: 3.00,
            maxDailyRate: 20.00,
            type: "garage",
            features: ["covered", "security", "accessible"],
            images: [
                "assets/mall-parking.jpg",
                "assets/mall-entrance.jpg"
            ],
            rating: 4.1,
            reviews: 156
        }
    ];

    // Custom parking spot icon
    const parkingIcon = L.divIcon({
        className: 'parking-marker',
        html: '<i class="fas fa-parking"></i>',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
    });

    // Add markers to the map
    const markers = [];
    parkingSpots.forEach(spot => {
        const marker = L.marker(spot.position, {
            icon: parkingIcon,
            spotId: spot.id
        }).addTo(map);
        
        // Store reference to marker
        markers.push(marker);
        
        // Create popup content
        const featuresList = spot.features.map(feature => {
            const icons = {
                "covered": "fa-car",
                "security": "fa-camera",
                "ev-charging": "fa-bolt",
                "accessible": "fa-wheelchair"
            };
            return `<li><i class="fas ${icons[feature]}"></i> ${feature.replace('-', ' ')}</li>`;
        }).join('');

        const popupContent = `
            <div class="map-popup">
                <h3>${spot.name}</h3>
                <p class="popup-address">${spot.address}</p>
                <div class="popup-availability">
                    <span class="available">${spot.availableSpots}</span> / 
                    <span class="total">${spot.totalSpots}</span> spots available
                </div>
                <div class="popup-pricing">
                    <span class="price">$${spot.pricePerHour.toFixed(2)}</span> / hour
                    <span class="max-price">Max: $${spot.maxDailyRate.toFixed(2)} daily</span>
                </div>
                <div class="popup-rating">
                    ${generateStarRating(spot.rating)} 
                    <span class="review-count">(${spot.reviews})</span>
                </div>
                ${featuresList ? `<ul class="popup-features">${featuresList}</ul>` : ''}
                <div class="popup-actions">
                    <button class="popup-btn reserve-btn" data-spot-id="${spot.id}">
                        <i class="fas fa-calendar-check"></i> Reserve
                    </button>
                    <button class="popup-btn directions-btn" data-spot-id="${spot.id}">
                        <i class="fas fa-directions"></i> Directions
                    </button>
                </div>
            </div>
        `;
        
        marker.bindPopup(popupContent);
        
        // Highlight corresponding list item when marker is clicked
        marker.on('click', function() {
            const listItem = document.querySelector(`.parking-item[data-spot-id="${spot.id}"]`);
            if (listItem) {
                // Remove highlight from all items
                document.querySelectorAll('.parking-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add highlight to this item
                listItem.classList.add('active');
                
                // Scroll to the item
                listItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Generate star rating HTML
    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let starsHtml = '';
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                starsHtml += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                starsHtml += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHtml += '<i class="far fa-star"></i>';
            }
        }
        
        return starsHtml;
    }

    // Populate parking list
    const parkingList = document.getElementById('parkingList');
    
    parkingSpots.forEach(spot => {
        const item = document.createElement('div');
        item.className = 'parking-item';
        item.dataset.spotId = spot.id;
        
        const featuresHTML = spot.features.map(feature => {
            const icons = {
                "covered": "fa-car",
                "security": "fa-camera",
                "ev-charging": "fa-bolt",
                "accessible": "fa-wheelchair"
            };
            return `<span><i class="fas ${icons[feature]}"></i> ${feature.replace('-', ' ')}</span>`;
        }).join('');
        
        item.innerHTML = `
            <h4>${spot.name}</h4>
            <p>${spot.address}</p>
            <div class="parking-features">${featuresHTML}</div>
            <div class="parking-meta">
                <span class="availability">
                    <i class="fas fa-car"></i> ${spot.availableSpots}/${spot.totalSpots} available
                </span>
                <span class="rating">
                    ${generateStarRating(spot.rating)} ${spot.rating.toFixed(1)}
                </span>
            </div>
            <div class="parking-price">
                <span>$${spot.pricePerHour.toFixed(2)}/hr</span>
                <button class="reserve-btn" data-spot-id="${spot.id}">Reserve</button>
            </div>
        `;
        
        // Click handler for list items
        item.addEventListener('click', function() {
            // Find the corresponding marker
            const marker = markers.find(m => m.options.spotId === spot.id);
            if (marker) {
                // Center map on this marker
                map.setView(spot.position, 16);
                
                // Open the popup
                marker.openPopup();
                
                // Highlight this item
                document.querySelectorAll('.parking-item').forEach(i => {
                    i.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
        
        parkingList.appendChild(item);
    });

    // Search functionality
    const searchInput = document.getElementById('locationSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) return;
        
        // Try to find a matching spot
        const foundSpot = parkingSpots.find(spot => 
            spot.name.toLowerCase().includes(query) || 
            spot.address.toLowerCase().includes(query)
        );
        
        if (foundSpot) {
            // Find the marker
            const marker = markers.find(m => m.options.spotId === foundSpot.id);
            if (marker) {
                // Center map on this marker
                map.setView(foundSpot.position, 16);
                
                // Open the popup
                marker.openPopup();
                
                // Highlight the corresponding list item
                document.querySelectorAll('.parking-item').forEach(item => {
                    item.classList.remove('active');
                    if (parseInt(item.dataset.spotId) === foundSpot.id) {
                        item.classList.add('active');
                        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                });
            }
        } else {
            showToast('No matching parking locations found', 'error');
        }
    }

    // Filter functionality
    const parkingTypeFilter = document.getElementById('parkingType');
    const priceRangeFilter = document.getElementById('priceRange');
    const availabilityFilter = document.getElementById('availability');
    const applyFiltersBtn = document.getElementById('applyFilters');
    
    applyFiltersBtn.addEventListener('click', function() {
        const type = parkingTypeFilter.value;
        const priceRange = priceRangeFilter.value;
        const availability = availabilityFilter.value === 'available';
        
        // Filter parking spots
        const filteredSpots = parkingSpots.filter(spot => {
            // Filter by type
            if (type !== 'all' && spot.type !== type) return false;
            
            // Filter by price
            if (priceRange !== 'all') {
                if (priceRange === 'free' && spot.pricePerHour > 0) return false;
                if (priceRange === '0-5' && (spot.pricePerHour < 0 || spot.pricePerHour > 5)) return false;
                if (priceRange === '5-10' && (spot.pricePerHour < 5 || spot.pricePerHour > 10)) return false;
                if (priceRange === '10+' && spot.pricePerHour < 10) return false;
            }
            
            // Filter by availability
            if (availability && spot.availableSpots <= 0) return false;
            
            return true;
        });
        
        // Update map markers
        markers.forEach(marker => {
            const spotId = marker.options.spotId;
            const spot = parkingSpots.find(s => s.id === spotId);
            
            if (filteredSpots.includes(spot)) {
                if (!map.hasLayer(marker)) {
                    map.addLayer(marker);
                }
            } else {
                if (map.hasLayer(marker)) {
                    map.removeLayer(marker);
                }
            }
        });
        
        // Update parking list
        document.querySelectorAll('.parking-item').forEach(item => {
            const spotId = parseInt(item.dataset.spotId);
            const spot = parkingSpots.find(s => s.id === spotId);
            
            if (filteredSpots.includes(spot)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show message if no results
        if (filteredSpots.length === 0) {
            showToast('No parking spots match your filters', 'info');
        } else {
            showToast(`Found ${filteredSpots.length} parking spots`, 'success');
        }
    });

    // Parking spot modal
    const spotModal = document.getElementById('spotModal');
    const reserveButtons = document.querySelectorAll('.reserve-btn, #reserveSpot');
    
    // Event delegation for reserve buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.reserve-btn')) {
            e.preventDefault();
            const spotId = parseInt(e.target.closest('.reserve-btn').dataset.spotId);
            const spot = parkingSpots.find(s => s.id === spotId);
            if (spot) {
                openSpotModal(spot);
            }
        }
    });
    
    function openSpotModal(spot) {
        document.getElementById('spotName').textContent = spot.name;
        document.getElementById('spotAddress').textContent = spot.address;
        document.getElementById('spotPrice').textContent = spot.pricePerHour.toFixed(2);
        document.getElementById('spotMaxDaily').textContent = spot.maxDailyRate.toFixed(2);
        
        // Rating
        const starsContainer = document.querySelector('.spot-rating .stars');
        starsContainer.innerHTML = generateStarRating(spot.rating);
        document.querySelector('.spot-rating span').textContent = `(${spot.reviews} reviews)`;
        
        // Features
        const featuresContainer = document.querySelector('.spot-features');
        featuresContainer.innerHTML = '';
        spot.features.forEach(feature => {
            const icons = {
                "covered": "fa-car",
                "security": "fa-camera",
                "ev-charging": "fa-bolt",
                "accessible": "fa-wheelchair"
            };
            
            const span = document.createElement('span');
            span.innerHTML = `<i class="fas ${icons[feature]}"></i> ${feature.replace('-', ' ')}`;
            featuresContainer.appendChild(span);
        });
        
        // Images
        const mainImage = document.getElementById('spotMainImage');
        mainImage.src = spot.images[0];
        mainImage.alt = spot.name;
        
        const thumbnailsContainer = document.querySelector('.spot-thumbnails');
        thumbnailsContainer.innerHTML = '';
        spot.images.forEach((img, index) => {
            const imgElement = document.createElement('img');
            imgElement.src = img;
            imgElement.alt = `Thumbnail ${index + 1}`;
            imgElement.addEventListener('click', function() {
                mainImage.src = img;
                document.querySelectorAll('.spot-thumbnails img').forEach(img => {
                    img.style.borderColor = 'transparent';
                });
                this.style.borderColor = '#3498db';
            });
            thumbnailsContainer.appendChild(imgElement);
        });
        
        // Availability grid
        const availabilityGrid = document.getElementById('availabilityGrid');
        availabilityGrid.innerHTML = '';
        
        // Generate time slots (every hour from 8AM to 8PM)
        for (let hour = 8; hour <= 20; hour++) {
            const time = `${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`;
            const isAvailable = Math.random() > 0.3; // 70% chance of being available
            
            const timeSlot = document.createElement('div');
            timeSlot.className = `time-slot ${isAvailable ? '' : 'booked'}`;
            timeSlot.textContent = time;
            
            if (isAvailable) {
                timeSlot.addEventListener('click', function() {
                    document.querySelectorAll('.time-slot').forEach(slot => {
                        slot.classList.remove('selected');
                    });
                    this.classList.add('selected');
                });
            }
            
            availabilityGrid.appendChild(timeSlot);
        }
        
        // Show modal
        spotModal.style.display = 'block';
    }
    
    // Close modal
    document.querySelector('#spotModal .close').addEventListener('click', function() {
        spotModal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === spotModal) {
            spotModal.style.display = 'none';
        }
    });
    
    // Reserve spot
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
        spotModal.style.display = 'none';
    });

    // Directions functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.directions-btn')) {
            e.preventDefault();
            const spotId = parseInt(e.target.closest('.directions-btn').dataset.spotId);
            const spot = parkingSpots.find(s => s.id === spotId);
            if (spot) {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${spot.position[0]},${spot.position[1]}`;
                window.open(url, '_blank');
            }
        }
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
});