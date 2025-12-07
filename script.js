// DOM Elements
const pageSections = document.querySelectorAll('.page-section');
const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('main-menu');
const announcementContent = document.getElementById('announcement-content');
const pauseButton = document.getElementById('pause-announcement');
const contactForm = document.getElementById('contact-form');
const faqItems = document.querySelectorAll('.faq-item');
const schemeCards = document.querySelectorAll('.scheme-card');
const serviceCards = document.querySelectorAll('.service-card, .citizen-service-card');
const backButton = document.getElementById('back-button');
const stopReadingButton = document.getElementById('stop-reading');

// Authentication Elements
const authModal = document.getElementById('auth-modal');
const userLoginForm = document.getElementById('user-login-form');
const adminLoginForm = document.getElementById('admin-login-form');
const signupForm = document.getElementById('signup-form');
const grievanceModal = document.getElementById('grievance-modal');
const grievanceForm = document.getElementById('grievance-form');

// Admin Panel Elements
const adminNavButtons = document.querySelectorAll('.admin-nav button');
const adminContentSections = document.querySelectorAll('.admin-content');

// User State
let isLoggedIn = false;
let isAdmin = false;
let currentUser = null;
let users = [];
let userActivities = [];
let feedbacks = [];
let contentItems = [];
let navigationHistory = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkLoginStatus();
    
    // Initialize data
    initializeData();
    
    // Set initial focus on main content when using skip link
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('main-content').focus();
        });
    }
    
    // Initialize page navigation
    initPageNavigation();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize accessibility tools
    initAccessibilityTools();
    
    // Initialize announcement ticker
    initAnnouncementTicker();
    
    // Initialize form validation
    initFormValidation();
    
    // Initialize FAQ accordion
    initFaqAccordion();
    
    // Initialize scheme filtering
    initSchemeFiltering();
    
    // Initialize keyboard shortcuts
    initKeyboardShortcuts();
    
    // Initialize voice reader
    initVoiceReader();
    
    // Initialize service cards
    initServiceCards();
    
    // Initialize language switcher
    initLanguageSwitcher();
    
    // Initialize authentication forms
    initAuthForms();
    
    // Initialize grievance form
    initGrievanceForm();
    
    // Initialize admin panel
    initAdminPanel();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize back button
    initBackButton();
    
    // Hide back button initially
    backButton.style.display = 'none';
    
    // Load saved text size
    loadTextSize();
});

// Initialize Data
function initializeData() {
    // Load data from localStorage or initialize with empty arrays
    users = JSON.parse(localStorage.getItem('users')) || [];
    userActivities = JSON.parse(localStorage.getItem('userActivities')) || [];
    feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    contentItems = JSON.parse(localStorage.getItem('contentItems')) || [
        { id: 1, title: 'New Agricultural Support Scheme launched', type: 'announcement', category: 'agriculture', status: 'active', createdDate: '2023-06-01' },
        { id: 2, title: 'Digital Literacy Program extended', type: 'announcement', category: 'education', status: 'active', createdDate: '2023-06-05' },
        { id: 3, title: 'Health Insurance coverage expanded', type: 'announcement', category: 'health', status: 'active', createdDate: '2023-06-08' }
    ];
    
    // Add sample users if none exist
    if (users.length === 0) {
        users = [
            {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                role: 'user',
                status: 'active',
                registrationDate: '2023-01-15'
            },
            {
                id: 2,
                name: 'Admin User',
                email: 'admin@gov.in',
                password: 'admin123',
                role: 'admin',
                status: 'active',
                registrationDate: '2023-01-10'
            }
        ];
    }
    
    // Add sample feedbacks if none exist
    if (feedbacks.length === 0) {
        feedbacks = [
            {
                id: 1,
                userId: 1,
                name: 'John Doe',
                email: 'john@example.com',
                type: 'complaint',
                subject: 'Issue with scheme application',
                message: 'I am facing issues while applying for the PM-KISAN scheme. The form is not loading properly.',
                status: 'pending',
                date: '2023-06-10'
            },
            {
                id: 2,
                userId: 1,
                name: 'Jane Smith',
                email: 'jane@example.com',
                type: 'suggestion',
                subject: 'Improve website accessibility',
                message: 'The website could be more accessible for users with visual impairments. Please consider adding more contrast options.',
                status: 'pending',
                date: '2023-06-12'
            }
        ];
    }
    
    // Save data to localStorage
    saveData();
}

// Save Data
function saveData() {
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('userActivities', JSON.stringify(userActivities));
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    localStorage.setItem('contentItems', JSON.stringify(contentItems));
}

// Check Login Status
function checkLoginStatus() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        isLoggedIn = true;
        isAdmin = currentUser.role === 'admin';
        updateUserInterface();
    }
}

// Update User Interface
function updateUserInterface() {
    const authButtons = document.getElementById('auth-buttons');
    const userInfo = document.getElementById('user-info');
    const dashboardNav = document.getElementById('dashboard-nav');
    const adminNav = document.getElementById('admin-nav');
    
    if (isLoggedIn && currentUser) {
        authButtons.classList.add('hidden');
        userInfo.classList.add('active');
        dashboardNav.style.display = 'block';
        
        // Update user name and avatar
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('dashboard-user-name').textContent = currentUser.name;
        document.getElementById('user-avatar').textContent = currentUser.name.charAt(0).toUpperCase();
        
        // Show admin panel if user is admin
        if (isAdmin) {
            adminNav.style.display = 'block';
            document.getElementById('user-avatar').classList.add('admin-avatar');
            document.getElementById('admin-welcome').textContent = `Welcome, ${currentUser.name}`;
            
            // Auto-redirect to admin panel for admin users
            if (window.location.hash !== '#admin') {
                showPage('admin');
            }
        }
        
        // Update dashboard stats
        updateDashboardStats();
    } else {
        authButtons.classList.remove('hidden');
        userInfo.classList.remove('active');
        dashboardNav.style.display = 'none';
        adminNav.style.display = 'none';
    }
}

