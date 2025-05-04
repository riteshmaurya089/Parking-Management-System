document.addEventListener('DOMContentLoaded', function() {
    // Sample booking data
    const bookings = {
        upcoming: [
            {
                id: 'SP-2023-06-0015',
                location: 'Downtown Parking Garage',
                address: '123 Main St, Anytown, USA',
                spot: 'A24 (Level 2)',
                date: 'June 15, 2023',
                time: '9:00 AM - 5:00 PM',
                duration: '8 hours',
                vehicle: 'Toyota Camry (ABC-1234)',
                price: 22.00,
                baseRate: 28.00,
                discount: 6.00,
                status: 'confirmed',
                features: ['Covered', 'Security'],
                position: [51.505, -0.09]
            },
            {
                id: 'SP-2023-06-0014',
                location: 'City Center Parking Lot',
                address: '456 Central Ave, Anytown, USA',
                spot: 'B12',
                date: 'June 18, 2023',
                time: '11:00 AM - 3:00 PM',
                duration: '4 hours',
                vehicle: 'Honda CR-V (XYZ-5678)',
                price: 14.00,
                baseRate: 16.00,
                discount: 2.00,
                status: 'confirmed',
                features: ['EV Charging'],
                position: [51.51, -0.1]
            }
        ],
        past: [
            {
                id: 'SP-2023-06-0005',
                location: 'Riverfront Parking',
                address: '789 Riverside Dr, Anytown, USA',
                spot: 'C07',
                date: 'June 5, 2023',
                time: '2:00 PM - 6:00 PM',
                duration: '4 hours',
                vehicle: 'Toyota Camry (ABC-1234)',
                price: 12.00,
                baseRate: 12.00,
                discount: 0.00,
                status: 'completed',
                features: [],
                position: [51.515, -0.08]
            }
        ],
        cancelled: []
    };

    // Initialize booking lists
    function renderBookings() {
        renderBookingList('upcoming', bookings.upcoming);
        renderBookingList('past', bookings.past);
        renderBookingList('cancelled', bookings.cancelled);
    }

    function renderBookingList(type, bookings) {
        const container = document.getElementById(`${type}Bookings`);
        if (!container) return;

        // Clear existing content except header
        const header = container.querySelector('h3');
        container.innerHTML = '';
        if (header) container.appendChild(header);

        if (bookings.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = `No ${type} reservations found.`;
            container.appendChild(emptyMsg);
            return;
        }

        bookings.forEach(booking => {
            const card = createBookingCard(booking, type);
            container.appendChild(card);
        });
    }

    function createBookingCard(booking, type) {
        const card = document.createElement('div');
        card.className = 'booking-card';
        card.dataset.bookingId = booking.id;

        const featuresHTML = booking.features.map(feature => {
            const icon = {
                "Covered": "fa-car",
                "Security": "fa-camera",
                "EV Charging": "fa-bolt",
                "Accessible": "fa-wheelchair"
            }[feature] || "fa-check";
            
            return `<span><i class="fas ${icon}"></i> ${feature}</span>`;
        }).join('');

        const statusClass = `status-${booking.status}`;
        const statusText = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);

        card.innerHTML = `
            <div class="booking-info">
                <div class="booking-location">
                    <h4>${booking.location}</h4>
                    <p>${booking.address}</p>
                    <div class="booking-features">${featuresHTML}</div>
                </div>
                <div class="booking-dates">
                    <p><strong>Date:</strong> ${booking.date}</p>
                    <p><strong>Time:</strong> ${booking.time}</p>
                    <p><strong>Spot:</strong> ${booking.spot}</p>
                </div>
                <div class="booking-price">
                    <p><strong>Total:</strong> $${booking.price.toFixed(2)}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${statusText}</span></p>
                </div>
            </div>
            <div class="booking-actions">
                ${type === 'upcoming' ? `
                    <button class="action-btn view-details">View Details</button>
                    <button class="action-btn cancel-booking">Cancel</button>
                    <button class="action-btn get-directions">Get Directions</button>
                ` : type === 'past' ? `
                    <button class="action-btn view-details">View Details</button>
                    <button class="action-btn view-receipt">View Receipt</button>
                    ${booking.status === 'completed' ? '<button class="action-btn leave-review">Leave Review</button>' : ''}
                ` : ''}
            </div>
        `;

        return card;
    }

    // Initialize booking tabs
    const tabButtons = document.querySelectorAll('.booking-tabs .tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const target = button.dataset.tab;
            document.querySelectorAll('.booking-list').forEach(list => {
                list.style.display = list.id === `${target}Bookings` ? 'block' : 'none';
            });
        });
    });

    // Booking details modal
    const bookingModal = document.getElementById('bookingModal');
    const closeModal = bookingModal.querySelector('.close');

    function showBookingDetails(booking) {
        document.getElementById('bookingId').textContent = booking.id;
        document.getElementById('bookingLocation').textContent = booking.location;
        document.getElementById('bookingDate').textContent = booking.date;
        document.getElementById('bookingTime').textContent = `${booking.time} (${booking.duration})`;
        document.getElementById('bookingSpot').textContent = booking.spot;
        document.getElementById('bookingVehicle').textContent = booking.vehicle;
        document.getElementById('bookingStatus').textContent = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
        document.getElementById('bookingStatus').className = `status-badge status-${booking.status}`;
        document.getElementById('bookingAddress').textContent = booking.address;

        // Pricing breakdown
        const priceGrid = document.getElementById('priceGrid');
        priceGrid.innerHTML = `
            <div class="price-item">
                <p>Base Rate (${booking.duration} @ $${(booking.baseRate / parseFloat(booking.duration)).toFixed(2)}/hr)</p>
                <p>$${booking.baseRate.toFixed(2)}</p>
            </div>
            ${booking.discount > 0 ? `
            <div class="price-item">
                <p>Discount</p>
                <p>-$${booking.discount.toFixed(2)}</p>
            </div>
            ` : ''}
            <div class="price-item total">
                <p><strong>Total Paid</strong></p>
                <p><strong>$${booking.price.toFixed(2)}</strong></p>
            </div>
        `;

        // Initialize mini map
        initMiniMap(booking.position);

        bookingModal.style.display = 'block';
    }

    function initMiniMap(position) {
        const mapContainer = document.getElementById('bookingMap');
        mapContainer.innerHTML = ''; // Clear previous map
        
        // In a real app, we would use Leaflet here
        // For demo purposes, we'll just show a static image
        mapContainer.style.backgroundImage = `url(https://maps.googleapis.com/maps/api/staticmap?center=${position[0]},${position[1]}&zoom=15&size=600x200&maptype=roadmap&markers=color:red%7C${position[0]},${position[1]}&key=YOUR_API_KEY)`;
        mapContainer.style.backgroundSize = 'cover';
        mapContainer.style.backgroundPosition = 'center';
    }

    // Event delegation for booking cards
    document.addEventListener('click', function(e) {
        const bookingCard = e.target.closest('.booking-card');
        if (!bookingCard) return;

        const bookingId = bookingCard.dataset.bookingId;
        const allBookings = [...bookings.upcoming, ...bookings.past, ...bookings.cancelled];
        const booking = allBookings.find(b => b.id === bookingId);
        if (!booking) return;

        // View Details button
        if (e.target.closest('.view-details')) {
            e.preventDefault();
            showBookingDetails(booking);
        }
        
        // Cancel Booking button
        else if (e.target.closest('.cancel-booking')) {
            if (confirm('Are you sure you want to cancel this booking?')) {
                // Move from upcoming to cancelled
                const index = bookings.upcoming.findIndex(b => b.id === bookingId);
                if (index !== -1) {
                    const cancelledBooking = bookings.upcoming.splice(index, 1)[0];
                    cancelledBooking.status = 'cancelled';
                    bookings.cancelled.push(cancelledBooking);
                    renderBookings();
                    showToast('Booking cancelled successfully', 'success');
                }
            }
        }
        
        // Get Directions button
        else if (e.target.closest('.get-directions')) {
            e.preventDefault();
            const url = `https://www.google.com/maps/dir/?api=1&destination=${booking.position[0]},${booking.position[1]}`;
            window.open(url, '_blank');
        }
        
        // View Receipt button
        else if (e.target.closest('.view-receipt')) {
            e.preventDefault();
            showToast('Receipt opened in new window', 'info');
            // In a real app, this would open a PDF or receipt page
        }
        
        // Leave Review button
        else if (e.target.closest('.leave-review')) {
            e.preventDefault();
            showReviewModal(booking);
        }
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        bookingModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.style.display = 'none';
        }
    });

    // Review modal functionality
    function showReviewModal(booking) {
        const reviewModal = document.createElement('div');
        reviewModal.className = 'modal';
        reviewModal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <span class="close">&times;</span>
                <h2>Leave a Review</h2>
                <p>How was your experience at ${booking.location}?</p>
                
                <form id="reviewForm">
                    <div class="form-group">
                        <label>Rating</label>
                        <div class="rating-stars">
                            <i class="fas fa-star" data-rating="1"></i>
                            <i class="fas fa-star" data-rating="2"></i>
                            <i class="fas fa-star" data-rating="3"></i>
                            <i class="fas fa-star" data-rating="4"></i>
                            <i class="fas fa-star" data-rating="5"></i>
                        </div>
                        <input type="hidden" id="ratingValue" value="0">
                    </div>
                    
                    <div class="form-group">
                        <label for="reviewTitle">Title</label>
                        <input type="text" id="reviewTitle" placeholder="Summarize your experience" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="reviewText">Review</label>
                        <textarea id="reviewText" rows="5" placeholder="Share details of your experience..." required></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" class="cancel-btn">Cancel</button>
                        <button type="submit" class="cta-button">Submit Review</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(reviewModal);
        const closeBtn = reviewModal.querySelector('.close');
        const cancelBtn = reviewModal.querySelector('.cancel-btn');

        // Star rating interaction
        const stars = reviewModal.querySelectorAll('.rating-stars i');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.dataset.rating);
                document.getElementById('ratingValue').value = rating;
                
                stars.forEach((s, index) => {
                    s.classList.toggle('active', index < rating);
                });
            });
        });

        // Form submission
        reviewModal.querySelector('#reviewForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const rating = document.getElementById('ratingValue').value;
            const title = document.getElementById('reviewTitle').value;
            const text = document.getElementById('reviewText').value;
            
            if (rating === '0') {
                showToast('Please select a rating', 'error');
                return;
            }
            
            // In a real app, you would send this to your backend
            console.log('Review submitted:', { rating, title, text });
            showToast('Thank you for your review!', 'success');
            reviewModal.remove();
        });

        // Close modal
        function closeReviewModal() {
            reviewModal.remove();
        }

        closeBtn.addEventListener('click', closeReviewModal);
        cancelBtn.addEventListener('click', closeReviewModal);

        window.addEventListener('click', (e) => {
            if (e.target === reviewModal) {
                closeReviewModal();
            }
        });
    }

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

    // Initialize the page
    renderBookings();
});