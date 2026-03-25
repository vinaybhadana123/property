document.getElementById("sellForm").addEventListener("submit", function(e) {
  e.preventDefault();

  alert("Your property has been submitted successfully!");

  // reset form
  this.reset();
});