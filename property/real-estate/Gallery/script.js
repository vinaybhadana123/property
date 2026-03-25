const galleryItems = [
  { src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994", type: "property", title: "Luxury Villa" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", type: "property", title: "Modern Home" },
  { src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511", type: "plot", title: "Residential Plot" },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c", type: "office", title: "Office Space" },
  { src: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4", type: "property", title: "Premium Villa" },
  { src: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353", type: "plot", title: "Scenic Land" }
];

const grid = document.getElementById("galleryGrid");

function loadGallery(data) {
  grid.innerHTML = "";
  data.forEach(item => {
    grid.innerHTML += `
      <div class="gallery-card" onclick="openModal('${item.src}')">
        <img src="${item.src}">
        <div class="gallery-overlay">${item.title}</div>
      </div>
    `;
  });
}

loadGallery(galleryItems);

// FILTER
function filterGallery(type) {
  document.querySelectorAll(".gallery-filters button").forEach(btn => btn.classList.remove("active"));
  event.target.classList.add("active");

  if (type === "all") loadGallery(galleryItems);
  else loadGallery(galleryItems.filter(i => i.type === type));
}

// MODAL
function openModal(src) {
  document.getElementById("galleryModal").style.display = "flex";
  document.getElementById("modalImg").src = src;
}

function closeModal() {
  document.getElementById("galleryModal").style.display = "none";
}

// CONTACT
function contactNow() {
  window.open("https://wa.me/919217673211", "_blank");
}