// Update Dashboard Stats
function updateDashboardStats() {
    // Get user-specific data
    const userApplications = userActivities.filter(a => a.userId === currentUser.id && a.action === 'Apply Scheme');
    const userDownloads = userActivities.filter(a => a.userId === currentUser.id && a.action === 'Download Form');
    
    // Update dashboard counters
    document.getElementById('applications-count').textContent = userApplications.length;
    document.getElementById('approved-count').textContent = Math.floor(userApplications.length * 0.6);
    document.getElementById('pending-count').textContent = Math.floor(userApplications.length * 0.4);
    document.getElementById('downloads-count').textContent = userDownloads.length;
    
    // Update admin stats if user is admin
    if (isAdmin) {
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('active-users').textContent = Math.floor(users.length * 0.7);
        document.getElementById('total-applications').textContent = userActivities.filter(a => a.action === 'Apply Scheme').length;
        document.getElementById('pending-feedback').textContent = feedbacks.filter(f => f.status === 'pending').length;
    }
}

// Open Authentication Modal
function openAuthModal(tab) {
    authModal.setAttribute('aria-hidden', 'false');
    authModal.style.display = 'block';
    
    // Set active tab
    switchAuthTab(tab);
    
    // Focus on first form element
    const firstInput = document.querySelector(`#${tab}-form input`);
    if (firstInput) {
        firstInput.focus();
    }
}

// Close Authentication Modal
function closeAuthModal() {
    authModal.setAttribute('aria-hidden', 'true');
    authModal.style.display = 'none';
}

