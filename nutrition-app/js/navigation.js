// ========================================
// Navigation Component for NutriTrack
// ========================================

// Menu items configuration - เรียงจากซ้ายไปขวา
const menuItems = [
    { href: 'index.html', label: 'หน้าหลัก', icon: '🏠' },
    { href: 'search.html', label: 'ค้นหาอาหาร', icon: '🔍' },
    { href: 'scanner.html', label: 'สแกนอาหาร', icon: '📸' },
    { href: 'planner.html', label: 'วางแผนอาหาร', icon: '📅' },
    { href: 'progress.html', label: 'ความคืบหน้า', icon: '📊' },
    { href: 'community.html', label: 'ชุมชน', icon: '👥' },
    { href: 'profile.html', label: 'โปรไฟล์', icon: '👤' }
];

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
}

// Render navigation bar
function renderNavigation() {
    const currentPage = getCurrentPage();
    const loggedIn = isLoggedIn();
    const user = getCurrentUser();

    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.innerHTML = `
        <div class="container navbar-content">
            <a href="index.html" class="navbar-logo">
                <div class="navbar-logo-icon">🥗</div>
                <span class="navbar-logo-text">NutriTrack</span>
            </a>
            
            <ul class="navbar-menu" id="navMenu">
                ${menuItems.map(item => `
                    <li>
                        <a href="${item.href}" class="navbar-link ${currentPage === item.href ? 'active' : ''}">
                            ${item.label}
                        </a>
                    </li>
                `).join('')}
            </ul>
            
            <div class="navbar-actions">
                ${loggedIn ? `
                    <button onclick="logout()" class="btn btn-outline btn-sm">ออกจากระบบ</button>
                ` : `
                    <a href="login.html" class="btn btn-secondary btn-sm btn-rounded">เข้าสู่ระบบ</a>
                    <a href="register.html" class="btn btn-primary btn-sm btn-rounded">สมัครสมาชิก</a>
                `}
            </div>
            
            <button class="mobile-menu-btn" onclick="toggleMobileMenu()" aria-label="Menu">
                <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        
        <div id="mobileMenu" class="mobile-menu">
            <ul class="mobile-menu-list">
                ${menuItems.map(item => `
                    <li>
                        <a href="${item.href}" class="mobile-menu-link ${currentPage === item.href ? 'active' : ''}">
                            ${item.icon} ${item.label}
                        </a>
                    </li>
                `).join('')}
                ${loggedIn ? `
                    <li><a href="#" onclick="logout()" class="mobile-menu-link">🚪 ออกจากระบบ</a></li>
                ` : `
                    <li><a href="login.html" class="mobile-menu-link">🔑 เข้าสู่ระบบ</a></li>
                    <li><a href="register.html" class="mobile-menu-link">✨ สมัครสมาชิก</a></li>
                `}
            </ul>
        </div>
    `;

    return nav;
}

// Toggle mobile menu
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
}

// Render footer
function renderFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
        <div class="container">
            <div class="footer-content">
                <div>
                    <div class="footer-brand">
                        <div class="navbar-logo-icon">🥗</div>
                        <span class="navbar-logo-text text-white">NutriTrack</span>
                    </div>
                    <p>ระบบติดตามโภชนาการอาหารที่ช่วยให้คุณดูแลสุขภาพได้ง่ายขึ้น</p>
                </div>
                <div>
                    <h4 class="footer-title">ลิงก์</h4>
                    <ul class="footer-links">
                        <li><a href="search.html">ค้นหาอาหาร</a></li>
                        <li><a href="scanner.html">สแกนอาหาร</a></li>
                        <li><a href="community.html">ชุมชน</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="footer-title">ติดต่อ</h4>
                    <ul class="footer-links">
                        <li>📧 nont4388@gmail.com</li>
                        <li>📱 062-002-2525</li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>© 2025 NutriTrack. สงวนลิขสิทธิ์.</p>
            </div>
        </div>
    `;
    return footer;
}

// Initialize page with navigation and footer
function initPage() {
    // Add navigation
    const nav = renderNavigation();
    document.body.insertBefore(nav, document.body.firstChild);

    // Add footer
    const footer = renderFooter();
    document.body.appendChild(footer);
}

// Auto-initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', initPage);
