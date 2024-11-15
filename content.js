// Function to initialize the helper
function initializeLeetCodeHelper() {
  // Only initialize once
  if (document.getElementById("leetcode-helper")) {
    return;
  }

  // Add Tailwind CSS if not already present
  if (!document.querySelector('link[href*="tailwindcss"]')) {
    const tailwindLink = document.createElement("link");
    tailwindLink.rel = "stylesheet";
    tailwindLink.href = "https://cdn.tailwindcss.com";
    document.head.appendChild(tailwindLink);
  }

  // Modify the editorial_tab content
  const editorialTab = document.getElementById("editorial_tab");
  if (editorialTab) {
    editorialTab.innerHTML = `
      <div id="leetcode-helper" class="fixed bottom-0 right-0 z-[9999]">
        <button id="helper-toggle" 
          class="fixed bottom-5 right-5 flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white shadow-lg transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" 
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          LeetCode Helper
        </button>

        <!-- Sidebar Panel -->
        <div id="helper-panel" 
          class="fixed right-0 top-0 h-full w-[350px] transform translate-x-full bg-white shadow-lg transition-transform duration-300 ease-in-out">
          <div class="flex items-center justify-between border-b border-gray-200 bg-gray-50 p-4">
            <h2 class="text-lg font-semibold text-gray-800">LeetCode Helper</h2>
            <button id="close-helper" 
              class="rounded p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <!-- iframe Container -->
          <div class="h-[calc(100%-60px)] w-full">
            <iframe
              id="helper-iframe"
              src=""
              class="h-full w-full border-none"
              sandbox="allow-same-origin allow-scripts allow-forms"
            ></iframe>
          </div>
        </div>
      </div>
    `;
  }

  // Setup helper functionality
  const helperToggle = document.getElementById("helper-toggle");
  const helperPanel = document.getElementById("helper-panel");
  const closeHelper = document.getElementById("close-helper");
  const iframe = document.getElementById("helper-iframe");
  let isOpen = false;

  // Function to setup iframe content
  function setUpIframe() {
    const lcCode = document.querySelector(
      ".view-lines.monaco-mouse-cursor-text"
    );
    if (!lcCode) {
      console.log("No code found");
      return;
    }

    const payload = {
      code: lcCode.innerText,
      url: window.location.href,
    };

    const encodedPayload = encodeURIComponent(btoa(JSON.stringify(payload)));
    iframe.src = `http://localhost:3000/?LC=${encodedPayload}`;
  }

  // Call setUpIframe when initializing
  setUpIframe();

  // Function to toggle helper panel
  function toggleHelper() {
    isOpen = !isOpen;
    helperPanel.style.transform = isOpen ? "translateX(0)" : "translateX(100%)";
    helperToggle.style.transform = isOpen
      ? "translateX(-350px)"
      : "translateX(0)";

    // Update toggle button content
    helperToggle.innerHTML = isOpen
      ? `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
      Close Helper
    `
      : `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      LeetCode Helper
    `;
  }

  // Event Listeners
  helperToggle.addEventListener("click", toggleHelper);
  closeHelper.addEventListener("click", toggleHelper);
}

// Function to ensure initialization happens at the right time
function ensureInitialization() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeLeetCodeHelper);
  } else {
    initializeLeetCodeHelper();
  }
}

// Start the initialization process
ensureInitialization();
