document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    const adminMain = document.querySelector('.admin-main');
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    const adminProfile = document.querySelector('.admin-profile');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const menuItems = document.querySelectorAll('.sidebar-menu li a');
    const sections = document.querySelectorAll('.dashboard-section');
    const addParkingSpotBtn = document.getElementById('addParkingSpot');
    const parkingSpotModal = document.getElementById('parkingSpotModal');
    const modalSpotTitle = document.getElementById('modalSpotTitle');
    const parkingSpotForm = document.getElementById('parkingSpotForm');
    const closeModalBtns = document.querySelectorAll('.close, .cancel-btn');

    // Initialize DataTables
    const recentReservationsTable = $('#recentReservations').DataTable({
        responsive: true,
        paging: false,
        searching: false,
        info: false,
        order: [[0, 'desc']],
        columnDefs: [
            { orderable: false, targets: [7] } // Disable sorting on actions column
        ]
    });

    const parkingSpotsTable = $('#parkingSpotsTable').DataTable({
        responsive: true,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        order: [[0, 'asc']],
        columnDefs: [
            { orderable: false, targets: [7] } // Disable sorting on actions column
        ]
    });

    // Search functionality for parking spots
    document.getElementById('spotSearch').addEventListener('keyup', function() {
        parkingSpotsTable.search(this.value).draw();
    });

    // Sidebar toggle for mobile
    sidebarToggle.addEventListener('click', function() {
        adminSidebar.classList.toggle('active');
    });

    // Notifications dropdown
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationDropdown.style.display = notificationDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Profile dropdown
    adminProfile.addEventListener('click', function(e) {
        e.stopPropagation();
        profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        notificationDropdown.style.display = 'none';
        profileDropdown.style.display = 'none';
    });

    // Tab navigation
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all menu items
            menuItems.forEach(i => i.parentElement.classList.remove('active'));
            
            // Add active class to clicked menu item
            this.parentElement.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show the selected section
            const targetSection = document.querySelector(this.getAttribute('href'));
            if (targetSection) {
                targetSection.style.display = 'block';
            }
        });
    });

    // Add Parking Spot Modal
    addParkingSpotBtn.addEventListener('click', function() {
        modalSpotTitle.textContent = 'Add New Parking Spot';
        parkingSpotForm.reset();
        parkingSpotModal.style.display = 'block';
    });

    // Edit Parking Spot (event delegation for dynamically added buttons)
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn.edit')) {
            const row = e.target.closest('tr');
            const rowData = parkingSpotsTable.row(row).data();
            
            // Fill the form with row data
            modalSpotTitle.textContent = 'Edit Parking Spot';
            document.getElementById('spotLocation').value = rowData[1].toLowerCase().includes('downtown') ? 'downtown' : 
                                                         rowData[1].toLowerCase().includes('city center') ? 'citycenter' :
                                                         rowData[1].toLowerCase().includes('riverfront') ? 'riverfront' : 'mall';
            document.getElementById('spotCode').value = rowData[2];
            document.getElementById('spotType').value = rowData[3].toLowerCase().includes('standard') ? 'standard' :
                                                      rowData[3].toLowerCase().includes('ev') ? 'ev' :
                                                      rowData[3].toLowerCase().includes('accessible') ? 'accessible' :
                                                      rowData[3].toLowerCase().includes('truck') ? 'truck' : 'motorcycle';
            document.getElementById('spotStatus').value = rowData[4].toLowerCase().includes('available') ? 'available' :
                                                        rowData[4].toLowerCase().includes('reserved') ? 'reserved' : 'unavailable';
            document.getElementById('spotPrice').value = parseFloat(rowData[5].replace('$', ''));
            document.getElementById('spotMaxDaily').value = parseFloat(rowData[5].replace('$', '')) * 8; // Assuming 8 hour day
            
            // Check features checkboxes
            const features = rowData[6].toLowerCase();
            document.querySelectorAll('input[name="spotFeatures"]').forEach(checkbox => {
                checkbox.checked = features.includes(checkbox.value);
            });
            
            parkingSpotModal.style.display = 'block';
        }
        
        // Delete Parking Spot
        if (e.target.closest('.action-btn.delete')) {
            if (confirm('Are you sure you want to delete this parking spot?')) {
                const row = e.target.closest('tr');
                parkingSpotsTable.row(row).remove().draw();
                showToast('Parking spot deleted successfully', 'success');
            }
        }
    });

    // Close Modal
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            parkingSpotModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === parkingSpotModal) {
            parkingSpotModal.style.display = 'none';
        }
    });

    // Parking Spot Form Submission
    parkingSpotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const location = document.getElementById('spotLocation').value;
        const code = document.getElementById('spotCode').value;
        const type = document.getElementById('spotType').value;
        const status = document.getElementById('spotStatus').value;
        const price = document.getElementById('spotPrice').value;
        const maxDaily = document.getElementById('spotMaxDaily').value;
        
        // Get selected features
        const features = [];
        document.querySelectorAll('input[name="spotFeatures"]:checked').forEach(checkbox => {
            features.push(checkbox.value);
        });
        
        // Format data for table
        const locationText = {
            'downtown': 'Downtown Garage, Level 2',
            'citycenter': 'City Center Lot',
            'riverfront': 'Riverfront Parking',
            'mall': 'Mall Parking'
        }[location];
        
        const typeText = {
            'standard': 'Standard',
            'ev': 'EV Charging',
            'accessible': 'Accessible',
            'truck': 'Truck',
            'motorcycle': 'Motorcycle'
        }[type];
        
        const statusBadge = {
            'available': '<span class="status-badge available">Available</span>',
            'reserved': '<span class="status-badge reserved">Reserved</span>',
            'unavailable': '<span class="status-badge unavailable">Unavailable</span>'
        }[status];
        
        const priceText = `$${parseFloat(price).toFixed(2)}`;
        
        // Create features HTML
        let featuresHtml = '';
        if (features.includes('covered')) featuresHtml += '<span class="feature-badge"><i class="fas fa-car"></i></span>';
        if (features.includes('security')) featuresHtml += '<span class="feature-badge"><i class="fas fa-camera"></i></span>';
        if (features.includes('ev')) featuresHtml += '<span class="feature-badge"><i class="fas fa-bolt"></i></span>';
        if (features.includes('accessible')) featuresHtml += '<span class="feature-badge"><i class="fas fa-wheelchair"></i></span>';
        
        // Actions HTML
        const actionsHtml = `
            <button class="action-btn view"><i class="fas fa-eye"></i></button>
            <button class="action-btn edit"><i class="fas fa-edit"></i></button>
            <button class="action-btn delete"><i class="fas fa-trash"></i></button>
        `;
        
        // Check if we're editing or adding new
        if (modalSpotTitle.textContent.includes('Edit')) {
            // Find and update the existing row
            const row = parkingSpotsTable.row($('tr.selected'));
            row.data([
                row.data()[0], // Keep the same ID
                locationText,
                code,
                typeText,
                statusBadge,
                priceText,
                featuresHtml,
                actionsHtml
            ]).draw();
        } else {
            // Add new row
            const newId = 'PS' + (parkingSpotsTable.data().length + 1).toString().padStart(3, '0');
            parkingSpotsTable.row.add([
                newId,
                locationText,
                code,
                typeText,
                statusBadge,
                priceText,
                featuresHtml,
                actionsHtml
            ]).draw();
        }
        
        // Close modal and show success message
        parkingSpotModal.style.display = 'none';
        showToast('Parking spot saved successfully', 'success');
    });

    // Initialize Charts
    const reservationsCtx = document.getElementById('reservationsChart').getContext('2d');
    const reservationsChart = new Chart(reservationsCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Reservations',
                data: [45, 60, 75, 80, 90, 110, 85],
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(revenueCtx, {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Revenue ($)',
                data: [850, 1120, 1350, 1420, 1680, 2100, 1750],
                backgroundColor: 'rgba(46, 204, 113, 0.7)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true,
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Period selector for charts
    document.getElementById('reservationPeriod').addEventListener('change', function() {
        // In a real app, you would fetch new data based on the selected period
        const periods = {
            'week': [45, 60, 75, 80, 90, 110, 85],
            'month': [320, 350, 380, 400, 420, 450, 470, 500, 520, 550, 580, 600, 620, 650, 680, 700, 720, 750, 780, 800, 820, 850, 880, 900, 920, 950, 980, 1000],
            'year': [2500, 2700, 3000, 3200, 3500, 3800, 4000, 4200, 4500, 4800, 5000, 5200]
        };
        
        reservationsChart.data.labels = this.value === 'week' ? 
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            this.value === 'month' ? 
                Array.from({length: 28}, (_, i) => (i + 1).toString()) :
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        reservationsChart.data.datasets[0].data = periods[this.value];
        reservationsChart.update();
    });

    document.getElementById('revenuePeriod').addEventListener('change', function() {
        // In a real app, you would fetch new data based on the selected period
        const periods = {
            'week': [850, 1120, 1350, 1420, 1680, 2100, 1750],
            'month': [5800, 6200, 6500, 6800, 7200, 7500, 7800, 8200, 8500, 8800, 9200, 9500, 9800, 10200, 10500, 10800, 11200, 11500, 11800, 12200, 12500, 12800, 13200, 13500, 13800, 14200, 14500, 14800],
            'year': [32000, 35000, 38000, 40000, 42000, 45000, 48000, 50000, 52000, 55000, 58000, 60000]
        };
        
        revenueChart.data.labels = this.value === 'week' ? 
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] :
            this.value === 'month' ? 
                Array.from({length: 28}, (_, i) => (i + 1).toString()) :
                ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        revenueChart.data.datasets[0].data = periods[this.value];
        revenueChart.update();
    });

    // Helper function to show toast messages
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

    // Add some sample data to tables
    function initializeSampleData() {
        // Sample parking spots data
        const sampleParkingSpots = [
            {
                id: 'PS001',
                location: 'Downtown Garage, Level 2',
                code: 'A24',
                type: 'Standard',
                status: 'available',
                price: '$3.50',
                features: ['covered', 'security']
            },
            {
                id: 'PS002',
                location: 'City Center Lot',
                code: 'B12',
                type: 'EV Charging',
                status: 'reserved',
                price: '$4.00',
                features: ['ev']
            },
            {
                id: 'PS003',
                location: 'Riverfront Parking',
                code: 'C07',
                type: 'Standard',
                status: 'unavailable',
                price: '$3.00',
                features: []
            },
            {
                id: 'PS004',
                location: 'Mall Parking',
                code: 'D15',
                type: 'Accessible',
                status: 'available',
                price: '$3.50',
                features: ['accessible']
            }
        ];

        // Add sample data to parking spots table
        sampleParkingSpots.forEach(spot => {
            const statusBadge = {
                'available': '<span class="status-badge available">Available</span>',
                'reserved': '<span class="status-badge reserved">Reserved</span>',
                'unavailable': '<span class="status-badge unavailable">Unavailable</span>'
            }[spot.status];

            let featuresHtml = '';
            if (spot.features.includes('covered')) featuresHtml += '<span class="feature-badge"><i class="fas fa-car"></i></span>';
            if (spot.features.includes('security')) featuresHtml += '<span class="feature-badge"><i class="fas fa-camera"></i></span>';
            if (spot.features.includes('ev')) featuresHtml += '<span class="feature-badge"><i class="fas fa-bolt"></i></span>';
            if (spot.features.includes('accessible')) featuresHtml += '<span class="feature-badge"><i class="fas fa-wheelchair"></i></span>';

            parkingSpotsTable.row.add([
                spot.id,
                spot.location,
                spot.code,
                spot.type,
                statusBadge,
                spot.price,
                featuresHtml,
                `<button class="action-btn view"><i class="fas fa-eye"></i></button>
                 <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                 <button class="action-btn delete"><i class="fas fa-trash"></i></button>`
            ]).draw();
        });
    }

    // Initialize sample data
    initializeSampleData();
});