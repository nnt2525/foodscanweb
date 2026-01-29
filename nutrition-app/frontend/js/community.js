// ========================================
// Community Page - NutriTrack
// ========================================

let posts = getFromLocalStorage('nutritrack_posts', [...mockPosts]);

function renderPosts() {
    document.getElementById('postsList').innerHTML = posts.map(p => `
        <div class="card mb-4">
            <div class="flex items-start gap-3">
                <div class="text-3xl">${p.avatar}</div>
                <div class="flex-1">
                    <h3 class="font-bold">${p.author}</h3>
                    <p class="text-sm text-gray mb-3">${p.timestamp}</p>
                    <p class="mb-4">${p.content}</p>
                    <div class="flex gap-6">
                        <button onclick="toggleLike(${p.id})" class="flex items-center gap-1 ${p.liked ? 'text-primary' : 'text-gray'}" style="cursor:pointer;background:none;border:none;">
                            ${p.liked ? '❤️' : '🤍'} ${p.likes}
                        </button>
                        <span class="flex items-center gap-1 text-gray">💬 ${p.comments}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function toggleLike(id) {
    const post = posts.find(p => p.id === id);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        saveToLocalStorage('nutritrack_posts', posts);
        renderPosts();
    }
}

function showNewPost() {
    if (!isLoggedIn()) {
        showNotification('กรุณาเข้าสู่ระบบก่อน', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1000);
        return;
    }
    document.getElementById('newPostCard').style.display = 'block';
    document.getElementById('showPostBtn').style.display = 'none';
}

function cancelPost() {
    document.getElementById('newPostCard').style.display = 'none';
    document.getElementById('showPostBtn').style.display = 'block';
    document.getElementById('postContent').value = '';
}

function submitPost() {
    const content = document.getElementById('postContent').value.trim();
    if (!content) return showNotification('กรุณาใส่เนื้อหา', 'warning');

    const user = getCurrentUser();
    posts.unshift({
        id: Date.now(),
        author: user.name,
        avatar: '👤',
        content,
        likes: 0,
        comments: 0,
        timestamp: 'เมื่อสักครู่',
        liked: false
    });

    saveToLocalStorage('nutritrack_posts', posts);
    cancelPost();
    renderPosts();
    showNotification('โพสต์สำเร็จ!', 'success');
}

renderPosts();