// Switch Authentication Tab
function switchAuthTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}-form`).classList.add('active');
}

// Initialize Authentication Forms
function initAuthForms() {
    // User login form submission
    userLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('user-login-email').value;
        const password = document.getElementById('user-login-password').value;
        
        // Find user in database
        const user = users.find(u => u.email === email && u.password === password && u.role === 'user');
        
        if (user) {
            // Set current user
            currentUser = user;
            isAdmin = false;
            isLoggedIn = true;
            
            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Log activity
            logUserActivity(user.id, 'Login', `User logged in from ${navigator.userAgent}`);
            
            // Update state
            updateUserInterface();
            
            // Close modal
            closeAuthModal();
            
            // Show notification
            showNotification('Login successful! Welcome back.', 'success');
            
            // Navigate to dashboard
            showPage('dashboard');
        } else {
            showNotification('Invalid email or password', 'error');
        }
    });
    
    // Admin login form submission
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const username = document.getElementById('admin-login-username').value;
        const password = document.getElementById('admin-login-password').value;
        
        // Check if credentials match admin pattern (email ends with @gov.in or password contains "admin")
        const isAdminUser = username.endsWith('@gov.in') || password.toLowerCase().includes('admin');
        
        // Find admin in database - check both email and name
        let admin = users.find(u => 
            (u.email === username || u.name.toLowerCase() === username.toLowerCase()) && 
            u.password === password && 
            u.role === 'admin'
        );
        
        // If no admin found but credentials match admin pattern, create a default admin
        if (!admin && isAdminUser) {
            admin = {
                id: users.length + 1,
                name: 'System Administrator',
                email: username.includes('@') ? username : `admin${users.length + 1}@gov.in`,
                password: password,
                role: 'admin',
                status: 'active',
                registrationDate: new Date().toISOString().split('T')[0]
            };
            
            users.push(admin);
            saveData();
        }
        
        if (admin) {
            // Set current user
            currentUser = admin;
            isAdmin = true;
            isLoggedIn = true;
            
            // Save to localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Log activity
            logUserActivity(admin.id, 'Admin Login', `Admin logged in from ${navigator.userAgent}`);
            
            // Update state
            updateUserInterface();
            
            // Close modal
            closeAuthModal();
            
            // Show notification
            showNotification('Admin login successful! Welcome to Admin Panel.', 'success');
            
            // Navigate to admin panel
            showPage('admin');
        } else {
            showNotification('Invalid admin credentials', 'error');
        }
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;
        const agreeTerms = document.getElementById('agree-terms').checked;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            return;
        }
        
        // Validate terms agreement
        if (!agreeTerms) {
            showNotification('You must agree to terms and conditions', 'error');
            return;
        }
        
        // Check if user already exists
        if (users.some(u => u.email === email)) {
            showNotification('User with this email already exists', 'error');
            return;
        }
        
        // Create new user
        const newUser = {
            id: users.length + 1,
            name: name,
            email: email,
            phone: phone,
            password: password,
            role: 'user',
            status: 'active',
            registrationDate: new Date().toISOString().split('T')[0]
        };
        
        // Add to users array
        users.push(newUser);
        
        // Save to localStorage
        saveData();
        
        // Log activity
        logUserActivity(newUser.id, 'Registration', `New user registered from ${navigator.userAgent}`);
        
        // Set current user
        currentUser = newUser;
        isAdmin = false;
        isLoggedIn = true;
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Update state
        updateUserInterface();
        
        // Close modal
        closeAuthModal();
        
        // Show notification
        showNotification('Account created successfully! Welcome to Government of India Portal.', 'success');
        
        // Navigate to dashboard
        showPage('dashboard');
    });
}

// Logout
function logout() {
    // Log activity before logout
    if (isLoggedIn && currentUser) {
        logUserActivity(currentUser.id, 'Logout', `User logged out from ${navigator.userAgent}`);
    }
    
    // Clear user data
    localStorage.removeItem('currentUser');
    currentUser = null;
    isLoggedIn = false;
    isAdmin = false;
    
    // Update UI
    updateUserInterface();
    
    // Show notification
    showNotification('You have been logged out successfully.', 'info');
    
    // Navigate to home
    showPage('home');
}

// Forgot Password
function forgotPassword() {
    showNotification('Password reset link has been sent to your email address.', 'info');
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.nextElementSibling;
    const icon = toggleButton.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Log User Activity
function logUserActivity(userId, action, details) {
    const activity = {
        id: userActivities.length + 1,
        userId: userId,
        action: action,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        details: details
    };
    
    userActivities.push(activity);
    saveData();
}

// In the initAdminPanel function, fix the content ID mapping
function initAdminPanel() {
    // Admin navigation
    adminNavButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            adminNavButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Map button text to correct content ID
            let contentId;
            const buttonText = this.textContent.toLowerCase().trim();
            
            switch(buttonText) {
                case 'dashboard':
                    contentId = 'dashboard';
                    break;
                case 'user management':
                    contentId = 'users';
                    break;
                case 'user activity':
                    contentId = 'activity';
                    break;
                case 'content management':
                    contentId = 'content';
                    break;
                case 'feedback':
                    contentId = 'feedback';
                    break;
                case 'analytics':
                    contentId = 'analytics';
                    break;
                default:
                    contentId = buttonText.replace(' ', '-');
            }
            
            // Show corresponding content
            showAdminContent(contentId);
        });
    });
    
    // Rest of the function remains the same...
}

// Fix the showAdminContent function to properly find and display sections
function showAdminContent(contentId) {
    // Hide all admin content sections
    adminContentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected content - fix the ID matching
    const targetSection = document.getElementById(`admin-${contentId}`);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Load content based on section
        switch(contentId) {
            case 'dashboard':
                updateAdminDashboard();
                break;
            case 'users':
                loadUsersTable();
                break;
            case 'activity':
                loadActivityLog();
                break;
            case 'content':
                loadContentTable();
                break;
            case 'feedback':
                loadFeedbackList();
                break;
            case 'analytics':
                // Analytics data is static for demo
                break;
        }
    } else {
        console.error(`Admin section with ID admin-${contentId} not found`);
    }
}

// Fix the loadUsersTable function to properly populate the table
function loadUsersTable() {
    const tbody = document.getElementById('users-tbody');
    if (!tbody) {
        console.error('users-tbody element not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
            <td>${user.registrationDate}</td>
            <td class="actions">
                <button class="edit" onclick="editUser(${user.id})">Edit</button>
                <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Update user filter dropdown
    const userFilter = document.getElementById('activity-user');
    if (userFilter) {
        userFilter.innerHTML = '<option value="all">All Users</option>';
        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.name;
            userFilter.appendChild(option);
        });
    }
}

// Fix the loadActivityLog function to properly populate the log
function loadActivityLog() {
    const logContainer = document.getElementById('activity-log');
    const adminLogContainer = document.getElementById('user-activity-log');
    
    // Get activities to display
    let activities = userActivities;
    
    // If filtering by user
    const userIdFilter = document.getElementById('activity-user');
    if (userIdFilter && userIdFilter.value !== 'all') {
        activities = activities.filter(a => a.userId == userIdFilter.value);
    }
    
    // If filtering by date range
    const dateFromFilter = document.getElementById('activity-date-from');
    const dateToFilter = document.getElementById('activity-date-to');
    if (dateFromFilter && dateFromFilter.value && dateToFilter && dateToFilter.value) {
        activities = activities.filter(a => {
            const activityDate = a.timestamp.split(' ')[0];
            return activityDate >= dateFromFilter.value && activityDate <= dateToFilter.value;
        });
    }
    
    // Sort by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Generate HTML
    let html = '';
    activities.slice(0, 20).forEach(activity => {
        const user = users.find(u => u.id === activity.userId);
        const userName = user ? user.name : 'Unknown User';
        
        html += `
            <div class="log-entry">
                <div>
                    <strong>${userName}</strong> - ${activity.action}
                    <div>${activity.details}</div>
                </div>
                <div class="timestamp">${activity.timestamp}</div>
            </div>
        `;
    });
    
    // Update container
    if (logContainer) logContainer.innerHTML = html;
    if (adminLogContainer) adminLogContainer.innerHTML = html;
}

// Fix the loadContentTable function to properly populate the table
function loadContentTable() {
    const tbody = document.getElementById('content-tbody');
    if (!tbody) {
        console.error('content-tbody element not found');
        return;
    }
    
    tbody.innerHTML = '';
    
    contentItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.type}</td>
            <td>${item.category}</td>
            <td>${item.status}</td>
            <td>${item.createdDate}</td>
            <td class="actions">
                <button class="edit" onclick="editContent(${item.id})">Edit</button>
                <button class="delete" onclick="deleteContent(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Fix the updateAdminDashboard function to properly update the dashboard
function updateAdminDashboard() {
    // Update stats
    const totalUsersElement = document.getElementById('total-users');
    if (totalUsersElement) totalUsersElement.textContent = users.length;
    
    const activeUsersElement = document.getElementById('active-users');
    if (activeUsersElement) activeUsersElement.textContent = users.filter(u => u.status === 'active').length;
    
    const totalApplicationsElement = document.getElementById('total-applications');
    if (totalApplicationsElement) totalApplicationsElement.textContent = userActivities.filter(a => a.action === 'Apply Scheme').length;
    
    const pendingFeedbackElement = document.getElementById('pending-feedback');
    if (pendingFeedbackElement) pendingFeedbackElement.textContent = feedbacks.filter(f => f.status === 'pending').length;
    
    // Generate user activity chart
    generateUserActivityChart();
    
    // Load activity log
    loadActivityLog();
}

// Fix the generateUserActivityChart function to properly generate the chart
function generateUserActivityChart() {
    const chartContainer = document.getElementById('user-activity-chart');
    if (!chartContainer) {
        console.error('user-activity-chart element not found');
        return;
    }
    
    chartContainer.innerHTML = '';
    
    // Generate sample data for last 7 days
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = [65, 78, 90, 81, 56, 95, 88];
    
    days.forEach((day, index) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar';
        bar.style.height = `${values[index]}%`;
        
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = day;
        
        const value = document.createElement('div');
        value.className = 'value';
        value.textContent = values[index];
        
        bar.appendChild(label);
        bar.appendChild(value);
        chartContainer.appendChild(bar);
    });
}

// Fix the loadFeedbackList function to properly populate the feedback list
function loadFeedbackList() {
    const feedbackList = document.getElementById('feedback-list');
    if (!feedbackList) {
        console.error('feedback-list element not found');
        return;
    }
    
    feedbackList.innerHTML = '';
    
    // Get feedbacks to display
    let filteredFeedbacks = feedbacks;
    
    // If filtering by status
    const statusFilter = document.getElementById('feedback-status');
    if (statusFilter && statusFilter.value !== 'all') {
        filteredFeedbacks = filteredFeedbacks.filter(f => f.status === statusFilter.value);
    }
    
    // If filtering by type
    const typeFilter = document.getElementById('feedback-type');
    if (typeFilter && typeFilter.value !== 'all') {
        filteredFeedbacks = filteredFeedbacks.filter(f => f.type === typeFilter.value);
    }
    
    // Sort by date (newest first)
    filteredFeedbacks.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate HTML
    filteredFeedbacks.forEach(feedback => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <div class="feedback-header">
                <div class="feedback-user">${feedback.name}</div>
                <div class="feedback-date">${feedback.date}</div>
            </div>
            <div class="feedback-content">
                <strong>${feedback.subject}</strong>
                <p>${feedback.message}</p>
            </div>
            <div class="feedback-actions">
                <button class="approve" onclick="approveFeedback(${feedback.id})">Approve</button>
                <button class="reject" onclick="rejectFeedback(${feedback.id})">Reject</button>
            </div>
        `;
        feedbackList.appendChild(feedbackItem);
    });
}

