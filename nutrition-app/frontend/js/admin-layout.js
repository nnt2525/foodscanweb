// ========================================
// Admin Layout & Sidebar Toggle Script
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
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
    
    // Add button to sidebar header
    sidebarHeader.appendChild(toggleBtn);
    
    // Adjust header layout
    sidebarHeader.style.display = 'flex';
    sidebarHeader.style.alignItems = 'center';
    sidebarHeader.style.justifyContent = 'space-between';

    // Add event listener
    toggleBtn.addEventListener('click', toggleSidebar);

    // 2. Restore State from LocalStorage
    const isCollapsed = localStorage.getItem('adminSidebarCollapsed') === 'true';
    if (isCollapsed) {
        applySidebarState(true);
    }
}

function toggleSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    const main = document.querySelector('.admin-main');
    
    if (!sidebar || !main) return;

    const isCollapsed = sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');

    // Adjust toggle button style based on state
    const toggleBtn = document.getElementById('sidebarToggle');
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
