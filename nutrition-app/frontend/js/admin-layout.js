// ========================================
// Admin Layout & Sidebar Toggle Script
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initMobileMenu();
});

function initSidebar() {
    // 1. Create Toggle Button in Sidebar Header
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (!sidebarHeader) return;

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'sidebarToggle';
    toggleBtn.className = 'btn btn-ghost';
    toggleBtn.innerHTML = '☰';
    toggleBtn.style.fontSize = '1.25rem';
    toggleBtn.style.padding = '0.25rem 0.5rem';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.color = 'white';
    toggleBtn.style.marginRight = '0.5rem';
    toggleBtn.style.order = '-1'; // Move to start with flexbox
    
    // Insert button at the beginning of sidebar header
    sidebarHeader.insertBefore(toggleBtn, sidebarHeader.firstChild);
    
    // Adjust header layout
    sidebarHeader.style.display = 'flex';
    sidebarHeader.style.alignItems = 'center';

    // Add event listener
    toggleBtn.addEventListener('click', toggleSidebar);

    // 2. Restore State from LocalStorage (only on desktop)
    if (window.innerWidth > 768) {
        const isCollapsed = localStorage.getItem('adminSidebarCollapsed') === 'true';
        if (isCollapsed) {
            applySidebarState(true);
        }
    }
}

function initMobileMenu() {
    const adminHeader = document.querySelector('.admin-header');
    if (!adminHeader) return;

    // Create mobile menu toggle button in header
    const mobileToggle = document.createElement('button');
    mobileToggle.id = 'mobileMenuToggle';
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.innerHTML = '☰';
    mobileToggle.style.display = 'none'; // Hidden by default, shown via CSS @media

    // Create mobile overlay
    const overlay = document.createElement('div');
    overlay.id = 'mobileOverlay';
    overlay.className = 'mobile-overlay';
    document.body.appendChild(overlay);

    // Insert toggle at the start of header
    const headerFirstChild = adminHeader.firstElementChild;
    if (headerFirstChild) {
        adminHeader.insertBefore(mobileToggle, headerFirstChild);
    }

    // Event listeners
    mobileToggle.addEventListener('click', openMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);

    // Show mobile toggle on small screens
    if (window.innerWidth <= 768) {
        mobileToggle.style.display = 'flex';
    }

    // Handle resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            mobileToggle.style.display = 'flex';
        } else {
            mobileToggle.style.display = 'none';
            closeMobileMenu();
        }
    });
}

function openMobileMenu() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    if (sidebar) sidebar.classList.add('mobile-open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const sidebar = document.querySelector('.admin-sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function toggleSidebar() {
    // On mobile, use the mobile menu instead
    if (window.innerWidth <= 768) {
        closeMobileMenu();
        return;
    }

    const sidebar = document.querySelector('.admin-sidebar');
    const main = document.querySelector('.admin-main');
    
    if (!sidebar || !main) return;

    const isCollapsed = sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');

    // Adjust toggle button style based on state
    const sidebarHeader = document.querySelector('.sidebar-header');
    
    if (isCollapsed) {
        if (sidebarHeader) sidebarHeader.style.justifyContent = 'center';
    } else {
        if (sidebarHeader) sidebarHeader.style.justifyContent = 'space-between';
    }

    // Save state
    localStorage.setItem('adminSidebarCollapsed', isCollapsed);
}

function applySidebarState(collapsed) {
    const sidebar = document.querySelector('.admin-sidebar');
    const main = document.querySelector('.admin-main');
    
    if (!sidebar || !main) return;

    const sidebarHeader = document.querySelector('.sidebar-header');

    if (collapsed) {
        sidebar.classList.add('collapsed');
        main.classList.add('expanded');
        if (sidebarHeader) sidebarHeader.style.justifyContent = 'center';
    } else {
        sidebar.classList.remove('collapsed');
        main.classList.remove('expanded');
        if (sidebarHeader) sidebarHeader.style.justifyContent = 'space-between';
    }
}

