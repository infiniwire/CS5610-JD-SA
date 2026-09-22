const DATA_URL = "airbnb_sf_listings_500.json";
const NUMBER_OF_LISTINGS = 50;

const listingsContainer = document.querySelector("#listings");
const listingTemplate = document.querySelector("#listing-template");
const searchInput = document.querySelector("#search-input");
const neighborhoodFilter = document.querySelector("#neighborhood-filter");
const resultsMessage = document.querySelector("#results-message");

let firstFiftyListings = [];

function getFirstThreeAmenities(listing) {
  return JSON.parse(listing.amenities).slice(0, 3);
}

function cleanDescription(description) {
  const textWithoutHtml = description.replace(/<[^>]*>/g, " ");
  return `${textWithoutHtml.slice(0, 180)}...`;
}

function setImageWithFallback(imageElement, imageUrl, imageAlt, fallbackText) {
  imageElement.src = imageUrl;
  imageElement.alt = imageAlt;

  imageElement.addEventListener(
    "error",
    () => {
      const placeholder = `
        <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
          <rect width="100%" height="100%" fill="#e9ecef" />
          <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
            fill="#6c757d" font-family="Arial" font-size="24">${fallbackText}</text>
        </svg>`;

      imageElement.src = `data:image/svg+xml,${encodeURIComponent(placeholder)}`;
      imageElement.alt = fallbackText;
    },
    { once: true },
  );
}

function listingMatchesSearch(listing, searchTerm) {
  if (searchTerm === "") {
    return true;
  }

  const amenities = getFirstThreeAmenities(listing).join(" ");
  const textToSearch = `${listing.name} ${listing.host_name} ${amenities}`.toLowerCase();
  return textToSearch.includes(searchTerm);
}

function listingMatchesNeighborhood(listing, selectedNeighborhood) {
  return (
    selectedNeighborhood === "all" ||
    listing.neighbourhood_cleansed === selectedNeighborhood
  );
}

function createListingCard(listing) {
  const card = listingTemplate.content.cloneNode(true);
  const listingImage = card.querySelector(".listing-image");
  const hostPhoto = card.querySelector(".host-photo");

  setImageWithFallback(
    listingImage,
    listing.picture_url,
    listing.name,
    "Listing image unavailable",
  );
  setImageWithFallback(
    hostPhoto,
    listing.host_picture_url || listing.host_thumbnail_url,
    `${listing.host_name}'s profile photo`,
    "Host photo unavailable",
  );
  card.querySelector(".listing-name").textContent = listing.name;
  card.querySelector(".listing-description").textContent = cleanDescription(listing.description);
  card.querySelector(".host-name").textContent = listing.host_name;
  card.querySelector(".price").textContent = `${listing.price} / night`;

  const amenitiesList = card.querySelector(".amenities");

  getFirstThreeAmenities(listing).forEach((amenity) => {
    const item = document.createElement("li");
    item.className = "list-group-item";
    item.textContent = amenity;
    amenitiesList.append(item);
  });

  return card;
}

function showListings() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedNeighborhood = neighborhoodFilter.value;

  const matchingListings = firstFiftyListings.filter((listing) => {
    return (
      listingMatchesSearch(listing, searchTerm) &&
      listingMatchesNeighborhood(listing, selectedNeighborhood)
    );
  });

  listingsContainer.replaceChildren();

  matchingListings.forEach((listing) => {
    listingsContainer.append(createListingCard(listing));
  });

  resultsMessage.textContent = `Showing ${matchingListings.length} of ${firstFiftyListings.length} listings.`;
}

function addNeighborhoodOptions() {
  const neighborhoods = [];

  firstFiftyListings.forEach((listing) => {
    const neighborhood = listing.neighbourhood_cleansed;

    if (neighborhood && !neighborhoods.includes(neighborhood)) {
      neighborhoods.push(neighborhood);
    }
  });

  neighborhoods.sort();

  neighborhoods.forEach((neighborhood) => {
    const option = document.createElement("option");
    option.value = neighborhood;
    option.textContent = neighborhood;
    neighborhoodFilter.append(option);
  });
}

async function loadListings() {
  try {
    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`Could not load data: ${response.status}`);
    }

    const allListings = await response.json();
    firstFiftyListings = allListings.slice(0, NUMBER_OF_LISTINGS);

    addNeighborhoodOptions();
    showListings();
  } catch (error) {
    listingsContainer.textContent = "Could not load listings. Please use an HTTP server.";
    console.error(error);
  }
}

searchInput.addEventListener("input", showListings);
neighborhoodFilter.addEventListener("change", showListings);

loadListings();
