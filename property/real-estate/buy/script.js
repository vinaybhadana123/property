const properties = [
  {
    title: "Residential Prime Spaces Sector 46 Gurgaon",
    price: 15000000,
    location: "Gurgaon",
    area: "1950 sqft",
    bedrooms: 8,
    bathrooms: 8,
    type: "villa",
    image: "kharkhoda land.webp"
  },
  {
    title: "Modern Commercial Spaces Kharkhoda",
    price: 9000000,
    location: "Kharkhoda",
    area: "1580 sqft",
    bedrooms: 4,
    bathrooms: 4,
    type: "apartment",
    image: "kharkhoda investment.webp"
  },
  {
    title: "Investment Ready Plots Sector 6, Jhajjar",
    price: 4000000,
    location: "Jhajjar 124103",
    area: "1120 sqft",
    bedrooms: 3,
    bathrooms: 2,
    type: "plot",
    image: "sector 46 gurugram.webp"
  },
  {
    title: "Luxury Villa Property, Pataudi Road",
    price: 18000000,
    location: "Gurgaon 122504",
    area: "1430 sqft",
    bedrooms: 3,
    bathrooms: 2,
    type: "villa",
    image: "1.46cr.jpg"
  },
  {
    title: "Peaceful Residential Home",
    price: 8500000,
    location: "Dehradun 248001",
    area: "1240 sqft",
    bedrooms: 5,
    bathrooms: 5,
    type: "villa",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be"
  },
  {
    title: "Scenic Plot for Living",
    price: 6000000,
    location: "Rishikesh 249201",
    area: "1630 sqft",
    bedrooms: 4,
    bathrooms: 4,
    type: "plot",
    image: "https://images.unsplash.com/photo-1505691723518-36a5ac3be353"
  },
  {
    title: "Premium Property Haridwar",
    price: 7000000,
    location: "Haridwar",
    area: "1500 sqft",
    bedrooms: 4,
    bathrooms: 4,
    type: "villa",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"
  }
];

const container = document.getElementById("propertyContainer");

function displayProperties(data) {
  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <div class="card-content">
          <div class="card-title">${p.title}</div>
          <div class="card-price">₹${p.price.toLocaleString()}</div>
          <div class="card-details">📍 ${p.location}</div>
          <div class="card-details">📐 ${p.area}</div>
          <div class="card-details">🛏️ ${p.bedrooms} Bed | 🛁 ${p.bathrooms} Bath</div>
          <div class="card-details">🏡 ${p.type}</div>

          <div class="card-buttons">
            <button class="buy-btn">Buy Now</button>
            <span class="wishlist" onclick="toggleWishlist(this)">🤍</span>
          </div>
        </div>
      </div>
    `;
  });
}

displayProperties(properties);

// FILTER
document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", filterData);
});

function filterData() {
  const search = document.getElementById("search").value.toLowerCase();
  const type = document.getElementById("type").value;
  const bedrooms = document.getElementById("bedrooms").value;
  const price = document.getElementById("price").value;

  const filtered = properties.filter(p =>
    p.location.toLowerCase().includes(search) &&
    (!type || p.type === type) &&
    (!bedrooms || p.bedrooms == bedrooms) &&
    (!price ||
      (price === "low" && p.price < 5000000) ||
      (price === "mid" && p.price <= 10000000) ||
      (price === "high" && p.price > 10000000)
    )
  );

  displayProperties(filtered);
}

// WISHLIST
function toggleWishlist(el) {
  el.textContent = el.textContent === "🤍" ? "❤️" : "🤍";
}










// =======================
// EXTRA PREMIUM PROPERTIES
// =======================
const extraProperties = [
  {
    title: "Ultra Luxury Farmhouse",
    price: 25000000,
    location: "Gurgaon Outskirts",
    area: "3500 sqft",
    bedrooms: 6,
    bathrooms: 5,
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d"
  },
  {
    title: "Riverside Premium Villa",
    price: 22000000,
    location: "Haridwar Riverside",
    area: "3000 sqft",
    bedrooms: 5,
    bathrooms: 4,
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227"
  },
  {
    title: "Hill View Luxury Home",
    price: 18000000,
    location: "Uttarakhand Hills",
    area: "2700 sqft",
    bedrooms: 4,
    bathrooms: 3,
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115"
  },
  {
    title: "Modern Glass Villa",
    price: 20000000,
    location: "Sonipat",
    area: "2900 sqft",
    bedrooms: 5,
    bathrooms: 4,
    image: "luxury villa property, pataudi road, gurgaon 122504.jpg"
  }
];

const extraContainer = document.getElementById("extraContainer");

function displayExtraProperties() {
  extraContainer.innerHTML = "";

  extraProperties.forEach(p => {
    extraContainer.innerHTML += `
      <div class="extra-card">
        <img src="${p.image}">
        <div class="extra-content">
          <div class="extra-title-text">${p.title}</div>
          <div class="extra-price">₹${p.price.toLocaleString()}</div>
          <div>📍 ${p.location}</div>
          <div>📐 ${p.area}</div>
          <div>🛏️ ${p.bedrooms} | 🛁 ${p.bathrooms}</div>
        </div>
      </div>
    `;
  });
}

displayExtraProperties();


// footer properties..

