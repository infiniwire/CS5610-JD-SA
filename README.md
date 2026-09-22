# San Francisco Airbnb Listings

A simple Bootstrap 5.0 page that uses JavaScript `fetch()` and `await` to load and display the first 50 listings from `airbnb_sf_listings_500.json`.

Each card shows the listing name, description, three amenities, host name and photo, price, and thumbnail. A search box and neighborhood filter make the first 50 listings easier to browse.

## Run locally

Use an HTTP server because browser `fetch()` cannot load the JSON from a `file://` URL.

```powershell
npx http-server -c-1
```

Then open `http://127.0.0.1:8080`.

## Deployment

When GitHub Pages is enabled for the `main` branch, the deployment URL is:

https://infiniwire.github.io/CS5610-JD-SA/
