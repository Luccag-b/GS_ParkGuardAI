# PARKGUARD AI — React prototype

Run locally: `npm install` then `npm run dev`.

Features: login and registration flow, accessibility preferences captured at signup and used in the dashboard, parking search/filter, road reports, profile, and an OpenStreetMap view with address search through the Nominatim geocoding API.

**Prototype limits:** accounts and preferences are stored only in the browser; this is not production-grade authentication and does not use a server. Do not use real or sensitive passwords. Parking and accessibility data are sample data; there are no live parking feeds, actual reservations, AI vision, or camera/sensor integration. OpenStreetMap provides the map and Nominatim searches typed addresses; route calculations and parking availability remain illustrative. Validate accessibility information with people with disabilities before real-world use.

The public Nominatim service has usage limits; use an appropriately hosted geocoding service for production or high-traffic applications.
