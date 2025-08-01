// dashboard-company.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD8TbLs0IAqrnFYos7TPJ_G1N33Zv4wN1o",
  authDomain: "industrolink-67598.firebaseapp.com",
  projectId: "industrolink-67598",
  storageBucket: "industrolink-67598.appspot.com",
  messagingSenderId: "904792303444",
  appId: "1:904792303444:web:5077d3b983ec58cc798ac1"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔐 Auth check
onAuthStateChanged(auth, (user) => {
  if (!user) return (window.location.href = "auth.html");
  const userId = user.uid;

  // 📥 Send material request
  const requestForm = document.getElementById("material-request-form");
  if (requestForm) {
    requestForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = requestForm["request-name"].value;
      const description = requestForm["request-description"].value;

      await addDoc(collection(db, "materialRequests"), {
        companyId: userId,
        name,
        description,
        timestamp: Date.now()
      });

      alert("✅ تم إرسال الطلب بنجاح");
      requestForm.reset();
    });
  }

  // 📋 Load current requests
  const requestList = document.getElementById("request-list");
  if (requestList) {
    const q = query(collection(db, "materialRequests"), where("companyId", "==", userId));
    onSnapshot(q, (snapshot) => {
      requestList.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "p-2 mb-2 bg-gray-100 border rounded";
        div.innerHTML = `
          <strong>${data.name}</strong><br>
          ${data.description}<br>
          <small>${new Date(data.timestamp).toLocaleString()}</small>
        `;
        requestList.appendChild(div);
      });
    });
  }

  // 📜 Request history
  const requestHistory = document.getElementById("request-history");
  if (requestHistory) {
    const q = query(collection(db, "materialRequests"), where("companyId", "==", userId));
    onSnapshot(q, (snapshot) => {
      requestHistory.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const div = document.createElement("div");
        div.className = "p-2 mb-2 bg-white border rounded";
        div.innerHTML = `
          <strong>${data.name}</strong><br>
          ${data.description}<br>
          <small>تم الطلب في: ${new Date(data.timestamp).toLocaleString()}</small>
        `;
        requestHistory.appendChild(div);
      });
    });
  }

  // 🛒 Load store products
  const storeProducts = document.getElementById("store-products");
  if (storeProducts) {
    const q = query(collection(db, "products"));
    onSnapshot(q, (snapshot) => {
      storeProducts.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const item = document.createElement("div");
        item.className = "p-2 mb-2 border rounded bg-white";
        item.innerHTML = `
          <strong>${data.name}</strong><br>
          ${data.description}<br>
          السعر: ${data.price} جنيه<br>
          <button class="add-to-cart" data-id="${doc.id}" data-name="${data.name}" data-price="${data.price}">أضف إلى السلة</button>
        `;
        storeProducts.appendChild(item);
      });
    });
  }

  // ➕ Add to cart
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-to-cart")) {
      const productId = e.target.dataset.id;
      const name = e.target.dataset.name;
      const price = parseFloat(e.target.dataset.price);
      const quantity = 1;

      addDoc(collection(db, "carts"), {
        companyId: userId,
        productId,
        name,
        price,
        quantity
      });

      alert("✅ تمت إضافة المنتج إلى السلة.");
    }
  });

  // 🧺 Load cart
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");

  if (cartItemsContainer && cartTotalElement) {
    const q = query(collection(db, "carts"), where("companyId", "==", userId));
    onSnapshot(q, (snapshot) => {
      cartItemsContainer.innerHTML = "";
      let total = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        total += data.price * data.quantity;

        const div = document.createElement("div");
        div.className = "p-2 mb-2 border rounded bg-gray-50 flex justify-between items-center";
        div.innerHTML = `
          <div>
            <strong>${data.name}</strong> × ${data.quantity}<br>
            السعر: ${data.price * data.quantity} جنيه
          </div>
          <button class="remove-cart-item text-red-500" data-id="${doc.id}">❌</button>
        `;
        cartItemsContainer.appendChild(div);
      });

      cartTotalElement.textContent = `الإجمالي: ${total} جنيه`;
    });
  }

  // ❌ Remove from cart
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("remove-cart-item")) {
      const id = e.target.dataset.id;
      await deleteDoc(doc(db, "carts", id));
    }
  });

  // 💬 Chat button
  const chatBtn = document.getElementById("chat-button");
  if (chatBtn) {
    chatBtn.addEventListener("click", () => {
      window.location.href = "chat.html";
    });
  }

  // 🚪 Logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "auth.html";
    });
  }
});
