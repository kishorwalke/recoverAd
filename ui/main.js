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

document.getElementById("year").textContent = new Date().getFullYear();

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


form.addEventListener("submit", async function (e) {
    e.preventDefault();

    let valid = true;

    formSuccess.classList.add("hidden");
    formError.classList.add("hidden");

    // Validation
    if (nameField.value.trim() === "") {
        nameError.textContent = "Name is missing.";
        nameError.classList.remove("hidden");
        valid = false;
    } else {
        nameError.classList.add("hidden");
    }

    const emailValue = emailField.value.trim();
    if (!isStrictValidEmail(emailValue)) {
        emailError.textContent = "Invalid or temporary email address.";
        emailError.classList.remove("hidden");
        valid = false;
    } else {
        emailError.classList.add("hidden");
    }

    if (!valid) return;

    // Disable button UI but DON'T wait for API
    submitBtn.disabled = true;
    loader.classList.remove("hidden");
    btnText.textContent = "Submitting…";

    // ------------------------------------------------
    // 1️⃣ INSTANT EMAIL FALLBACK (no waiting)
    // ------------------------------------------------
    fetch("https://formspree.io/f/mjggkokw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        to: "kishorwalke2333@gmail.com",
        name: nameField.value.trim(),
        email: emailField.value.trim(),
        website: websiteField.value.trim(),
        traffic: trafficField.value,
        message: messageField.value.trim(),
        note: "Sent instantly to avoid Render cold-start delay."
    }),
    }).catch(err => console.warn("Email fallback failed:", err));

    // ------------------------------------------------
    // 2️⃣ SHOW SUCCESS IMMEDIATELY (NO WAIT)
    // ------------------------------------------------
    formSuccess.textContent = "Thank you! Your submission has been received.";
    formSuccess.classList.remove("hidden");

    // GA Event
    gtag("event", "waitlist_submission", {
        event_category: "engagement",
        event_label: "Waitlist Form Submitted"
    });

    form.reset();
    setTimeout(() => formSuccess.classList.add("hidden"), 5000);

    // ------------------------------------------------
    // 3️⃣ API REQUEST IN BACKGROUND (Render may take 50s)
    // ------------------------------------------------
    fetch("https://recoverad-api.onrender.com/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            website: websiteField.value.trim(),
            traffic: trafficField.value,
            message: messageField.value.trim(),
        }),
    }).catch(err => {
        console.warn("Background API error:", err);
    });

    // ------------------------------------------------
    // 4️⃣ Restore button UI after 2 seconds
    // ------------------------------------------------
    setTimeout(() => {
        submitBtn.disabled = false;
        loader.classList.add("hidden");
        btnText.textContent = "Join Waitlist";
    }, 2000);
});