// Filter Activity
function filterActivity() {
    loadActivityLog();
}

// Load Content Table
function loadContentTable() {
    const tbody = document.getElementById('content-tbody');
    tbody.innerHTML = '';
    
    contentItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.title}</td>
            <td>${item.type}</td>
            <td>${item.category}</td>
            <td>${item.status}</td>
            <td>${item.createdDate}</td>
            <td class="actions">
                <button class="edit" onclick="editContent(${item.id})">Edit</button>
                <button class="delete" onclick="deleteContent(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Load Content Form
function loadContentForm() {
    const contentType = document.getElementById('content-type').value;
    const contentAction = document.getElementById('content-action').value;
    
    // Show form container
    document.getElementById('content-form-container').style.display = 'block';
    
    // Update form title
    document.getElementById('content-form-title').textContent = 
        contentAction === 'add' ? 'Add New Content' : 'Edit Content';
    
    // Reset form
    document.getElementById('content-form').reset();
    
    // If editing, load existing content
    if (contentAction === 'edit') {
        // In a real application, this would load the selected content
        // For demo purposes, we'll just show a notification
        showNotification('Select a content item to edit', 'info');
    }
}

// Cancel Content Form
function cancelContentForm() {
    document.getElementById('content-form-container').style.display = 'none';
}

// Edit Content
function editContent(contentId) {
    const content = contentItems.find(c => c.id === contentId);
    if (!content) return;
    
    // Show form container
    document.getElementById('content-form-container').style.display = 'block';
    
    // Update form title
    document.getElementById('content-form-title').textContent = 'Edit Content';
    
    // Fill form with content data
    document.getElementById('content-title').value = content.title;
    document.getElementById('content-description').value = content.description || '';
    document.getElementById('content-category').value = content.category;
    document.getElementById('content-status').value = content.status;
    document.getElementById('content-type').value = content.type;
    document.getElementById('content-action').value = 'edit';
    
    // Update form action
    document.getElementById('content-form').setAttribute('data-content-id', contentId);
}

// Delete Content
function deleteContent(contentId) {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    // Find and remove content
    const index = contentItems.findIndex(c => c.id === contentId);
    if (index !== -1) {
        const content = contentItems[index];
        contentItems.splice(index, 1);
        
        // Save to localStorage
        saveData();
        
        // Log activity
        logUserActivity(currentUser.id, 'Delete Content', `Deleted ${content.type}: ${content.title}`);
        
        // Reload table
        loadContentTable();
        
        // Show notification
        showNotification(`Content "${content.title}" has been deleted`, 'success');
    }
}

// Load Feedback List
function loadFeedbackList() {
    const feedbackList = document.getElementById('feedback-list');
    feedbackList.innerHTML = '';
    
    // Get feedbacks to display
    let filteredFeedbacks = feedbacks;
    
    // If filtering by status
    const statusFilter = document.getElementById('feedback-status');
    if (statusFilter && statusFilter.value !== 'all') {
        filteredFeedbacks = filteredFeedbacks.filter(f => f.status === statusFilter.value);
    }
    
    // If filtering by type
    const typeFilter = document.getElementById('feedback-type');
    if (typeFilter && typeFilter.value !== 'all') {
        filteredFeedbacks = filteredFeedbacks.filter(f => f.type === typeFilter.value);
    }
    
    // Sort by date (newest first)
    filteredFeedbacks.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate HTML
    filteredFeedbacks.forEach(feedback => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = 'feedback-item';
        feedbackItem.innerHTML = `
            <div class="feedback-header">
                <div class="feedback-user">${feedback.name}</div>
                <div class="feedback-date">${feedback.date}</div>
            </div>
            <div class="feedback-content">
                <strong>${feedback.subject}</strong>
                <p>${feedback.message}</p>
            </div>
            <div class="feedback-actions">
                <button class="approve" onclick="approveFeedback(${feedback.id})">Approve</button>
                <button class="reject" onclick="rejectFeedback(${feedback.id})">Reject</button>
            </div>
        `;
        feedbackList.appendChild(feedbackItem);
    });
}

