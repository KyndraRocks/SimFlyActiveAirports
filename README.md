# SimFly Active Airports

A single-file flight planning tool for SimFly pilots. Download it, open it in any browser, and start planning — no installation, no server, no account required.

This app is a companion to the [SimFly Active Airports Google Earth map](https://earth.google.com/web/data=Mj0KOwo5CiExN1phTGt0Yl9VclF0YmI4UUFGc0ExRnJuMDN1eGJvcmsSEgoQNTU4N0ZDODY1MzAwMDAwMSABQgIIAEoICJWWvoMBEAE).

**Current version: v2.24.6**

---

## Download

Grab the latest release from the [Releases](https://github.com/KyndraRocks/SimFlyActiveAirports/releases) page. Download `SimFly_Active_Airports-LATEST.html`, open it in your browser, and you're ready to go.

---

## Features

### Point-to-Point Distance
Enter departure and arrival ICAOs to instantly calculate the great-circle distance in nautical miles. An arrow between the fields lets you swap the route direction with one click. Typing a valid owned ICAO auto-selects that pilot's owner entry in the matrix dropdowns.

### Owner Distance Matrix
Choose departure and arrival fleet owners from searchable dropdown panels to generate a full distance matrix — every combination of their airports, at a glance. The owner panels support live text filtering, keyboard navigation (arrows, Space to toggle, Enter to clear the filter), and show each pilot's airport count in the current view.

ICAO labels carry per-category colors (1–7) so airport tier is immediately visible. Each row and column header shows a colored owner stripe bar — click it to lock the matrix to just that owner's airports on that axis. The sticky headers stay pinned as you scroll, and the **⊙ pivot sort bullseye** on each header lets you sort the opposite axis by distance to that airport with a single click — cycle through ⊙ → ▲ nearest → ▼ farthest → ⊙ clear.

### Independent Dep / Arr Category Filters
The category filter shows two side-by-side groups — one for departure airports, one for arrivals — so you can cross-filter by tier on each axis independently. "Inv" inverts the selection within its group only.

### Region Mode
A full-screen map-based region selector for cross-region matrix planning. Draw circles around departure and arrival regions to pull in every player-owned airport in those areas, then explore the resulting distance matrix with sticky headers, owner stripe click-to-filter, and a rolling dot-click routing system.

**Rolling map routing** — click any airport dot on the map (inside or outside a region circle) to set a route: first click sets departure, second click sets arrival and draws the route line. Every subsequent click rolls the chain forward — departure becomes the previous arrival, and the new click becomes the new arrival. The selected pair is immediately reflected in the main screen departure and arrival fields. A **✕ Clear** button in the header removes the current selection; the route and selection rings persist through ⊙ DONE and ⊙ Select Regions so you can reference or extend the pair while drawing new regions. Selecting a cell in the distance matrix or clicking a row/column header routes through the same chain. **Double-click** any dot to zoom the map to that airport.

**Send to Flight Planner →** closes Region Mode and populates the main screen with the selected departure, arrival, and category filter state — ready to file on SimBrief in one more click.

A **Map category filter** in the header bar hides entire airport categories from the background dot layer across the whole map — toggling it also live-syncs both dep and arr category filters on the main screen. Independent **Dep / Arr category filters** in the results bar narrow each side of the matrix by tier and take precedence over the map filter within their region rings. Category filter selections are preserved when re-entering region mode.

**Airport Owners filter** — the **Airport Owners ▾** dropdown in the header filters which owners' airports appear as dots on the map, independently of the Dep/Arr owner controls in the results bar. Use it to declutter the map to specific pilots without affecting the matrix. The panel supports the same interaction model as the dep/arr menus: type-ahead search, All/None buttons, arrow-key navigation, Space to toggle, and a count badge on the button when a filter is active.

**Region map search** — a floating search box in the top-left corner of the map lets you find any airport by ICAO, name, or owner name. Up to 10 results appear ranked by relevance, with your loaded (owned) airports ranked above non-owned airports from the global OurAirports database. When the query matches an owner name, a **⊙ Filter map →** row appears at the top — selecting it applies the Airport Owners filter to that owner and zooms the map to fit all their airports. Individual airport rows fly the map to that location at close zoom. Keyboard: ↑/↓ to navigate, Enter to activate the top result, Esc to dismiss.

Region mode includes a **Measure Distance** ruler with magnetic heading sourced from the NOAA WMM API for sub-degree accuracy and **Undo** / **Clear All** controls for multi-segment sessions, a selectable airport cap per region (100 · 250 · 500 · 750 · 1,000), and searchable **Dep / Arr owner dropdowns** with live text filtering. Each owner entry shows their airport count for the region in parentheses (e.g. *Pilot One (3)*), and the panel expands to fit the widest name automatically. Any character typed while a panel is open — or while the dropdown button itself has keyboard focus — opens the panel and routes to the filter box, no click required. Arrow keys move a highlight through the filtered names; Space toggles the highlighted row checked or unchecked; Enter clears the filter while preserving selections. New pilots appear auto-deselected by default.

Use **↩ Undo** to step back one phase within the region-drawing flow. Click **⊙ DONE** (results phase only) to collapse the distance matrix and return to free map exploration — region circles stay visible for reference. Click **⊙ Select Regions** to start a fresh selection. Use **✕ Close** to exit Region Mode entirely. The main-screen **✕ Reset** button also closes Region Mode and clears all region state.

### Distance Map
An interactive map renders all departure and arrival airports with colour-coded markers. Click any marker to zoom to fit all airports in view. Overlays weather flight category rings when weather data is loaded. When a route is highlighted on the map, the departure and arrival info cards display a **Weather** section with the same decoded breakdown as the badge-hover tooltip (METAR, flight category, wind, visibility, sky, temp/dew, altimeter).

### Weather & Flight Conditions
Click **⛅ Get Weather** to fetch live METARs for all visible airports. Flight category dots (VFR / MVFR / IFR / LIFR) appear on every matrix header and inline on the departure/arrival name lines. Hovering any dot shows a decoded weather breakdown: conditions, wind, visibility, ceiling, altimeter, and raw METAR. Data is cached for 30 minutes and invalidates automatically when you change owners.

### File on SimBrief
Once departure and arrival ICAOs are set, the **File on SimBrief →** button lights up. Click it to open SimBrief's dispatch page pre-filled with your route — ready to generate a full flight plan in one click.

### Aircraft Panel
View aircraft specs relevant to the selected route — estimated flight time, fuel burn, and range figures. The aircraft max-range marker is drawn directly on the distance slider so you can see at a glance which routes are within range. All figures are rough planning estimates; use SimBrief for final calculations.

### Owner Profile Links
When a pilot's SimFly profile URL is on record, their name becomes a clickable link in the matrix tooltips, Distance Map info cards, and the owner dropdown panels.

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
