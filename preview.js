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
      links.forEach((link, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="link-number">${index + 1}</span><a href="${link}" target="_blank">${link}</a>`;
        ul.appendChild(li);
      });
    } else {
      document.body.innerHTML = "<p>Invalid or expired QR code.</p>";
    }
  });
} else {
  document.body.innerHTML = "<p>No QR ID provided.</p>";
}