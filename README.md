# SimFly Active Airports

A single-file flight planning tool for SimFly pilots. Download it, open it in any browser, and start planning — no installation, no server, no account required.

This app is a companion to the [SimFly Active Airports Google Earth map](https://earth.google.com/web/data=Mj0KOwo5CiExN1phTGt0Yl9VclF0YmI4UUFGc0ExRnJuMDN1eGJvcmsSEgoQNTU4N0ZDODY1MzAwMDAwMSABQgIIAEoICJWWvoMBEAE).

**Current version: v2.42.0**

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

In the region-mode matrix, every dep-side control (the **Dep Owners** dropdown, the **Dep** label, the *All / None / Invert* buttons, the per-airport sort dots on the row headers, and the **DEP** half of the corner cell) renders in **cyan** to match the departure region circle. Every arr-side control renders in **orange** to match the arrival circle. The colour-coding is continuous in idle and hover states, so the side of the route is unmistakable at a glance when scanning the matrix.

### Scenery Library
Track which airports you have add-on scenery installed for, and rate the quality of each one. The library is stored in your browser's localStorage and persists across sessions.

**Adding airports:**
- **Shift+click** any airport dot on the Region Mode map to toggle it in or out of the library. The first add automatically enables Highlight mode.
- **Right-click (or long-press) any airport dot** to open the **Quick-Rate popover** — set a star rating right from the map. If the airport isn't already in the library, rating it adds it.
- **Paint mode** — click **📍 Add from map** in the library modal to enter a persistent paint mode: click airport dots one-by-one without holding Shift.
- **Autocomplete add** — type an ICAO in the Add Airport field; results from the global airport database appear as you type.
- **Paste ICAOs** — paste any block of text containing ICAOs (space-, comma-, or newline-separated). Tokens are validated against the airport database; unrecognized codes are skipped with a count shown.
- **Import file** — drag and drop (or browse for) a previously exported JSON backup, an X-Plane `scenery_packs.ini`, or an MSFS `scenery.cfg`. ICAOs are extracted automatically.

**Star ratings (0–5, half-star granularity)** — every airport in the library has an interactive 5-star rating shown next to its name. Click the **left half** of a star for a half rating, the **right half** for a full rating; click the same half again to clear back to zero. A live hover preview fills the stars (and a numeric `X.X/5` badge) up to the cursor position so you always know what you're about to set. Ratings are saved automatically, round-trip through Export / Import JSON, and are also shown in the airport's tooltip on the region map.

**Quick-Rate popover** — **right-click** any airport dot (or **long-press** for ~½ second on touch devices) to open a small floating popover anchored to that dot. The popover shows the ICAO, airport name, the same big interactive star widget, and whether the airport is currently in your library. Setting a rating on a non-library airport adds it to the library automatically, and turns on Highlight so the black scenery dot appears immediately. Close with **×**, **Esc**, by clicking elsewhere, or by zooming the map.

**Sort and filter** — two dropdowns above the list:
- **Show** — *All airports*, *SimFly-owned only* (filters to airports still owned by an active SimFly player), *Rated only*, or *Unrated only*.
- **Sort** — *ICAO (A–Z)*, *Rating (high to low)*, or *Airport name (A–Z)*.

The text search box also matches the full airport name in addition to ICAO and addon. The footer shows `X of Y airports` whenever a filter is active, and the empty-state message tailors itself to the chosen filter. Sort and filter selections are persisted to localStorage so your preference survives reloads and new sessions.

**Display modes** — the **⬤ Scenery** split button in the toolbar cycles through three states:
- **Off** — no scenery indicators shown
- **Highlight** — all airports remain visible; scenery airports gain a black center dot on the map
- **Only** — the map, the owner distance matrix, and the Select Regions matrix all filter to scenery-library airports only

**Backup & restore** — use **Export JSON** in the overflow menu (⋯) to download your library (ratings included). If you have unsaved changes — including via shift-click on the map — the **⬤ Scenery** button pulses with a yellow glow as a reminder. Opening the modal shows the unsaved-changes banner at the top, and the ✕ close button is suppressed until you choose to download or dismiss. Choosing **Close anyway** closes the modal but keeps the dirty state: the glow persists on the button and the banner reappears the next time you open the modal, until you actually export. The banner shows the exact number of pending changes (e.g. *7 unsaved changes — download a backup before closing?*).

### Region Mode
A full-screen map-based region selector for cross-region matrix planning. Draw circles around departure and arrival regions to pull in every player-owned airport in those areas, then explore the resulting distance matrix with sticky headers, owner stripe click-to-filter, and a rolling dot-click routing system.

**Map dot routing (anchor model)** — click any airport dot on the map (inside or outside a region circle) to build a route. The **first click** sets the departure. Clicking the **same departure airport again** clears the entire route — equivalent to the ✕ Clear button. Clicking **any other airport** sets that airport as the arrival; subsequent clicks on different airports replace the arrival without changing the departure, so it's easy to compare multiple destinations from one origin. The selected pair is immediately reflected in the main screen departure and arrival fields. The departure and arrival ICAOs are displayed as large chips in the header — SimFly-owned airports render as clickable links to their SimFly details page; **hovering either chip** shows the full airport tooltip (name, owner, category, elevation, runway details, and live weather if fetched). The **⇄** button between the two chips swaps departure and arrival in one click, syncing the route line, matrix highlight, and main-screen ICAO inputs together. A **✕ Clear** button in the header also removes the current selection; the route and selection rings persist through ⊙ DONE and ⊙ Select Regions so you can reference or extend the pair while drawing new regions. Selecting a cell in the distance matrix or clicking a row/column header routes the same way. **Double-click** any dot to zoom the map to that airport.

**Send to Flight Planner →** closes Region Mode and populates the main screen with the selected departure, arrival, and category filter state — ready to file on SimBrief in one more click.

A **Map category filter** in the header bar hides entire airport categories from the background dot layer across the whole map — toggling it also live-syncs both dep and arr category filters on the main screen. Independent **Dep / Arr category filters** in the results bar narrow each side of the matrix by tier and take precedence over the map filter within their region rings. Category filter selections are preserved when re-entering region mode.

**Airport Owners filter** — the **Airport Owners ▾** dropdown in the header filters which owners' airports appear as dots on the map, independently of the Dep/Arr owner controls in the results bar. Use it to declutter the map to specific pilots without affecting the matrix. The panel supports the same interaction model as the dep/arr menus: type-ahead search, All/None buttons, arrow-key navigation, Space to toggle, and a count badge on the button when a filter is active. When you open Region Mode with owners already selected on the main screen, the Airport Owners filter automatically pre-syncs to those owners so the map opens focused on the relevant airports.

**Cross-app pilot group launch** — passing a `pilots=` URL parameter (comma-separated pilot names, e.g. `?pilots=Alice,Bob`) opens the app directly into Region Mode with the Airport Owners filter pre-set to exactly those pilots. The SimFly Reciprocation Tracker uses this to send a selected group from the Balance Queue straight to the region map with one click.

**Region map search** — a floating search box in the top-left corner of the map lets you find any airport by ICAO, name, or owner name. Up to 10 results appear ranked by relevance, with your loaded (owned) airports ranked above non-owned airports from the global OurAirports database. When the query matches an owner name, a **⊙ Filter map →** row appears — selecting it filters the map to that owner's airports and zooms to fit. When the query matches a country name (e.g. *Germany*), a **🌍 Filter map →** row appears showing the count of SimFly-owned airports in that country — selecting it filters the map to those airports and zooms to fit. When the query matches a continent name (e.g. *Europe*, *Asia*, *North America*), a **🌍 Filter map →** continent row appears — selecting it filters to all SimFly-owned airports on that continent and zooms to fit. Selecting an individual ICAO result **pins** that airport as a visible dot on the map regardless of other filters — SimFly-owned airports appear in their normal category color; non-owned airports appear as a gray dot. A chip for each active filter appears in the filter status strip with a ✕ to clear it independently. Individual airport rows fly the map to that location at close zoom. Keyboard: ↑/↓ to navigate, Enter to activate the top result, Esc to dismiss.

**Additive search** — prefix any search with `+` to add its results to the existing map filter rather than replacing it. For example: search *Kyndra* to show Kyndra's airports; then *+StarVen* to also show StarVen's airports; then *+Germany* to also show all SimFly airports in Germany; then *+EGLL* to also pin EGLL as a gray dot. Each active filter gets its own breadcrumb chip. A non-prefixed search replaces all active filters.

**Negation search** — prefix any search with `-` to exclude rather than include. *-Germany* removes all German airports from the map; *-Europe* removes all European airports; *-Kyndra* removes Kyndra's airports from the owner filter (or adds her to an excluded-owners set if she wasn't already filtered in); *-EGLL* removes EGLL from the pinned set (or excludes it entirely). Excluded items appear as red-tinted chips in the filter status strip with a ✕ to un-exclude.

