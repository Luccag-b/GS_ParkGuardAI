# PARKGUARD AI — React prototype

Run locally: `npm install` then `npm run dev`.

Features: login and registration flow, accessibility preferences captured at signup and used in the dashboard, parking search/filter, road reports, profile, and an interactive OpenStreetMap with nearby parking markers, browser geolocation, address search through the Nominatim geocoding API, and driving routes via OSRM.

**Prototype limits:** accounts and preferences are stored only in the browser; this is not production-grade authentication and does not use a server. Do not use real or sensitive passwords. Parking availability and accessibility data are sample data, not live feeds; there are no actual reservations, AI vision, or camera/sensor integration. The browser asks for location permission when a route is searched. Address lookup uses Nominatim and driving routes use the public OSRM demo service; both are subject to service availability and usage limits. Validate accessibility information with people with disabilities before real-world use.

For production or high-traffic use, connect appropriately hosted geocoding and routing services and a trusted source of real-time parking availability.
