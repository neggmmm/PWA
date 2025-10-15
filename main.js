// ✅ Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("Service Worker registered ✅", reg))
      .catch((err) => console.error("Service Worker registration failed ❌", err));
  });
}

// ✅ Handle "Add to Home Screen" (Install PWA)
let deferredPrompt;

// Listen for the beforeinstallprompt event (browser says app can be installed)
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("🚀 PWA can be installed!");
  e.preventDefault(); // Prevent automatic prompt
  deferredPrompt = e; // Store the event
  
  // Show install button on all pages
  const installBtn = document.getElementById("installBtn");
  if (installBtn) {
    installBtn.style.display = "block";
    installBtn.textContent = "Install App";
    console.log("Install button is now visible");
  }
});

// Handle user clicking install button
document.addEventListener("click", async (e) => {
  if (e.target && e.target.id === "installBtn") {
    console.log("Install button clicked!");
    
    if (deferredPrompt) {
      // Show the install popup
      deferredPrompt.prompt();
      
      // Wait for user to respond
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response: ${outcome}`);
      
      // Hide the button after use
      e.target.style.display = "none";
      deferredPrompt = null;
    } else {
      console.log("No install prompt available");
      alert("App installation not available. Make sure you're using a supported browser and the app meets PWA requirements.");
    }
  }
});

// Listen for successful installation
window.addEventListener("appinstalled", () => {
  console.log("🎉 PWA was installed successfully!");
  // Hide install button after successful installation
  const installBtn = document.getElementById("installBtn");
  if (installBtn) {
    installBtn.style.display = "none";
  }
});