// Filter Feedback
function filterFeedback() {
    loadFeedbackList();
}

// Approve Feedback
function approveFeedback(feedbackId) {
    const feedback = feedbacks.find(f => f.id === feedbackId);
    if (!feedback) return;
    
    feedback.status = 'approved';
    saveData();
    
    // Log activity
    logUserActivity(currentUser.id, 'Approve Feedback', `Approved feedback from ${feedback.name}`);
    
    loadFeedbackList();
    showNotification(`Feedback from ${feedback.name} has been approved`, 'success');
}

// Reject Feedback
function rejectFeedback(feedbackId) {
    const feedback = feedbacks.find(f => f.id === feedbackId);
    if (!feedback) return;
    
    feedback.status = 'rejected';
    saveData();
    
    // Log activity
    logUserActivity(currentUser.id, 'Reject Feedback', `Rejected feedback from ${feedback.name}`);
    
    loadFeedbackList();
    showNotification(`Feedback from ${feedback.name} has been rejected`, 'success');
}

// Open Grievance Form
function openGrievanceForm() {
    grievanceModal.setAttribute('aria-hidden', 'false');
    grievanceModal.style.display = 'block';
    
    // Focus on first form element
    const firstInput = grievanceForm.querySelector('input');
    if (firstInput) {
        firstInput.focus();
    }
}

// Close Grievance Modal
function closeGrievanceModal() {
    grievanceModal.setAttribute('aria-hidden', 'true');
    grievanceModal.style.display = 'none';
}

// Initialize Grievance Form
function initGrievanceForm() {
    grievanceForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('grievance-name').value;
        const email = document.getElementById('grievance-email').value;
        const phone = document.getElementById('grievance-phone').value;
        const department = document.getElementById('grievance-department').value;
        const category = document.getElementById('grievance-category').value;
        const subject = document.getElementById('grievance-subject').value;
        const description = document.getElementById('grievance-description').value;
        
        // Validate form
        if (!name || !email || !phone || !department || !category || !subject || !description) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Generate reference number
        const refNumber = 'GRV' + Date.now().toString().substring(4);
        
        // Create feedback object
        const grievance = {
            id: feedbacks.length + 1,
            userId: isLoggedIn ? currentUser.id : null,
            name: name,
            email: email,
            phone: phone,
            department: department,
            category: category,
            subject: subject,
            message: description,
            type: 'complaint',
            status: 'pending',
            date: new Date().toISOString().split('T')[0],
            referenceNumber: refNumber
        };
        
        // Add to feedbacks array
        feedbacks.push(grievance);
        
        // Save to localStorage
        saveData();
        
        // Log activity if user is logged in
        if (isLoggedIn && currentUser) {
            logUserActivity(currentUser.id, 'Submit Grievance', `Submitted grievance: ${subject}`);
        }
        
        // Close modal
        closeGrievanceModal();
        
        // Show notification with reference number
        showNotification(`Grievance submitted successfully! Your reference number is ${refNumber}.`, 'success');
        
        // Reset form
        grievanceForm.reset();
    });
}

// Track Applications
function trackApplications() {
    if (!isLoggedIn) {
        showNotification('Please login to track your applications', 'warning');
        openAuthModal('user-login');
        return;
    }
    
    // Show user's applications
    const userApplications = userActivities.filter(a => 
        a.userId === currentUser.id && a.action === 'Apply Scheme'
    );
    
    if (userApplications.length === 0) {
        showNotification('You have not submitted any applications yet', 'info');
        return;
    }
    
    // Create a simple list of applications
    let applicationsList = 'Your Applications:\n\n';
    userApplications.forEach((app, index) => {
        applicationsList += `${index + 1}. ${app.details}\nDate: ${app.timestamp}\n\n`;
    });
    
    showNotification(applicationsList, 'info');
}

// Page Navigation
function initPageNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetPage = this.getAttribute('data-page');
            const targetSection = this.getAttribute('data-section');
            
            if (targetPage) {
                // Add to navigation history
                navigationHistory.push({
                    page: targetPage,
                    section: targetSection
                });
                
                showPage(targetPage);
                
                // If there's a specific section, navigate to it
                if (targetSection) {
                    setTimeout(() => {
                        showSection(targetSection);
                        // Scroll to section if it exists
                        const sectionElement = document.getElementById(targetSection);
                        if (sectionElement) {
                            sectionElement.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 100);
                }
                
                // Update active navigation state
                updateActiveNavigation(this);
                
                // Close mobile menu if open
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });
    
    // Footer links
    const footerLinks = document.querySelectorAll('footer a[data-page]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                // Add to navigation history
                navigationHistory.push({
                    page: targetPage,
                    section: null
                });
                
                showPage(targetPage);
            }
        });
    });
}

function showPage(pageId) {
    // Hide all page sections
    pageSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected page section
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // Scroll to top of main content
        document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
        
        // Announce page change for screen readers
        announceToScreenReader(`Navigated to ${pageId} page`);
        
        // Focus on page title for better accessibility
        const pageTitle = targetSection.querySelector('.section-title');
        if (pageTitle) {
            pageTitle.focus();
        }
        
        // Log activity if user is logged in
        if (isLoggedIn && currentUser) {
            logUserActivity(currentUser.id, 'Page Navigation', `Navigated to ${pageId} page`);
        }
        
        // Show/hide back button based on page
        if (pageId === 'home') {
            backButton.style.display = 'none';
        } else {
            backButton.style.display = 'flex';
        }
        
        // Initialize page-specific content
        if (pageId === 'admin' && isAdmin) {
            updateAdminDashboard();
        }
    }
}

