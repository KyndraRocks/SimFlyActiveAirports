# SimFly Active Airports

A single-file flight planning tool for SimFly pilots. Download it, open it in any browser, and start planning — no installation, no server, no account required.

This app is a companion to the [SimFly Active Airports Google Earth map](https://earth.google.com/web/data=Mj0KOwo5CiExN1phTGt0Yl9VclF0YmI4UUFGc0ExRnJuMDN1eGJvcmsSEgoQNTU4N0ZDODY1MzAwMDAwMSABQgIIAEoICJWWvoMBEAE).

**Current version: v2.20.0**

---

## Download

Grab the latest release from the [Releases](https://github.com/KyndraRocks/SimFlyActiveAirports/releases) page. Download `SimFly_Active_Airports-LATEST.html`, open it in your browser, and you're ready to go.

---

## Features

### Point-to-Point Distance
Enter departure and arrival ICAOs to instantly calculate the great-circle distance in nautical miles. An arrow between the fields lets you swap the route direction with one click.

### Owner Distance Matrix
Select departure and arrival fleet owners from dropdown menus to generate a full distance matrix — every combination of their airports, at a glance. Sort any row or column by distance, filter by distance range or airport category, and click any cell to populate the ICAO fields.

ICAO labels carry per-category colors (1–7) so airport tier is immediately visible. The sticky departure-row and arrival-column headers stay pinned as you scroll, and the **⊙ pivot sort bullseye** on each header lets you sort the opposite axis by distance to that airport with a single click — cycle through ⊙ → ▲ nearest → ▼ farthest → ⊙ clear.

### Independent Dep / Arr Category Filters
The category filter shows two side-by-side groups — one for departure airports, one for arrivals — so you can cross-filter by tier on each axis independently. "Inv" inverts the selection within its group only.

### Region Mode
A full-screen map-based region selector for cross-region matrix planning. Draw circles around departure and arrival regions to pull in every player-owned airport in those areas, then explore the resulting distance matrix with sticky headers, owner stripe click-to-filter, and a click-to-highlight map dot system that mirrors matrix selections with a white ring on the map.

Region mode includes a **Measure Distance** ruler with magnetic heading sourced from the NOAA WMM API for sub-degree accuracy, results capped at 250 per region with on-demand expansion, and an owner filter that respects new pilots auto-deselected by default.

### Distance Map
An interactive map renders all departure and arrival airports with colour-coded markers. Click any marker to zoom to fit all airports in view. Overlays weather flight category rings when weather data is loaded. When a route is highlighted on the map, the departure and arrival info cards display a **Weather** section with the same decoded breakdown as the badge-hover tooltip (METAR, flight category, wind, visibility, sky, temp/dew, altimeter).

### Weather & Flight Conditions
Click **⛅ Get Weather** to fetch live METARs for all visible airports. Flight category dots (VFR / MVFR / IFR / LIFR) appear on every matrix header and inline on the departure/arrival name lines. Hovering any dot shows a decoded weather breakdown: conditions, wind, visibility, ceiling, altimeter, and raw METAR. Data is cached for 30 minutes and invalidates automatically when you change owners.

### File on SimBrief
Once departure and arrival ICAOs are set, the **File on SimBrief →** button lights up. Click it to open SimBrief's dispatch page pre-filled with your route — ready to generate a full flight plan in one click.

### Aircraft Panel
View aircraft specs relevant to the selected route — estimated flight time, fuel burn, and range figures. The aircraft max-range marker is drawn directly on the distance slider so you can see at a glance which routes are within range. All figures are rough planning estimates; use SimBrief for final calculations.

### Owner Profile Links
When a pilot's SimFly profile URL is recorded in the Recip Tracker Gist, their name becomes a clickable link in the matrix tooltips, Distance Map info cards, and the Departure/Arrival Airport Owner dropdowns. Owner profile coverage extends across the full Pilot Directory, including pilots who don't otherwise appear in your tracked-routes data.

### Airport Info & External Links
Click any ICAO to open a tooltip with runway details, surface type, elevation, and direct links to external resources.

### Light Mode
Toggle dark / light mode with the button in the top-right corner. Light mode uses a darker accessible color palette for ICAO category labels (crimson, burnt orange, dark gold, forest green, dark teal, royal blue, dark magenta) ensuring clear contrast on the cream background.

---

## Data Sources

- **Airport database** — [OurAirports](https://ourairports.com) (open data, fetched at runtime)
- **Weather** — [CheckWX](https://www.checkwxapi.com)
- **Magnetic heading** — [NOAA World Magnetic Model](https://www.ngdc.noaa.gov/geomag/WMM/) (region mode ruler)
- **Flight planning** — [SimBrief](https://www.simbrief.com)

---

## Usage Notes

- Works entirely in the browser — no data leaves your machine except for the OurAirports fetch and live weather requests.
- Tested in Chrome and Edge. Safari and Firefox are generally compatible.
- The file can be saved locally and used offline (weather and airport database lookups require an internet connection).
