/* ========================================================
   AUTHENTICATION & SHAXSIY KABINET BOSHQARUVI
   ======================================================== */

// Google Client ID (O'zingizning Google Cloud konsolida yaratilgan Client ID'ni qo'yishingiz mumkin)
// Agar Client ID kiritilmasa, tizim chiroyli Google profilini simulyatsiya qilib beradi
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

// Holat (State)
let currentUser = null;
let favoriteProjects = [];
let currentRating = 5;

// Sahifa yuklanganda mavjud sessiyani tiklash
document.addEventListener("DOMContentLoaded", () => {
  loadUserSession();
  initGoogleAuth();
  updateFavoritesUI();
});

// 1. Foydalanuvchi seansini yuklash
function loadUserSession() {
  const savedUser = localStorage.getItem("portfolio_user");
  const savedFavs = localStorage.getItem("portfolio_favorites");

  if (savedFavs) {
    favoriteProjects = JSON.parse(savedFavs);
  }

  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    applyUserLoggedInState();
  } else {
    applyUserLoggedOutState();
  }
}

// 2. Google Identity Services integratsiyasi
function initGoogleAuth() {
  if (
    window.google &&
    GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
  ) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse,
    });
  }
}

// Google bilan kirish tugmasi bosilganda
function loginWithGoogle() {
  if (
    window.google &&
    GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
  ) {
    google.accounts.id.prompt();
  } else {
    // Agar Google Client ID hali sozlanmagan bo'lsa, namunaviy Google profil bilan kiritadi:
    const mockGoogleUser = {
      id: "g_" + Date.now(),
      name: "Google Foydalanuvchisi",
      email: "user.google@gmail.com",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      type: "google",
      createdAt: new Date().toLocaleDateString(),
    };
    saveUserSession(mockGoogleUser);
    closeLoginModal();
    showToast("Google orqali muvaffaqiyatli kirdingiz! 🎉");
  }
}

// Google Credential kelganda (JWT decode)
function handleGoogleCredentialResponse(response) {
  try {
    const base64Url = response.credential.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const data = JSON.parse(jsonPayload);

    const googleUser = {
      id: data.sub,
      name: data.name,
      email: data.email,
      avatar: data.picture,
      type: "google",
      createdAt: new Date().toLocaleDateString(),
    };

    saveUserSession(googleUser);
    closeLoginModal();
    showToast(`Xush kelibsiz, ${googleUser.name}! 👋`);
  } catch (err) {
    console.error("Google Auth xatosi:", err);
  }
}

// 3. Mehmon (Guest) sifatida kirish
function loginAsGuest() {
  const inputName = document.getElementById("guestNameInput").value.trim();
  const guestName = inputName || "Kuzatuvchi Mehmon";

  const guestUser = {
    id: "guest_" + Math.random().toString(36).substring(2, 9),
    name: guestName,
    email: "mehmon@portfolio.local",
    avatar:
      "https://api.dicebear.com/7.x/bottts/svg?seed=" +
      encodeURIComponent(guestName),
    type: "guest",
    createdAt: new Date().toLocaleDateString(),
  };

  saveUserSession(guestUser);
  closeLoginModal();
  showToast(`Mehmon sifatida kirdingiz: ${guestName} 🚀`);
}

// Seansni saqlash
function saveUserSession(user) {
  currentUser = user;
  localStorage.setItem("portfolio_user", JSON.stringify(user));
  applyUserLoggedInState();
}

// Kirgan holatni interfeysda ko'rsatish
function applyUserLoggedInState() {
  document.getElementById("openLoginBtn").classList.add("hidden");
  const userPill = document.getElementById("userPill");
  userPill.classList.remove("hidden");

  document.getElementById("navUserAvatar").src = currentUser.avatar;
  document.getElementById("navUserName").textContent =
    currentUser.name.split(" ")[0];
  document.getElementById("navUserBadge").textContent =
    currentUser.type === "google" ? "Google" : "Mehmon";

  // Kabinet ma'lumotlarini to'ldirish
  document.getElementById("cabinetAvatar").src = currentUser.avatar;
  document.getElementById("cabinetName").textContent = currentUser.name;
  document.getElementById("cabinetEmail").textContent = currentUser.email;
  document.getElementById("cabinetRole").textContent =
    currentUser.type === "google"
      ? "Google Foydalanuvchisi"
      : "Mehmon / Kuzatuvchi";
}

// Chiqqan holatni ko'rsatish
function applyUserLoggedOutState() {
  document.getElementById("openLoginBtn").classList.remove("hidden");
  document.getElementById("userPill").classList.add("hidden");
}

// Tizimdan chiqish (Logout)
function logoutUser() {
  localStorage.removeItem("portfolio_user");
  currentUser = null;
  applyUserLoggedOutState();
  closeCabinet();
  showToast("Tizimdan chiqdingiz!");
}

// ----------------------------------------------------
// MODAL VA KABINET OCHISH/YOPISH
// ----------------------------------------------------
function openLoginModal() {
  document.getElementById("loginModal").classList.add("active");
}

function closeLoginModal() {
  document.getElementById("loginModal").classList.remove("active");
}