function updateActiveNavigation(activeLink) {
    // Remove active class from all navigation links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to clicked link
    activeLink.classList.add('active');
    
    // If active link is a dropdown item, also mark its parent nav-link as active
    const parentNavItem = activeLink.closest('.nav-item');
    if (parentNavItem) {
        const parentNavLink = parentNavItem.querySelector('.nav-link');
        if (parentNavLink) {
            parentNavLink.classList.add('active');
        }
    }
}

// Initialize Back Button
function initBackButton() {
    backButton.addEventListener('click', function() {
        goBack();
    });
}

// Go Back Function
function goBack() {
    if (navigationHistory.length > 1) {
        // Remove current page from history
        navigationHistory.pop();
        
        // Get previous page from history
        const previousPage = navigationHistory[navigationHistory.length - 1];
        
        if (previousPage) {
            showPage(previousPage.page);
            
            // If there's a specific section, navigate to it
            if (previousPage.section) {
                setTimeout(() => {
                    showSection(previousPage.section);
                    // Scroll to section if it exists
                    const sectionElement = document.getElementById(previousPage.section);
                    if (sectionElement) {
                        sectionElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        }
    } else {
        // If no history, go to home
        showPage('home');
        navigationHistory = [];
    }
}

// Mobile Menu
function initMobileMenu() {
    menuToggle.addEventListener('click', function() {
        const isExpanded = navMenu.classList.toggle('active');
        this.setAttribute('aria-expanded', isExpanded);
    });
    
    // Handle dropdown menus in mobile view
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown');
        
        if (link && dropdown) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    
                    // Close other dropdowns
                    navItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    item.classList.toggle('active');
                }
            });
        }
    });
    
    // Handle dropdown item clicks in mobile view
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            // Close mobile menu after clicking a dropdown item
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
}

// Accessibility Tools
function initAccessibilityTools() {
    // Text Resize
    let currentTextSize = localStorage.getItem('textSize') || 100; // Default size in percentage
    
    document.getElementById('text-resize-decrease').addEventListener('click', function() {
        if (currentTextSize > 80) {
            currentTextSize -= 10;
            document.body.style.fontSize = `${currentTextSize}%`;
            localStorage.setItem('textSize', currentTextSize);
            announceToScreenReader(`Text size decreased to ${currentTextSize}%`);
        }
    });
    
    document.getElementById('text-resize-default').addEventListener('click', function() {
        currentTextSize = 100;
        document.body.style.fontSize = '100%';
        localStorage.setItem('textSize', currentTextSize);
        announceToScreenReader('Text size reset to default');
    });
    
    document.getElementById('text-resize-increase').addEventListener('click', function() {
        if (currentTextSize < 120) {
            currentTextSize += 10;
            document.body.style.fontSize = `${currentTextSize}%`;
            localStorage.setItem('textSize', currentTextSize);
            announceToScreenReader(`Text size increased to ${currentTextSize}%`);
        }
    });
    
    // High Contrast Mode
    document.getElementById('high-contrast-toggle').addEventListener('click', function() {
        document.body.classList.toggle('high-contrast');
        const isActive = document.body.classList.contains('high-contrast');
        localStorage.setItem('highContrast', isActive);
        announceToScreenReader(`High contrast mode ${isActive ? 'enabled' : 'disabled'}`);
    });
    
    // Dark Mode
    document.getElementById('dark-mode-toggle').addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isActive = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isActive);
        announceToScreenReader(`Dark mode ${isActive ? 'enabled' : 'disabled'}`);
        
        // Update icon
        const icon = this.querySelector('i');
        if (isActive) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });
}

// Load saved text size
function loadTextSize() {
    const savedTextSize = localStorage.getItem('textSize');
    if (savedTextSize) {
        document.body.style.fontSize = `${savedTextSize}%`;
    }
    
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    if (savedHighContrast) {
        document.body.classList.add('high-contrast');
    }
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        const icon = document.getElementById('dark-mode-toggle').querySelector('i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Announcement Ticker
function initAnnouncementTicker() {
    let isPaused = false;
    
    pauseButton.addEventListener('click', function() {
        isPaused = !isPaused;
        announcementContent.style.animationPlayState = isPaused ? 'paused' : 'running';
        this.textContent = isPaused ? 'Resume' : 'Pause';
        announceToScreenReader(`Announcement scrolling ${isPaused ? 'paused' : 'resumed'}`);
    });
}

// Form Validation
function initFormValidation() {
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Reset previous errors
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('error');
            });
            
            // Validate name
            const nameInput = document.getElementById('name');
            if (!nameInput.value.trim()) {
                showFormError(nameInput, 'name-error');
                isValid = false;
            }
            
            // Validate email
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value)) {
                showFormError(emailInput, 'email-error');
                isValid = false;
            }
            
            // Validate phone (optional but if provided, must be valid)
            const phoneInput = document.getElementById('phone');
            if (phoneInput.value && !/^\d{10}$/.test(phoneInput.value)) {
                showFormError(phoneInput, 'phone-error');
                isValid = false;
            }
            
            // Validate subject
            const subjectInput = document.getElementById('subject');
            if (!subjectInput.value) {
                showFormError(subjectInput, 'subject-error');
                isValid = false;
            }
            
            // Validate message
            const messageInput = document.getElementById('message');
            if (!messageInput.value.trim()) {
                showFormError(messageInput, 'message-error');
                isValid = false;
            }
            
            if (isValid) {
                // Create feedback object
                const feedback = {
                    id: feedbacks.length + 1,
                    userId: isLoggedIn ? currentUser.id : null,
                    name: nameInput.value,
                    email: emailInput.value,
                    phone: phoneInput.value,
                    type: 'query',
                    subject: subjectInput.value,
                    message: messageInput.value,
                    status: 'pending',
                    date: new Date().toISOString().split('T')[0]
                };
                
                // Add to feedbacks array
                feedbacks.push(feedback);
                
                // Save to localStorage
                saveData();
                
                // Log activity if user is logged in
                if (isLoggedIn && currentUser) {
                    logUserActivity(currentUser.id, 'Submit Feedback', `Submitted feedback: ${subjectInput.value}`);
                }
                
                // Show success message
                announceToScreenReader('Form submitted successfully. We will get back to you soon.');
                
                // Reset form
                contactForm.reset();
                
                // Show success notification
                showNotification('Your message has been sent successfully. We will get back to you soon.', 'success');
            } else {
                // Announce error
                announceToScreenReader('Please correct errors in form and try again.');
                
                // Focus on first error
                const firstError = document.querySelector('.form-group.error input, .form-group.error textarea, .form-group.error select');
                if (firstError) {
                    firstError.focus();
                }
            }
        });
    }
}

