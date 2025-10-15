if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("Service Worker registered", reg))
      .catch((err) => console.error(err));
  });
}

let dprompt;
const installBtn = document.getElementById("installBtn");
window.addEventListener("beforeinstallprompt", (e) => {
  console.log("PWA can be installed!");
  e.preventDefault();
  dprompt = e;
  if (installBtn) installBtn.style.display = "block";
   installBtn.addEventListener("click", async () => {
    e.prompt(); 
    const choice = await e.userChoice;
    console.log(`User choice: ${choice.outcome}`);
    installBtn.style.display = "none";
  });
});