function toggleCabinet() {
  const drawer = document.getElementById("cabinetDrawer");
  const overlay = document.getElementById("cabinetOverlay");
  drawer.classList.toggle("active");
  overlay.classList.toggle("active");
}

function closeCabinet() {
  document.getElementById("cabinetDrawer").classList.remove("active");
  document.getElementById("cabinetOverlay").classList.remove("active");
}

// Tablarni almashtirish
function switchCabinetTab(tabName) {
  const tabs = ["favorites", "review", "message"];
  tabs.forEach((t) => {
    document.getElementById(`tab${capitalize(t)}`).classList.add("hidden");
  });
  document
    .querySelectorAll(".cabinet-tabs .tab-btn")
    .forEach((btn) => btn.classList.remove("active"));

  document
    .getElementById(`tab${capitalize(tabName)}`)
    .classList.remove("hidden");
  event.currentTarget.classList.add("active");
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ----------------------------------------------------
// SEVIMLILAR (FAVORITES) TIZIMI
// ----------------------------------------------------
function toggleFavorite(projectId, projectTitle) {
  if (!currentUser) {
    openLoginModal();
    showToast("Iltimos, avval tizimga kiring!");
    return;
  }

  const index = favoriteProjects.findIndex((p) => p.id === projectId);
  if (index > -1) {
    favoriteProjects.splice(index, 1);
    showToast(`"${projectTitle}" sevimlilardan o'chirildi.`);
  } else {
    favoriteProjects.push({ id: projectId, title: projectTitle });
    showToast(`"${projectTitle}" sevimlilarga saqlandi! ❤️`);
  }

  localStorage.setItem("portfolio_favorites", JSON.stringify(favoriteProjects));
  updateFavoritesUI();
}

function updateFavoritesUI() {
  const countSpan = document.getElementById("favCount");
  if (countSpan) countSpan.textContent = favoriteProjects.length;

  const listContainer = document.getElementById("favoritesList");
  if (!listContainer) return;

  if (favoriteProjects.length === 0) {
    listContainer.innerHTML =
      '<p class="empty-text">Hali birorta loyiha saqlanmagan. ❤️ belgisini bosing!</p>';
    return;
  }

  listContainer.innerHTML = favoriteProjects
    .map(
      (item) => `
    <div class="fav-item">
      <span><i class="fa-solid fa-code"></i> ${item.title}</span>
      <button onclick="toggleFavorite('${item.id}', '${item.title}')"><i class="fa-solid fa-trash"></i></button>
    </div>
  `,
    )
    .join("");

  // Sahifadagi loyiha tugmalarining active stili
  document.querySelectorAll(".project-like-btn").forEach((btn) => {
    const id = btn.getAttribute("data-id");
    if (favoriteProjects.some((p) => p.id === id)) {
      btn.classList.add("liked");
    } else {
      btn.classList.remove("liked");
    }
  });
}

// ----------------------------------------------------
// FIKR VA SHAXSIY XABAR YUBORISH
// ----------------------------------------------------
function setRating(val) {
  currentRating = val;
  const stars = document.querySelectorAll("#starRating i");
  stars.forEach((star, idx) => {
    if (idx < val) {
      star.className = "fa-solid fa-star";
    } else {
      star.className = "fa-regular fa-star";
    }
  });
}

function submitUserReview() {
  if (!currentUser) {
    openLoginModal();
    return;
  }
  const text = document.getElementById("reviewTextInput").value.trim();
  if (!text) {
    showToast("Iltimos, fikringizni yozing!");
    return;
  }

  // LocalStorage'ga fikrni saqlash
  const reviews = JSON.parse(localStorage.getItem("portfolio_reviews") || "[]");
  reviews.unshift({
    user: currentUser.name,
    avatar: currentUser.avatar,
    rating: currentRating,
    text: text,
    date: new Date().toLocaleDateString(),
  });
  localStorage.setItem("portfolio_reviews", JSON.stringify(reviews));

  document.getElementById("reviewTextInput").value = "";
  showToast("Fikringiz uchun rahmat! Saytda aks ettirildi. 🌟");
}

function sendDirectMessage() {
  if (!currentUser) {
    openLoginModal();
    return;
  }
  const subject = document.getElementById("directMsgSubject").value.trim();
  const body = document.getElementById("directMsgBody").value.trim();

  if (!body) {
    showToast("Iltimos, xabar matnini kiriting!");
    return;
  }

  showToast("Xabaringiz portfolio egasiga muvaffaqiyatli jo'natildi! 📬");
  document.getElementById("directMsgSubject").value = "";
  document.getElementById("directMsgBody").value = "";
}

// Bildirishnoma (Toast) chiqarish
function showToast(msg) {
  let toast = document.getElementById("portfolioToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "portfolioToast";
    toast.style.cssText = `
      position: fixed;
      bottom: 25px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(99, 102, 241, 0.5);
      color: #fff;
      padding: 12px 24px;
      border-radius: 9999px;
      font-weight: 500;
      font-size: 0.9rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999999;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(8px);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
  }, 3200);
}