function showFormError(input, errorId) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = getErrorMessage(input.id);
    }
}

function getErrorMessage(inputId) {
    const errorMessages = {
        'name': 'Please enter your full name',
        'email': 'Please enter a valid email address',
        'phone': 'Please enter a valid 10-digit phone number',
        'subject': 'Please select a subject',
        'message': 'Please enter your message'
    };
    
    return errorMessages[inputId] || 'This field is required';
}

// FAQ Accordion
function initFaqAccordion() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            this.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Keyboard support
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Scheme Filtering
function initSchemeFiltering() {
    const categoryFilter = document.getElementById('category-filter');
    const stateFilter = document.getElementById('state-filter');
    const searchInput = document.getElementById('search-schemes');
    const applyButton = document.getElementById('apply-filters');
    const resetButton = document.getElementById('reset-filters');
    
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            filterSchemes();
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            categoryFilter.value = 'all';
            stateFilter.value = 'all';
            searchInput.value = '';
            filterSchemes();
        });
    }
    
    // Real-time search
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterSchemes();
        });
    }
    
    function filterSchemes() {
        const category = categoryFilter.value;
        const state = stateFilter.value;
        const searchTerm = searchInput.value.toLowerCase();
        
        let visibleCount = 0;
        
        schemeCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardState = card.getAttribute('data-state');
            const cardText = card.textContent.toLowerCase();
            
            const categoryMatch = category === 'all' || cardCategory === category;
            const stateMatch = state === 'all' || cardState === state;
            const searchMatch = searchTerm === '' || cardText.includes(searchTerm);
            
            if (categoryMatch && stateMatch && searchMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Announce results to screen readers
        announceToScreenReader(`${visibleCount} schemes found matching your criteria`);
    }
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Only trigger shortcuts when Alt key is pressed
        if (!e.altKey) return;
        
        switch(e.key) {
            case '1':
                e.preventDefault();
                showPage('home');
                break;
            case '2':
                e.preventDefault();
                showPage('about');
                break;
            case '3':
                e.preventDefault();
                showPage('schemes');
                break;
            case '4':
                e.preventDefault();
                showPage('citizen');
                break;
            case '5':
                e.preventDefault();
                showPage('accessibility');
                break;
            case '6':
                e.preventDefault();
                showPage('contact');
                break;
            case '+':
            case '=':
                e.preventDefault();
                document.getElementById('text-resize-increase').click();
                break;
            case '-':
            case '_':
                e.preventDefault();
                document.getElementById('text-resize-decrease').click();
                break;
            case '0':
                e.preventDefault();
                document.getElementById('text-resize-default').click();
                break;
            case 'c':
            case 'C':
                e.preventDefault();
                document.getElementById('high-contrast-toggle').click();
                break;
            case 'd':
            case 'D':
                e.preventDefault();
                document.getElementById('dark-mode-toggle').click();
                break;
            case 'r':
            case 'R':
                e.preventDefault();
                if (window.speechSynthesis) {
                    startVoiceReader();
                }
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                openFeedbackModal();
                break;
            case 's':
            case 'S':
                e.preventDefault();
                document.getElementById('site-search').focus();
                break;
        }
    });
}

// Voice Reader
function initVoiceReader() {
    const voiceReader = document.getElementById('voice-reader');
    
    if (voiceReader && window.speechSynthesis) {
        voiceReader.addEventListener('click', function() {
            startVoiceReader();
        });
    }
}

function startVoiceReader() {
    if (!window.speechSynthesis) {
        showNotification('Voice reader is not supported in your browser', 'error');
        return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    // Get current page content
    const activeSection = document.querySelector('.page-section.active');
    if (!activeSection) return;
    
    // Get text content (excluding navigation, buttons, etc.)
    const textToRead = getReadableText(activeSection);
    
    if (!textToRead) {
        showNotification('No content available to read', 'error');
        return;
    }
    
    // Create utterance
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    // Set voice properties
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.includes('en'));
    if (englishVoice) {
        utterance.voice = englishVoice;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Show stop reading button
    stopReadingButton.classList.add('active');
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
    
    // Show notification
    showNotification('Reading content aloud...', 'info');
    
    // Stop button functionality
    stopReadingButton.onclick = function() {
        stopReading();
    };
    
    // Auto-remove button when done
    utterance.onend = function() {
        stopReadingButton.classList.remove('active');
    };
}

function stopReading() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        stopReadingButton.classList.remove('active');
        showNotification('Reading stopped', 'info');
    }
}