Region mode includes a **📐 Measurement** ruler — click **📐 Measurement** in the toolbar to activate it. The on-map label adapts units to the scale: at 20,000 ft and under it shows feet and meters; above that threshold it shows nautical miles and kilometres (two decimal places up to 100 nm, whole numbers above). Magnetic heading is sourced from the NOAA WMM API for sub-degree accuracy. Saved measurements are **movable and resizable** — grab the origin handle to translate the whole measurement (direction and distance preserved), or the edge handle to resize the radius with bearing locked to the drag-start angle; both handle types give the same grab/resize cursor feedback as region circles. Each saved measurement also has a **✕ close handle** on the opposite side of the ring — click it to remove that specific measurement without disturbing any others (the **↩ Undo** button still pops the most recent remaining measurement, so the two flows stay independent). Resizing works all the way down to runway scale — drag the edge handle in to read off runway lengths in feet directly from the map. The saved label uses the same smart-units ladder as the live label, so a resized measurement renders identically to a freshly drawn one. **Undo** / **Clear All** controls manage multi-segment sessions, a selectable airport cap per region (100 · 250 · 500 · 750 · 1,000), and searchable **Dep / Arr owner dropdowns** with live text filtering. Each owner entry shows their airport count for the region in parentheses (e.g. *Pilot One (3)*), and the panel expands to fit the widest name automatically. Any character typed while a panel is open — or while the dropdown button itself has keyboard focus — opens the panel and routes to the filter box, no click required. Arrow keys move a highlight through the filtered names; Space toggles the highlighted row checked or unchecked; Enter clears the filter while preserving selections. New pilots appear auto-deselected by default.

