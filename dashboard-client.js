// dashboard-client.js

let myRequests = JSON.parse(localStorage.getItem("clientRequests")) || [];
let responses = JSON.parse(localStorage.getItem("supplierResponses")) || [];

function showSection(id, btn = null) {
  document.querySelectorAll("main section").forEach((section) => section.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  document.querySelectorAll(".sidebar-link").forEach((btn) => btn.classList.remove("active"));
  if (btn) btn.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  showSection("post-service");
  updateMyRequestsList();
  renderResponses();
});

function submitServiceRequest(event) {
  event.preventDefault();
  const title = document.getElementById("service-title").value;
  const details = document.getElementById("service-details").value;
  const workerType = document.getElementById("worker-type").value;
  const location = document.getElementById("location").value;
  const quantity = document.getElementById("quantity").value;

  const newRequest = {
    id: Date.now(),
    title,
    details,
    workerType,
    location,
    quantity,
  };
  myRequests.push(newRequest);
  localStorage.setItem("clientRequests", JSON.stringify(myRequests));
  updateMyRequestsList();
  event.target.reset();
}

function updateMyRequestsList() {
  const myRequestsList = document.getElementById("my-requests-list");
  myRequestsList.innerHTML = "";

  if (!myRequests.length) {
    myRequestsList.innerHTML = '<p class="text-gray-500 text-center">لا توجد طلبات بعد.</p>';
    return;
  }

  myRequests.forEach((req) => {
    const div = document.createElement("div");
    div.className = "border-b pb-4";
    div.innerHTML = `
      <h3 class="font-semibold">${req.title}</h3>
      <p>تفاصيل: ${req.details}</p>
      <p>نوع العامل: ${req.workerType}</p>
      <p>الموقع: ${req.location}</p>
      <p>الكمية: ${req.quantity}</p>
    `;
    myRequestsList.appendChild(div);
  });
}

function renderResponses() {
  const container = document.getElementById("response-list");
  container.innerHTML = "";

  const relevantResponses = responses.filter((res) =>
    myRequests.some((req) => req.id === res.requestId)
  );

  if (!relevantResponses.length) {
    container.innerHTML = '<p class="text-gray-500 text-center">لا توجد ردود بعد.</p>';
    return;
  }

  relevantResponses.forEach((res) => {
    const div = document.createElement("div");
    div.className = "border p-4 rounded shadow";
    div.innerHTML = `
      <p><strong>المورد:</strong> ${res.supplierName}</p>
      <p><strong>الرسالة:</strong> ${res.message}</p>
      <button onclick="goToChat('${res.supplierId}')" class="mt-2 bg-blue-500 text-white px-4 py-2 rounded">محادثة</button>
    `;
    container.appendChild(div);
  });
}

function goToChat(supplierId) {
  sessionStorage.setItem("chatWith", supplierId);
  window.location.href = "chat.html";
}
