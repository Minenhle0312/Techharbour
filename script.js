// ── Initialise EmailJS only on pages that load the SDK ───────────────────────
if (typeof emailjs !== "undefined") {
  emailjs.init({
    publicKey: 'C-mTJYlv0FVn6J1YJ',
    privateKey: '0cV2nD1rBIwoYDt68rIn3'
  });
}

function scrollToSection(id){
  document.getElementById(id).scrollIntoView({behavior:"smooth"});
}

async function sendMessage(e){
  e.preventDefault();
  console.log("Form submission started");

  const name          = document.getElementById("name").value.trim();
  const email         = document.getElementById("email").value.trim();
  const phone         = document.getElementById("phone")?.value.trim()     || "";
  const serviceType   = document.getElementById("service-type")?.value     || "";
  const urgency       = document.getElementById("urgency")?.value          || "";
  const message       = document.getElementById("message").value.trim();
  const remoteSupport = document.getElementById("remote-support")?.checked || false;
  const onsiteService = document.getElementById("onsite-service")?.checked || false;

  console.log("Form values:", {name, email, phone, serviceType, urgency, message, remoteSupport, onsiteService});

  if (!name || !email || !message) {
    console.log("Validation failed: missing required fields");
    showStatus("Please fill in all required fields.", "error");
    return;
  }

  const submitBtn       = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled    = true;
  submitBtn.textContent = "Sending…";

  const templateParams = {
    from_name:      name,
    from_email:     email,
    telephone:      phone,
    service_type:   serviceType,
    urgency:        urgency,
    message:        message,
    remote_support: remoteSupport ? "Yes" : "No",
    onsite_service: onsiteService ? "Yes" : "No",
    reply_to:       email,
  };

  console.log("Template params:", templateParams);
  console.log("EmailJS initialized:", typeof emailjs !== "undefined");
  console.log("Service ID: service_3tdgs07");
  console.log("Template ID: template_gqah27u");

  try {
    console.log("Calling EmailJS send...");
    const result = await emailjs.send(
      "service_3tdgs07",
      "template_gqah27u",
      templateParams
    );
    console.log("EmailJS send successful:", result);

    const responseTime =
      urgency === "emergency" ? "1 hour"        :
      urgency === "high"      ? "24 hours"       :
                                "2 business days";

    showStatus(
      `Thanks ${name}! TechHarbour will contact you within ${responseTime} 💚`,
      "success"
    );
    e.target.reset();

  } catch (err) {
    console.error("Full error object:", err);
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error status:", err.status);
    console.error("EmailJS response:", err.text ? err.text : "No response text");
    
    let errorMsg = "Something went wrong. Please try again or email us directly at techharbour@outlook.com.";
    
    // Check for specific EmailJS errors
    if (err.text && err.text.includes("API access")) {
      errorMsg = "EmailJS is not properly configured. The admin needs to enable API access in the EmailJS dashboard. Please contact support.";
    } else if (err.status === 403) {
      errorMsg = "Access denied. The EmailJS credentials may be invalid or not properly configured.";
    } else if (err.status === 400) {
      errorMsg = "Invalid form data. Please check your input and try again.";
    }
    
    showStatus(errorMsg, "error");

  } finally {
    submitBtn.disabled    = false;
    submitBtn.textContent = "Submit Request";
  }
}

// ── Status helper ─────────────────────────────────────────────────────────────
function showStatus(text, type) {
  const statusMsg         = document.getElementById("form-status");
  statusMsg.textContent   = text;
  statusMsg.className     = `form-status ${type}`;
  statusMsg.style.display = "block";

  if (type === "success") {
    setTimeout(() => { statusMsg.style.display = "none"; }, 6000);
  }
}

// ── Mobile menu ───────────────────────────────────────────────────────────────
function initMobileMenu(){
  const menuToggle      = document.querySelector('.menu-toggle');
  const mobileMenu      = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const menuOverlay     = document.querySelector('.menu-overlay');
  const mobileNavLinks  = document.querySelectorAll('.mobile-nav-links a');

  if (!menuToggle || !mobileMenu || !mobileMenuClose || !menuOverlay) return;

  const openMenu = () => {
    mobileMenu.classList.add('open');
    menuOverlay.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  };

  menuToggle.addEventListener('click', openMenu);
  mobileMenuClose.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);

  // Close menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

window.addEventListener('DOMContentLoaded', initMobileMenu);
