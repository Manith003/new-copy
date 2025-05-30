document.getElementById("addLink").onclick = () => {
  const container = document.createElement("div");
  container.classList.add("link-container");
  
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Enter Link Name";
  nameInput.classList.add("link-name");
  
  const urlInput = document.createElement("input");
  urlInput.type = "url";
  urlInput.placeholder = "Enter Link URL";
  urlInput.classList.add("link-url");
  
  container.appendChild(nameInput);
  container.appendChild(urlInput);
  
  document.getElementById("linkForm").insertBefore(container, document.getElementById("addLink"));
};

document.getElementById("linkForm").onsubmit = async (e) => {
  e.preventDefault();

  const companyName = document.getElementById("companyName").value.trim();
  if (!companyName) return alert("Please enter a company name");
  
  const companyDescription = document.getElementById("companyDescription").value.trim();
  
  // Get all link containers
  const linkContainers = document.querySelectorAll(".link-container");
  const links = [];
  
  // Process each link container to get name and URL
  linkContainers.forEach(container => {
    const name = container.querySelector(".link-name").value.trim();
    const url = container.querySelector(".link-url").value.trim();
    
    // Only add links that have both name and URL
    if (name && url) {
      links.push({ name, url });
    }
  });

  if (!links.length) return alert("Please enter at least one link with both name and URL");

  try {
    const docRef = await db.collection("qr_links").add({ 
      companyName,
      companyDescription,
      links 
    });
    const previewUrl = `https://scanex.netlify.app/preview.html?id=${docRef.id}`;
    //https://manith003.github.io/qr-project

    // Generate QR as PNG
    QRCode.toDataURL(previewUrl, { width: 256 }, (err, url) => {
      if (err) return console.error(err);
      document.getElementById("qrPreview").src = url;
      document.getElementById("qrPreview").style.display = "block";
      document.getElementById("downloadBtns").style.display = "block";
      document.getElementById("qrCanvas").style.display = "none";

      // Download PNG
      document.getElementById("downloadPng").onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${companyName}-qr-code.png`;
        a.click();
      };
    });

    // Generate SVG
    QRCode.toString(previewUrl, { type: 'svg' }, (err, svg) => {
      if (err) return console.error(err);

      document.getElementById("downloadSvg").onclick = () => {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${companyName}-qr-code.svg`;
        a.click();
        URL.revokeObjectURL(url);
      };
    });

  } catch (error) {
    console.error("Error saving links to Firebase:", error);
  }
};