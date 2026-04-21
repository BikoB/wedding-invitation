const authForm = document.getElementById("authForm");
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const SESSION_KEY = "guestFullName";
const LOCAL_KEY = "guestFullNameBackup";

authForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  if (!firstName || !lastName) return;

  const fullName = `${firstName} ${lastName}`.replace(/\s+/g, " ");
  try {
    sessionStorage.setItem(SESSION_KEY, fullName);
  } catch {}
  try {
    localStorage.setItem(LOCAL_KEY, fullName);
  } catch {}

  window.location.href = "vote.html";
});
