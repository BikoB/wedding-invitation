const guestName = document.getElementById("guestName");
const comingBtn = document.getElementById("comingBtn");
const notComingBtn = document.getElementById("notComingBtn");

const SESSION_KEY = "guestFullName";
const LOCAL_KEY = "guestFullNameBackup";

let currentUser = "";
try {
  currentUser = sessionStorage.getItem(SESSION_KEY) || "";
} catch {}
if (!currentUser) {
  try {
    currentUser = localStorage.getItem(LOCAL_KEY) || "";
  } catch {}
}

if (!currentUser) {
  window.location.href = "index.html";
}

guestName.textContent = currentUser ? `Гость: ${currentUser}` : "";

async function saveResponse(status) {
  if (!currentUser) return;

  await fetch("/api/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullName: currentUser, status })
  });
}

comingBtn.addEventListener("click", () => saveResponse("coming"));
notComingBtn.addEventListener("click", () => saveResponse("not_coming"));
