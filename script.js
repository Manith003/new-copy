document.getElementById("addLink").onclick = () => {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Enter another link";
  input.classList.add("link-input");
  document.getElementById("linkForm").insertBefore(input, document.getElementById("addLink"));
};

document.getElementById("linkForm").onsubmit = async (e) => {
  e.preventDefault();

  const companyName = document.getElementById("companyName").value.trim();
  if (!companyName) return alert("Please enter a company name");
  
  const companyDescription = document.getElementById("companyDescription").value.trim();
  
  const links = Array.from(document.getElementsByClassName("link-input"))
    .map(i => i.value.trim())
    .filter(Boolean);

  if (!links.length) return alert("Please enter at least one link");

  try {
    const docRef = await db.collection("qr_links").add({ 
      companyName,
      companyDescription,
      links 
    });
    const previewUrl = `https://manith003.github.io/multi-qr/preview.html?id=${docRef.id}`;
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