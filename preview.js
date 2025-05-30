const id = new URLSearchParams(window.location.search).get("id");

if (id) {
  db.collection("qr_links").doc(id).get().then(doc => {
    if (doc.exists) {
      const data = doc.data();
      const companyName = data.companyName || "Company";
      const companyDescription = data.companyDescription || "";
      const links = data.links;
      
      // Set the company name in the title and heading
      document.title = `${companyName} - Links`;
      document.getElementById("pageTitle").textContent = "Links Preview";
      document.getElementById("companyName").textContent = companyName;
      
      // Set the company description
      if (companyDescription) {
        document.getElementById("companyDescription").textContent = companyDescription;
      } else {
        document.getElementById("companyDescription").style.display = "none";
      }
      
      const ul = document.getElementById("linkList");
      
      // Check if links is an array of objects (new format) or array of strings (old format)
      if (links && links.length > 0) {
        links.forEach((link, index) => {
          const li = document.createElement("li");
          
          // Handle both new format (object with name & url) and old format (just url string)
          if (typeof link === 'object' && link.name && link.url) {
            // New format - display name but link to URL
            li.innerHTML = `
              <span class="link-number">${index + 1}</span>
              <a href="${link.url}" target="_blank">
                <img src="https://maps.google.com/mapfiles/ms/icons/red-dot.png" class="location-icon" alt="Location">
                ${link.name}
                <span class="arrow-icon">→</span>
              </a>`;
          } else {
            // Old format - display and link to URL
            const url = typeof link === 'string' ? link : link.url;
            li.innerHTML = `<span class="link-number">${index + 1}</span><a href="${url}" target="_blank">${url}</a>`;
          }
          
          ul.appendChild(li);
        });
      } else {
        ul.innerHTML = "<li>No links available</li>";
      }
    } else {
      document.body.innerHTML = "<p>Invalid or expired QR code.</p>";
    }
  }).catch(error => {
    console.error("Error getting document:", error);
    document.body.innerHTML = "<p>Error loading links. Please try again later.</p>";
  });
} else {
  document.body.innerHTML = "<p>No QR ID provided.</p>";
}