function getReadableText(element) {
    // Exclude elements that shouldn't be read
    const excludeSelectors = 'nav, footer, button, .sr-only, .accessibility-tools, .social-links';
    const clone = element.cloneNode(true);
    
    // Remove excluded elements
    const excludedElements = clone.querySelectorAll(excludeSelectors);
    excludedElements.forEach(el => el.remove());
    
    // Get text content
    let text = clone.textContent || '';
    
    // Clean up text
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
}

// Service Cards
function initServiceCards() {
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            announceToScreenReader(`Selected service: ${title}`);
            
            // Add visual feedback
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        // Keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Language Switcher
function initLanguageSwitcher() {
    const languageSelect = document.getElementById('language-select');
    
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            updateLanguage(selectedLang);
            
            // Store preference
            localStorage.setItem('preferredLanguage', selectedLang);
            
            // Show notification
            showNotification(`Language changed to ${this.options[this.selectedIndex].text}`, 'info');
        });
        
        // Load saved language preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang) {
            languageSelect.value = savedLang;
            updateLanguage(savedLang);
        }
    }
}

// Language Translation System
function updateLanguage(lang) {
    // For demo purposes, just show a notification
    // In a real implementation, this would load actual translations
    console.log(`Language changed to: ${lang}`);
    
    // Log activity if user is logged in
    if (isLoggedIn && currentUser) {
        logUserActivity(currentUser.id, 'Language Change', `Changed language to ${lang}`);
    }
}

// Citizen Corner Section Management
function showSection(sectionId) {
    // Hide all citizen sections
    document.getElementById('forms-section').style.display = 'none';
    document.getElementById('grievance-section').style.display = 'none';
    document.getElementById('helpline-section').style.display = 'none';
    document.getElementById('default-citizen-view').style.display = 'none';
    
    // Show selected section
    if (sectionId === 'forms') {
        document.getElementById('forms-section').style.display = 'block';
    } else if (sectionId === 'grievance') {
        document.getElementById('grievance-section').style.display = 'block';
    } else if (sectionId === 'helpline') {
        document.getElementById('helpline-section').style.display = 'block';
    } else {
        document.getElementById('default-citizen-view').style.display = 'block';
    }
    
    // Log activity if user is logged in
    if (isLoggedIn && currentUser) {
        logUserActivity(currentUser.id, 'Section Navigation', `Navigated to ${sectionId} section`);
    }
}

// Download Forms Function
function downloadForm(formType) {
    // Simulate form download
    showNotification(`Downloading ${formType} form...`, 'info');
    
    // Log activity if user is logged in
    if (isLoggedIn && currentUser) {
        logUserActivity(currentUser.id, 'Download Form', `Downloaded ${formType} form`);
    }
    
    // In a real implementation, this would trigger actual file download
    setTimeout(() => {
        showNotification(`${formType} form downloaded successfully!`, 'success');
        
        // Update download count if user is logged in
        if (isLoggedIn) {
            const downloadsCount = document.getElementById('downloads-count');
            downloadsCount.textContent = parseInt(downloadsCount.textContent) + 1;
        }
    }, 1500);
}

// Apply for Scheme Function
function applyForScheme(schemeName) {
    if (!isLoggedIn) {
        showNotification('Please login to apply for schemes', 'warning');
        openAuthModal('user-login');
        return;
    }
    
    showNotification(`Opening application form for ${schemeName}...`, 'info');
    
    // Log activity
    logUserActivity(currentUser.id, 'Apply Scheme', `Applied for ${schemeName} scheme`);
    
    // In a real implementation, this would navigate to application form
    setTimeout(() => {
        showNotification(`Redirected to ${schemeName} application form`, 'success');
        
        // Update application count if user is logged in
        if (isLoggedIn) {
            const applicationsCount = document.getElementById('applications-count');
            applicationsCount.textContent = parseInt(applicationsCount.textContent) + 1;
        }
    }, 1000);
}

// Handle Service Click
function handleServiceClick(serviceType) {
    // Add to navigation history
    navigationHistory.push({
        page: 'schemes',
        section: null
    });
    
    // Navigate to schemes page with filter
    showPage('schemes');
    
    // Set filter after page loads
    setTimeout(() => {
        const categoryFilter = document.getElementById('category-filter');
        if (categoryFilter) {
            categoryFilter.value = serviceType;
            filterSchemes();
        }
    }, 100);
    
    // Log activity if user is logged in
    if (isLoggedIn && currentUser) {
        logUserActivity(currentUser.id, 'Service Click', `Clicked on ${serviceType} service`);
    }
}

// Open Feedback Modal
function openFeedbackModal() {
    // This would open a feedback modal in a real implementation
    showNotification('Feedback form would open here', 'info');
}

// Initialize Search Functionality
function initSearch() {
    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('site-search');
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchInput.value.trim();
        if (!searchTerm) {
            showNotification('Please enter a search term', 'warning');
            return;
        }
        
        // Log activity if user is logged in
        if (isLoggedIn && currentUser) {
            logUserActivity(currentUser.id, 'Search', `Searched for: ${searchTerm}`);
        }
        
        // In a real implementation, this would perform actual search
        showNotification(`Searching for: ${searchTerm}`, 'info');
        
        // Simulate search results
        setTimeout(() => {
            showNotification(`Found 5 results for "${searchTerm}"`, 'success');
        }, 1000);
    }
}

// Utility Functions
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '4px';
    notification.style.color = 'white';
    notification.style.zIndex = '9999';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    notification.style.maxWidth = '80%';
    notification.style.textAlign = 'center';
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#F44336';
            break;
        case 'warning':
            notification.style.backgroundColor = '#FF9800';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 5000);
}