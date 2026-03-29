const galleryItems = [
  { src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994", type: "property", title: "Luxury Villa" },
  { src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c", type: "property", title: "Modern Home" },
  { src: "https://images.unsplash.com/photo-1505691938895-1758d7feb511", type: "plot", title: "Residential Plot" },
  { src: "https://images.unsplash.com/photo-1497366216548-37526070297c", type: "office", title: "Office Space" },
  { src: "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4", type: "property", title: "Premium Villa" },
  { src: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353", type: "plot", title: "Scenic Land" },
  { src: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b", type: "property", title: "Living Room Design" },
  { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0", type: "property", title: "Modern Kitchen" },
  { src: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68", type: "property", title: "Master Bedroom" },
  { src: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde", type: "property", title: "Garden View" },
  { src: "https://images.unsplash.com/photo-1430285561322-7808604715df", type: "property", title: "Blue Cottage" },
  { src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf", type: "plot", title: "Poolside Plot" },
  { src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174", type: "office", title: "Executive Suite" },
  { src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6", type: "property", title: "Sunset Mansion" }
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