**Crosses antimeridian cue** — when a route, measurement, or dep→arr region distance crosses ±180° longitude (e.g. New Zealand to Hawaii), Leaflet draws the visual line the long way across the map even though the displayed distance is the short-way real-world figure. In that case the on-map distance chip shows a second row reading **Crosses antimeridian** (amber pill with a dark navy background so it's legible on both street and satellite tiles), and the line itself switches to a dashed style so the apparent mismatch is explained at a glance.

Before drawing the first region circle, a **Cancel** button is available — clicking it returns to the region-selector state without drawing anything. **Right-click** anywhere on the map during the in-progress region-drawing sequence also cancels the operation and returns to the explore state — handy when you want to abort mid-draw without moving the cursor off the map. During drawing, use **↩ Undo** to step back one phase within the region-drawing flow. Click **⊙ DONE** (results phase only) to collapse the distance matrix and return to free map exploration — region circles stay visible for reference. Click **⊙ Select Regions** to start a fresh selection. Use **✕ Close** to exit Region Mode entirely. The main-screen **✕ Reset** button also closes Region Mode and clears all region state.

### Filter Status Strip
A row of chips overlaid on the region map to the right of the search bar shows every active filter at a glance. Chips are grouped contextually — payout-related filters sit together, scenery-related filters sit together — so you can read the map's current state without opening any panels.

| Chip | When shown | Click action |
|---|---|---|
| **Category Colors (N)** / **Payout Colors (N)** | Always | Toggle between color modes |
| **Pilot Payout ≥ N%** | Payout mode on + threshold > 0 | ✕ clears the threshold |
| **No Scenery Indicator** | Always (scenery off) | Turn on Highlight overlay |
| **Black Dot = Has Scenery** | Highlight overlay active | Advance to Airports w Scenery Only mode |
| **Airports w Scenery Only** | Only-scenery mode active | Turn scenery mode off |
| **Rating ≥ N stars** | Star filter active + threshold > 0 | ✕ turns filter off |
| **Category Filtering** | Any of the 7 map categories hidden | ✕ restores all categories |
| **N Owners Displayed** | Airport Owners filter active | ✕ shows all owners; hover to see names + airport counts |
| **[Country name]** / **N Countries** | Country filter active (via search) | ✕ clears country filter; hover "N Countries" to see list |
| **[Continent name]** / **N Continents** | Continent filter active (via search) | ✕ clears continent filter; hover "N Continents" to see list |
| **[ICAO]** / **N Pinned** | Specific airport(s) pinned via ICAO search | ✕ clears pinned airports |
| **−[name]** *(red chip)* | Negation filter active | ✕ un-excludes that item |

The **Category Colors** / **Payout Colors** chip includes a live parenthesised count of how many airport dots are currently visible on the map under all active filters — e.g. *Category Colors (1,247)*. The count updates instantly whenever any filter changes.

The strip clips automatically when it nears the right edge of the map and never overlaps any other controls.

### Pilot Payout Map
Click **💰 Payout** in the toolbar to overlay pilot payout percentages on every airport dot. Dots use a piecewise color scale designed around the SimFly membership tiers: 0% = mid-grey; 1–20% = red through orange-red (the non-premium cap); 20–50% = orange through amber; 50% = pure yellow; 60%+ = pure green. The 50%–60% range gets the most hue separation — a full yellow-to-green shift — making it easy to spot airports where premium pilots have set higher-than-minimum payouts. Tooltip payout labels match the dot color. The payout percentage is shown in every airport tooltip on both the dot hover tooltip and the matrix/distance map tooltips.

A **legend** appears in the top-right corner of the map showing the gradient bar and the 0% / 60%+ endpoints. The legend also serves as a **filter slider** — drag anywhere on the gradient bar to set a minimum payout threshold. Airports below the threshold disappear from both the map dots and the distance matrix instantly, and a **"Hide < N%"** label shows the active cutoff. Drag back to 0 to clear the filter. Toggling Payout mode off resets the filter automatically.

The gray **0% dot** on the legend is also a one-click toggle — click it to switch the filter between 0% (show every airport) and 1% (hide airports with no payout set). When the filter is active the dot dims and gains a yellow inset ring as a visible state cue.

Click the **✕** in the legend's top-right corner to close the panel — same as clicking **💰 Payout** in the toolbar.

### Scenery Rating Filter
Click **⭐ Rating** in the Region Mode toolbar to open the Scenery Rating filter panel. Hover over the five stars to preview a minimum threshold, then click to set it — airports in your Scenery Library with a rating below that value are hidden from both the map dots and the distance matrix. Half-star increments are supported: hover or click the **left half** of a star to set a .5 threshold (e.g. 2.5★), the **right half** for the whole-star value. Click the same value again to clear the filter.

Airports not in your Scenery Library, or in the library with no rating set, are always hidden when any threshold is active. When the Pilot Payout filter is also open, the Scenery Rating panel sits directly beneath it with automatic spacing so both panels remain accessible.

Click the **✕** in the panel's top-right corner to close it — same as clicking **⭐ Rating** in the toolbar.

### Distance Map
An interactive map renders all departure and arrival airports with colour-coded markers. Click any marker to zoom to fit all airports in view. Overlays weather flight category rings when weather data is loaded. When a route is highlighted on the map, the departure and arrival info cards display a **Weather** section with the same decoded breakdown as the badge-hover tooltip (METAR, flight category, wind, visibility, sky, temp/dew, altimeter).

### Weather & Flight Conditions
Click **⛅ Get Weather** to fetch live METARs for all visible airports. Flight category dots (VFR / MVFR / IFR / LIFR) appear on every matrix header and inline on the departure/arrival name lines. Hovering any dot shows a decoded weather breakdown: conditions, wind, visibility, ceiling, altimeter, and raw METAR. Data is cached for 30 minutes and invalidates automatically when you change owners.

### File on SimBrief
Once departure and arrival ICAOs are set, the **File on SimBrief →** button lights up. Click it to open SimBrief's dispatch page pre-filled with your route — ready to generate a full flight plan in one click.

### Aircraft Panel
View aircraft specs relevant to the selected route — estimated flight time, fuel burn, and range figures. The aircraft max-range marker is drawn directly on the distance slider so you can see at a glance which routes are within range. All figures are rough planning estimates; use SimBrief for final calculations.

Aircraft chips, category tabs, top accent bars, and ICAO code labels all share the same per-category palette as the airport dots and matrix headers (red / orange / yellow / green / cyan / blue / magenta for SimFly categories 1–7), so the aircraft category and its corresponding airport tier read in the same hue throughout the app.

Your selection is **remembered between sessions** — the aircraft, fuel%, and payload% are saved to your browser's localStorage the moment you change them, so the app reopens with your last setup intact. Launches from the Reciprocation Tracker (Plan Flight or Send N to AA) still override the saved state for that session, and themselves become the new saved default until you change it.

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
