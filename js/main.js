const DATA_URL = "airbnb_sf_listings_500.json";
const NUMBER_OF_LISTINGS = 50;

const listingsContainer = document.querySelector("#listings");
const listingTemplate = document.querySelector("#listing-template");

function getAmenities(listing) {
  return JSON.parse(listing.amenities).slice(0, 3);
}

function createListingCard(listing) {
  const card = listingTemplate.content.cloneNode(true);

  card.querySelector(".listing-image").src = listing.picture_url;
  card.querySelector(".listing-image").alt = listing.name;
  card.querySelector(".host-photo").src = listing.host_picture_url;
  card.querySelector(".host-photo").alt = `${listing.host_name}'s profile photo`;
  card.querySelector(".listing-name").textContent = listing.name;
  card.querySelector(".listing-description").textContent = listing.description
    .replace(/<[^>]*>/g, " ")
    .slice(0, 180);
  card.querySelector(".host-name").textContent = listing.host_name;
  card.querySelector(".price").textContent = `${listing.price} / night`;

  getAmenities(listing).forEach((amenity) => {
    const item = document.createElement("li");
    item.className = "list-group-item";
    item.textContent = amenity;
    card.querySelector(".amenities").append(item);
  });

  return card;
}

function showListings(listings) {
  listings.forEach((listing) => {
    listingsContainer.append(createListingCard(listing));
  });
}

async function loadListings() {
  const response = await fetch(DATA_URL);
  const allListings = await response.json();
  const firstFiftyListings = allListings.slice(0, NUMBER_OF_LISTINGS);

  showListings(firstFiftyListings);
}

loadListings();
