const properties = [
  {
    title: "Luxury Villa in Uttarakhand",
    price: 12000000,
    location: "Uttarakhand",
    area: "2500 sqft",
    bedrooms: 3,
    bathrooms: 2,
    type: "villa",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994"
  },
  {
    title: "Modern Apartment in Delhi",
    price: 6000000,
    location: "Delhi",
    area: "1200 sqft",
    bedrooms: 2,
    bathrooms: 2,
    type: "apartment",
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae"
  },
  {
    title: "Residential Plot in Dehradun",
    price: 3000000,
    location: "Dehradun",
    area: "1800 sqft",
    bedrooms: 0,
    bathrooms: 0,
    type: "plot",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511"
  }
];

const container = document.getElementById("propertyContainer");

function displayProperties(data) {
  container.innerHTML = "";
  data.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" alt="">
        <div class="card-content">
          <div class="card-title">${p.title}</div>
          <div class="card-price">₹${p.price}</div>
          <div class="card-details">${p.location}</div>
          <div class="card-details">${p.area}</div>
          <div class="card-details">${p.bedrooms} Bed | ${p.bathrooms} Bath</div>
          <div class="card-details">${p.type}</div>

          <div class="card-buttons">
            <button class="buy-btn">Buy Now</button>
            <span class="wishlist">❤️</span>
          </div>
        </div>
      </div>
    `;
  });
}

displayProperties(properties);

/* FILTER */
document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("change", filterData);
});

function filterData() {
  const search = document.getElementById("search").value.toLowerCase();
  const type = document.getElementById("type").value;
  const bedrooms = document.getElementById("bedrooms").value;
  const price = document.getElementById("price").value;

  let filtered = properties.filter(p => {
    return (
      p.location.toLowerCase().includes(search) &&
      (!type || p.type === type) &&
      (!bedrooms || p.bedrooms == bedrooms) &&
      (!price ||
        (price === "low" && p.price < 5000000) ||
        (price === "mid" && p.price >= 5000000 && p.price <= 10000000) ||
        (price === "high" && p.price > 10000000)
      )
    );
  });

  displayProperties(filtered);
}