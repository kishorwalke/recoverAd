// ------------------------------
// ELEMENT REFERENCES
// ------------------------------
const form = document.getElementById("waitlistForm");
const submitBtn = document.getElementById("submitBtn");
const loader = document.getElementById("loader");
const btnText = document.getElementById("btnText");


const nameField = document.getElementById("name");
const emailField = document.getElementById("email");
const websiteField = document.getElementById("website");
const trafficField = document.getElementById("traffic");
const messageField = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const successMsg = document.getElementById("formSuccess");
const formError = document.getElementById("formError");


// ------------------------------
// STRICT EMAIL VALIDATION
// ------------------------------
const strictEmailRegex =
  /^(?!.*\.\.)(?!.*@.*\.$)(?!.*@\.)([a-zA-Z0-9]+[a-zA-Z0-9._%+-]{0,63})@([a-zA-Z0-9-]{1,63}\.)+[a-zA-Z]{2,10}$/;


const blockedDomains = [
  "mailinator.com", "yopmail.com", "tempmail.com",
  "10minutemail.com", "trashmail.com", "fakeinbox.com",
  "guerrillamail.com", "example.com", "test.com",
  "testing.com", "dummy.com"
];

function isStrictValidEmail(email) {
  const lower = email.trim().toLowerCase();

  if (!strictEmailRegex.test(lower)) return false;

  const [local, domain] = lower.split("@");

  if (blockedDomains.includes(domain)) return false;

  if (
    local.length < 3 ||
    /^test\d*$/.test(local) ||
    /^(admin|mail|email|noreply)$/i.test(local)
  ) {
    return false;
  }

  return true;
}

// ------------------------------
// FORM SUBMIT EVENT
// ------------------------------
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  let valid = true;

  formSuccess.classList.add("hidden");
  formError.classList.add("hidden");

  // Validate Name
  if (nameField.value.trim() === "") {
    nameError.textContent = "Name is missing.";
    nameError.classList.remove("hidden");
    valid = false;
  } else {
    nameError.classList.add("hidden");
  }

  // Validate Email
  const emailValue = emailField.value.trim();
  if (!isStrictValidEmail(emailValue)) {
    emailError.textContent = "Invalid or temporary email address.";
    emailError.classList.remove("hidden");
    valid = false;
  } else {
    emailError.classList.add("hidden");
  }

  if (!valid) return;

  // Show Apple-style loader
  submitBtn.disabled = true;
  loader.classList.remove("hidden");
  btnText.textContent = "Submitting…";

  try {
    const response = await fetch("https://recoverad-api.onrender.com/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        website: websiteField.value.trim(),
        traffic: trafficField.value,
        message: messageField.value.trim(),
      }),
    });

    const result = await response.json();

    if (result.success) {
      formError.classList.add("hidden");
      formSuccess.textContent = "Thank you! Your submission has been received.";
      formSuccess.classList.remove("hidden");

      form.reset();
      setTimeout(() => formSuccess.classList.add("hidden"), 5000);
    } else {
      formSuccess.classList.add("hidden");
      formError.textContent = "Error saving data. Please try again.";
      formError.classList.remove("hidden");
    }

  } catch (error) {
    console.error("API Error:", error);

    formSuccess.classList.add("hidden");
    formError.textContent = "Server error. Please try later.";
    formError.classList.remove("hidden");
  }

  // Hide loader
  submitBtn.disabled = false;
  loader.classList.add("hidden");
  btnText.textContent = "Request Early Access";
});


