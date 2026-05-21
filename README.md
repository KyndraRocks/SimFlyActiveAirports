# SimFly Active Airports

A single-file flight planning tool for SimFly pilots. Download it, open it in any browser, and start planning — no installation, no server, no account required.

This app is a replacement for the [SimFly Active Airports Google Earth map](https://earth.google.com/web/data=Mj0KOwo5CiExN1phTGt0Yl9VclF0YmI4UUFGc0ExRnJuMDN1eGJvcmsSEgoQNTU4N0ZDODY1MzAwMDAwMSABQgIIAEoICJWWvoMBEAE).

**Current version: v2.62.9**

---

## Download

Grab the latest release from the [Releases](https://github.com/KyndraRocks/SimFlyActiveAirports/releases) page. Download `SimFly_Active_Airports-LATEST.html`, open it in your browser, and you're ready to go.

---

## Features

### Point-to-Point Distance
Enter departure and arrival ICAOs to instantly calculate the great-circle distance in nautical miles. An arrow between the fields lets you swap the route direction with one click. Typing a valid owned ICAO auto-selects that pilot's owner entry in the matrix dropdowns.

### Owner Distance Matrix
Choose departure and arrival fleet owners from searchable dropdown panels to generate a full distance matrix — every combination of their airports, at a glance. The owner panels support live text filtering, keyboard navigation (arrows, Space to toggle, Enter to clear the filter), and show each pilot's airport count in the current view.

ICAO labels carry per-category colors (1–7) so airport tier is immediately visible. Each row and column header shows a colored owner stripe bar — click it to lock the matrix to just that owner's airports on that axis. The sticky headers stay pinned as you scroll, and the **⊙ pivot sort bullseye** on each header lets you sort the opposite axis by distance to that airport with a single click — cycle through ⊙ → ▲ nearest → ▼ farthest → ⊙ clear. The two axes sort **independently**: a departure-row ⊙ only ever reorders the arrival columns, and an arrival-column ⊙ only ever reorders the departure rows, so you can have both a row sort and a column sort active at once — and clicking a ⊙ never moves the header you just clicked. The same pivot sorting works in the cross-region matrix, where the Sort dropdown shows each active pivot as an ICAO with a ▲ / ▼ direction arrow.

### Independent Dep / Arr Category Filters
The category filter shows two side-by-side groups — one for departure airports, one for arrivals — so you can cross-filter by tier on each axis independently. "Inv" inverts the selection within its group only. Hovering any numbered circle (1–7) shows a tooltip describing the airport type for that tier — from small unpaved airstrips and grass fields (1) through mega-hubs and world-famous mega-airports (7).

In the cross-region matrix, every dep-side control (the **Dep Owners** dropdown, the **Dep** label, the *All / None / Invert* buttons, the per-airport sort dots on the row headers, and the **DEP** half of the corner cell) renders in **cyan** to match the departure region circle. Every arr-side control renders in **orange** to match the arrival circle. The colour-coding is continuous in idle and hover states, so the side of the route is unmistakable at a glance when scanning the matrix.

### Scenery Library
Track which airports you have add-on scenery installed for, and rate the quality of each one. The library is stored in your browser's localStorage and persists across sessions.

**Adding airports:**
- **Shift+click** any airport dot on the map to toggle it in or out of the library. The first add automatically enables Highlight mode.
- **Right-click (or long-press) any airport dot** to open the **Quick-Rate popover** — set a star rating right from the map. If the airport isn't already in the library, rating it adds it.
- **Paint mode** — click **📍 Add from map** in the library modal to enter a persistent paint mode: click airport dots one-by-one without holding Shift.
- **Autocomplete add** — type an ICAO in the Add Airport field; results from the global airport database appear as you type.
- **Paste ICAOs** — paste any block of text containing ICAOs (space-, comma-, or newline-separated). Tokens are validated against the airport database; unrecognized codes are skipped with a count shown.
- **Import file** — drag and drop (or browse for) a previously exported JSON backup, an X-Plane `scenery_packs.ini`, or an MSFS `scenery.cfg`. ICAOs are extracted automatically.

**Star ratings (0–5, half-star granularity)** — every airport in the library has an interactive 5-star rating shown next to its name. Click the **left half** of a star for a half rating, the **right half** for a full rating; click the same half again to clear back to zero. A live hover preview fills the stars (and a numeric `X.X/5` badge) up to the cursor position so you always know what you're about to set. Ratings are saved automatically, round-trip through Export / Import JSON, and are also shown in the airport's tooltip on the map.

**Quick-Rate popover** — **right-click** any airport dot (or **long-press** for ~½ second on touch devices) to open a small floating popover anchored to that dot. The popover shows the ICAO, airport name, the same big interactive star widget, and whether the airport is currently in your library. Setting a rating on a non-library airport adds it to the library automatically, and turns on Highlight so the black scenery dot appears immediately. Close with **×**, **Esc**, by clicking elsewhere, or by zooming the map.

**Sort and filter** — three dropdowns above the list:
- **Show** — *All airports*, *SimFly-owned only* (filters to airports still owned by an active SimFly player), *Rated only*, or *Unrated only*.
- **Sort** — *ICAO (A–Z)*, *Rating (high to low)*, or *Airport name (A–Z)*.
- **Developer** — narrows the list AND the map to a single developer (see *Store and Developer attribution* below).

The text search box also matches the full airport name in addition to ICAO and addon. The footer shows `X of Y airports` whenever a filter is active, and the empty-state message tailors itself to the chosen filter. Sort and filter selections are persisted to localStorage so your preference survives reloads and new sessions.

**Store and Developer attribution** — each library row has two inline text fields beneath the ICAO line: **Store** (the marketplace where the scenery was purchased) and **Dev** (the publisher / studio). Both fields autocomplete from a built-in list of common marketplaces and developers (Orbx Direct, MSFS Marketplace, SimMarket, FlightSim.to, Just Flight, Aerosoft Shop, …; Orbx, FlyTampa, MK-Studios, FlightBeam, FSDreamTeam, iniBuilds, PMDG, …) **plus** any custom value you've already typed on another row, so your own conventions become suggestions over time. Pressing **Tab** fills the topmost matching value from the suggestion list (e.g. type *simm* then Tab to fill *SimMarket*). Both fields are persisted to localStorage and round-trip through Export / Import JSON. The developer is also shown as a labeled row beneath the star rating in the airport's map tooltip.

**Developer filter** — choosing a developer in the **Developer** dropdown narrows the modal list **and** the map: library airports whose developer doesn't match are hidden from the map dots, airports not in the library are unaffected. An active filter renders as a *Developer: \<name\>* chip in the map filter strip with a ✕ to clear it.

**Row layout** — each library row uses the SimFly category color directly on the ICAO text (the old colored dot left of the ICAO was removed because it could be confused with the weather flight-category dot). For SimFly-owned airports the ICAO + name pair is a clickable link to the SimFly details page; unowned entries render as plain text. ICAO + name, the rating stars, and the ✕ delete button are all sized for comfortable scanning and clicking.

**⚙ View Developer Stats modal** — click the **⚙ View Developer Stats** button in the footer to open a per-developer summary of your library. Lists every developer for whom you have at least one rated airport, with their total airport count, rated count, and **average star rating** displayed at two-decimal precision (e.g. *3.75/5*) using a proportionally-filled star widget. Unrated airports are excluded from the average so they don't pull the developer's rating down. Click any column header to sort by that column (numeric columns default to descending). Click a developer row to expand or collapse their inline airport list (ICAOs render as category-colored chips, with SimFly-detail links when owned); click the **🔍** button next to a developer's name to filter the Scenery Library to that developer.

**🛠 Manage Stores and Developers modal** — click the **🛠 Manage Stores and Developers** button in the footer to open a bulk-edit view of every Store and Developer value in your library. Each value shows the number of airports using it. **Edit a value and click Save** to rename it on every affected airport — rename to the exact spelling of an existing value to merge duplicates (e.g. *Fly Tampa* → *FlyTampa* folds the two into one). The **✕** button clears the value from every airport that uses it, after a confirm prompt reporting exactly how many airports will be affected.

**Unsaved-changes backup banner** — when the library has pending changes, a yellow banner appears showing **"N unsaved change(s)"** alongside two buttons. **💾 Save** downloads a JSON backup of the library and dismisses the banner without closing the modal so you can keep editing. **Close** dismisses the modal while preserving the unsaved-changes state — the banner reappears next time you open the modal until you actually export.

**Display modes** — the **⬤ Scenery** split button in the toolbar cycles through three states:
- **Off** — no scenery indicators shown
- **Highlight** — all airports remain visible; scenery airports gain a black center dot on the map
- **Only** — the map, the owner distance matrix, and the Select Regions matrix all filter to scenery-library airports only

**Backup & restore** — use **Export JSON** in the overflow menu (⋯) to download your library (ratings included). If you have unsaved changes — including via shift-click on the map — the **⬤ Scenery** button pulses with a yellow glow as a reminder. Opening the modal shows the unsaved-changes banner at the top, and the ✕ close button is suppressed until you choose to download or dismiss. Choosing **Close anyway** closes the modal but keeps the dirty state: the glow persists on the button and the banner reappears the next time you open the modal, until you actually export. The banner shows the exact number of pending changes (e.g. *7 unsaved changes — download a backup before closing?*).

### Map
A full-screen map-based region selector for cross-region matrix planning. Draw circles around departure and arrival regions to pull in every player-owned airport in those areas, then explore the resulting distance matrix with sticky headers, owner stripe click-to-filter, and a rolling dot-click routing system. Either region can be repositioned after drawing by dragging its center pin — and if you drag a region (or aim the arrival in the ruler phase) toward a map edge, the map smoothly auto-pans so regions can be placed far apart, re-fitting both into view when you release.

**Map dot routing** — click any airport dot on the map to build a route. Behavior depends on whether the distance matrix is visible. **Before both regions are drawn — and for any click on a background dot outside both region circles** — clicks follow an anchor model: the **first click** sets the departure, the next click sets the arrival, subsequent clicks replace the arrival, and re-clicking the current departure clears the entire route. **Once both regions are drawn and the matrix is visible**, the model becomes **region-aware**: clicking inside the **dep region** always sets or changes the departure, and clicking inside the **arr region** always sets or changes the arrival, regardless of click order — so you can adjust either endpoint with a single click. Overlap airports (inside both circles) toggle to whichever slot they aren't already in. Use the **✕ Clear** button to reset the route. The selected pair is immediately reflected in the main screen departure and arrival fields. The departure and arrival ICAOs are displayed as large chips in the header, each followed by a **colored flight-category dot** (VFR / MVFR / IFR / LIFR) once a METAR is in the cache — route weather reads at a glance without opening any tooltip. SimFly-owned airports render as clickable links to their SimFly details page; **hovering either chip** shows the full airport tooltip (name, owner, category, elevation, runway details, and the live decoded weather block) — and, when an aircraft is selected, that airport's suitability for its role in the route, including an in-range / out-of-range check on the arrival, matching the main-screen matrix tooltips. The **⇄** button between the two chips swaps departure and arrival in one click, syncing the route line, matrix highlight, and main-screen ICAO inputs together. The route and selection rings persist through ⊙ DONE and ⊙ Select Regions so you can reference or extend the pair while drawing new regions. Selecting a cell in the distance matrix or clicking a row/column header routes the same way. **Double-click** any dot to zoom the map to that airport.

**Unique Arrivals mode** — a small Venn-icon toggle in the results bar (next to *Max per region*) is a **three-state cycle**: *Off* → *↗ Far* → *↘ Near* → *Off*. When active, the matrix keeps every departure row but **hides any arrival column whose airport also appears in the departure region** — so the grid shows only routes that *land* at airports unique to the arr region. Map dots stay untouched: every airport in either region remains visible so you can still route via dot clicks. While the mode is active, *Max per region* applies asymmetrically: the dep cap always keeps the N airports closest to the dep center, but the arr cap follows the selected direction — *↗ Far* (default on activation) keeps the N airports farthest from the arr center (favours the arr-region edge where overlap with dep is least likely, maximising the number of truly-unique arrivals); *↘ Near* keeps the N airports closest to the arr center instead. The active direction is shown as a coloured badge directly on the button, and the tooltip explains what the next click will do.

**Send to Flight Planner →** closes the map and populates the main screen with the selected departure, arrival, and category filter state — ready to file on SimBrief in one more click.

A **Map category filter** in the header bar hides entire airport categories from the background dot layer across the whole map — toggling it also live-syncs both dep and arr category filters on the main screen. Independent **Dep / Arr category filters** in the results bar narrow each side of the matrix by tier and take precedence over the map filter within their region rings. Category filter selections are preserved when re-entering the map.

**Airport Owners filter** — the **Airport Owners ▾** dropdown in the header filters which owners' airports appear as dots on the map, independently of the Dep/Arr owner controls in the results bar. Use it to declutter the map to specific pilots without affecting the matrix. The panel supports the same interaction model as the dep/arr menus: type-ahead search, All/None buttons, arrow-key navigation, Space to toggle, and a count badge on the button when a filter is active. **Hovering** the dropdown shows a color legend listing every owner currently in the filter with their assigned dot color. When you open the map with owners already selected on the main screen, the Airport Owners filter automatically pre-syncs to those owners so the map opens focused on the relevant airports.

**Owner-colored map dots** — the **🎨 button** immediately to the right of the *Airport Owners* dropdown switches the map dots from category / payout colors to a unique per-owner color. The button is greyed out until at least one owner is selected; once enabled, click it to engage or disengage owner coloring. The mode chip in the filter strip (*Category Colors (N)* / *Payout Colors (N)*) extends to a three-way cycle when owner filtering is active: *category → payout → owner → category*. Up to 16 selected owners each get a maximally-distinct curated color; above 16 owners the assignment falls back to the hash-based palette used by the region-matrix owner stripes.

**Cross-app pilot group launch** — passing a `pilots=` URL parameter (comma-separated pilot names, e.g. `?pilots=Alice,Bob`) opens the app directly into the map with the Airport Owners filter pre-set to exactly those pilots, and the map auto-switched to **owner colors** so each pilot's airports are immediately distinguishable. (You can still toggle to category or payout colors via the 🎨 button afterward.) The SimFly Reciprocation Tracker and Relationship Manager Lite both use this to send a selected group from the Balance Queue straight to the map with one click.

**Map search** — a floating search box in the top-left corner of the map lets you find any airport by ICAO, name, owner, country, region / state / province, continent, or **scenery developer**. Up to 10 results appear ranked by relevance, with your loaded (owned) airports ranked above non-owned airports from the global OurAirports database. When the query matches an owner name, a **⊙ Filter map →** row appears. When the query matches a country (e.g. *Germany*), region / state / province (e.g. *California*, *Bavaria*, *Ontario* — 📍 icon), or continent (e.g. *Europe*, *North America*), a **Filter map →** row appears showing the count of SimFly-owned airports in that scope. When the query matches a developer name from your Scenery Library (e.g. *Orbx*, *FlyTampa* — 📦 icon), a **Filter map →** row appears showing the count of SimFly-owned airports tagged with that developer in your library. Selecting any of those rows filters the map to those airports. Selecting an individual ICAO result **pins** that airport as a visible dot on the map regardless of other filters — SimFly-owned airports appear in their normal category color; non-owned airports appear as a gray dot. **After every search action the map zooms to fit every currently-visible airport** — typing *KSEA* then *+KPDX* frames both pinned airports together; adding more pins or filters expands the view as needed. A chip for each active filter appears in the filter status strip with a ✕ to clear it independently. Region chips show the region name when one is active, or "*N Regions*" with a hover tooltip listing each region when multiple are active. The developer chip ("*Orbx*" for a single developer or "*N Developers*" for multiple) shows a hover legend listing each active developer with a right-justified count of currently-visible airports — the count honors every other active filter, so e.g. hiding a category drops the per-developer counts in the legend by the same amount. Keyboard: ↑/↓ to navigate, Enter to activate the top result, Esc to dismiss.

**Additive search** — prefix any search with `+` to add its results to the existing map filter rather than replacing it. For example: search *Kyndra* to show Kyndra's airports; then *+StarVen* to also show StarVen's airports; then *+California* to also include California airports; then *+Germany* to also show all SimFly airports in Germany; then *+Orbx* to also include Orbx-developed airports; then *+EGLL* to also pin EGLL as a gray dot. Each active filter gets its own breadcrumb chip. A non-prefixed search replaces all active filters.

**Negation search** — prefix any search with `-` to exclude rather than include. *-Germany* removes all German airports; *-California* removes all California airports; *-Europe* removes all European airports; *-Kyndra* removes Kyndra's airports from the owner filter (or adds her to an excluded-owners set); *-Orbx* hides all Orbx-developed airports; *-EGLL* removes EGLL from the pinned set. Excluded items appear as red-tinted chips in the filter status strip with a ✕ to un-exclude.

**METAR on route assignment** — clicking an airport dot to set the route departure or arrival automatically fetches that airport's current METAR (with a nearest-station fallback). When the data arrives, the airport's dot tooltip on the map gains a compact weather row beneath the existing scenery / developer rows: a colored *VFR / MVFR / IFR / LIFR* pill, wind in *DDD°/KKkt* form, and visibility. Cached METARs (30-minute TTL) are reused, so re-selecting the same airport doesn't repeat the API call.

The map includes a **📐 Measurement** ruler — click **📐 Measurement** in the toolbar to activate it. The on-map label adapts units to the scale: at 20,000 ft and under it shows feet and meters; above that threshold it shows nautical miles and kilometres (two decimal places up to 100 nm, whole numbers above). Magnetic heading is sourced from the NOAA WMM API for sub-degree accuracy. Saved measurements are **movable, rotatable, and resizable** — grab the origin handle to translate the whole measurement (direction and distance preserved), or the **edge handle at the line's endpoint** to drag the endpoint anywhere: distance AND bearing both follow the cursor. The edge handle hides while you're dragging and snaps back into place on release. Each saved measurement also has a **✕ close handle** pinned at 12 o'clock (always at the top of the ring regardless of which way the line points) — click it to remove that specific measurement without disturbing any others. The header **✕ Clear All** button appears whenever one or more measurements are on the map and wipes them all in one click. The distance / bearing label rides the cursor (with a below-line offset) while you're drawing or adjusting; it snaps to the line's midpoint when you release. For short measurements where the centered label would extend past the endpoints, the label auto-shifts below the line so the origin pin and edge handle stay fully visible. **Ring color** is tile-mode aware: purple on street tiles, bright yellow on satellite imagery — toggling the tile mode retroactively repaints every existing measurement so old rings match the new background. Resizing works all the way down to runway scale — drag the edge handle in to read off runway lengths in feet directly from the map. The saved label uses the same smart-units ladder as the live label, so a resized measurement renders identically to a freshly drawn one. Starting a new region selection (**⊙ Select Regions**) automatically toggles measurement mode off so the two workflows don't compete for left-click; saved measurements stay on the map. A selectable airport cap per region (100 · 250 · 500 · 750 · 1,000) and searchable **Dep / Arr owner dropdowns** with live text filtering round out the toolbar. Each owner entry shows their airport count for the region in parentheses (e.g. *Pilot One (3)*), and the panel expands to fit the widest name automatically. Any character typed while a panel is open — or while the dropdown button itself has keyboard focus — opens the panel and routes to the filter box, no click required. Arrow keys move a highlight through the filtered names; Space toggles the highlighted row checked or unchecked; Enter clears the filter while preserving selections. New pilots appear auto-deselected by default.

**Right-mouse drag = pan the map** — throughout the map, in every phase and mode, right-mouse drag pans it. Left-click is owned by whatever workflow is active (region draw, measurement draw, dot click, handle drag), so right-mouse is the consistent navigation gesture that never interferes. A pure right-click without dragging preserves its original meaning: over an airport dot in explore / results, it opens the Quick-Rate popover; over the map during region drawing, it cancels the in-progress selection.

**Crosses antimeridian cue** — when a route, measurement, or dep→arr region distance crosses ±180° longitude (e.g. New Zealand to Hawaii), Leaflet draws the visual line the long way across the map even though the displayed distance is the short-way real-world figure. In that case the on-map distance chip shows a second row reading **Crosses antimeridian** (amber pill with a dark navy background so it's legible on both street and satellite tiles), and the line itself switches to a dashed style so the apparent mismatch is explained at a glance.

Before drawing the first region circle, a **Cancel** button is available — clicking it returns to the region-selector state without drawing anything. A pure **right-click** anywhere on the map during the in-progress region-drawing sequence also cancels the operation and returns to the explore state — handy when you want to abort mid-draw without moving the cursor off the map. (Right-click *drag* always pans the map, so the cancel gesture is specifically the click-without-movement form.) During drawing, use **↩ Undo** to step back one phase within the region-drawing flow. Click **⊙ DONE** (results phase only) to collapse the distance matrix and return to free map exploration — region circles stay visible for reference. Click **⊙ Select Regions** to start a fresh selection. Use **✕ Close** to close the map entirely. The main-screen **✕ Reset** button also closes the map and clears all region state.

**Matrix honors every map filter** — every visibility filter that controls the dot layer (country, region / state, continent, pinned, exclusion sets, scenery toggle, scenery developer, payout threshold, star rating, global category) also gates which airports appear in the region matrix. The matrix and the dot layer go through a single chokepoint, so an airport hidden on the map can never show up in the matrix. Changing any filter while regions are drawn re-filters the matrix live alongside the dots.

### Filter Status Strip
A row of chips overlaid on the map to the right of the search bar shows every active filter at a glance. Chips are grouped contextually — payout-related filters sit together, scenery-related filters sit together — so you can read the map's current state without opening any panels.

| Chip | When shown | Click action |
|---|---|---|
| **Category Colors (N)** / **Payout Colors (N)** | Always | Toggle between color modes |
| **Pilot Payout ≥ N%** | Threshold > 0 (any color mode) | ✕ clears the threshold |
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

A **legend** appears in the top-right corner of the map showing the gradient bar and the 0% / 60%+ endpoints. The legend also serves as a **filter slider** — drag anywhere on the gradient bar to set a minimum payout threshold. Airports below the threshold disappear from both the map dots and the distance matrix instantly, and a **"Hide < N%"** label shows the active cutoff. Drag back to 0 to clear the filter.

The filter is **independent of the color mode**. Setting a threshold continues to hide airports below it whether dots are coloured by category, payout, or owner — so cycling the *Category Colors* / *Payout Colors* / *Owner Colors* breadcrumb chip preserves the filter across the switch. The *Pilot Payout ≥ N%* breadcrumb chip stays visible in every mode so you can clear the filter via its ✕ from any color view. Clicking the **💰 Payout** button to turn payout color mode off explicitly still resets the filter — that path is the explicit "reset payout" gesture.

The gray **0% dot** on the legend is also a one-click toggle — click it to switch the filter between 0% (show every airport) and 1% (hide airports with no payout set). When the filter is active the dot dims and gains a yellow inset ring as a visible state cue.

Click the **✕** in the legend's top-right corner to close the panel — same as clicking **💰 Payout** in the toolbar.

### Scenery Rating Filter
Click **⭐ Rating** in the map toolbar to open the Scenery Rating filter panel. Hover over the five stars to preview a minimum threshold, then click to set it — airports in your Scenery Library with a rating below that value are hidden from both the map dots and the distance matrix. Half-star increments are supported: hover or click the **left half** of a star to set a .5 threshold (e.g. 2.5★), the **right half** for the whole-star value. Click the same value again to clear the filter.

Airports not in your Scenery Library, or in the library with no rating set, are always hidden when any threshold is active. When the Pilot Payout filter is also open, the Scenery Rating panel sits directly beneath it with automatic spacing so both panels remain accessible.

Click the **✕** in the panel's top-right corner to close it — same as clicking **⭐ Rating** in the toolbar.

### Distance Map
An interactive map renders all departure and arrival airports with colour-coded markers. Click any marker to zoom to fit all airports in view. Overlays weather flight category rings when weather data is loaded. When a route is highlighted on the map, the departure and arrival info cards display a **Weather** section with the same decoded breakdown as the badge-hover tooltip (METAR, flight category, wind, visibility, sky, temp/dew, altimeter).

### Weather & Flight Conditions
The departure and arrival airports auto-fetch a METAR the moment you set or change either ICAO, and again whenever you return to the tab if their cached data is older than 30 minutes — the route endpoints are always current without you doing anything. Click **⛅ Get Weather** to additionally fetch live METARs for every other airport currently in view in one batch. Flight category dots (VFR / MVFR / IFR / LIFR) appear on every matrix header and inline on the departure/arrival name lines. Hovering any dot shows a decoded weather breakdown: conditions, wind, visibility, ceiling, altimeter, and raw METAR. **Hovering the big departure or arrival ICAO / name text** on the main screen also includes the full decoded weather section in the tooltip — flight category pill, raw METAR, wind, visibility, sky, temperature / dewpoint, altimeter, observed time — alongside the existing airport details (owner, runways, etc.). If you hover before the METAR arrives, the tooltip refreshes itself in place the moment the data lands. Data is cached for 30 minutes and invalidates automatically when you change owners.

### File on SimBrief
Once departure and arrival ICAOs are set, the **File on SimBrief →** button lights up. Click it to open SimBrief's dispatch page pre-filled with your route — ready to generate a full flight plan in one click.

### Aircraft Panel
View aircraft specs relevant to the selected route — estimated flight time, fuel burn, and range figures. The aircraft max-range marker is drawn directly on the distance slider so you can see at a glance which routes are within range. All figures are rough planning estimates; use SimBrief for final calculations.

Aircraft chips, category tabs, top accent bars, and ICAO code labels all share the same per-category palette as the airport dots and matrix headers (red / orange / yellow / green / cyan / blue / magenta for SimFly categories 1–7), so the aircraft category and its corresponding airport tier read in the same hue throughout the app.

Each chip in the grid shows the type's ICAO code, full aircraft name, and max range — kept compact so the whole category fits on screen at a glance. Hovering a chip highlights all three text lines in yellow for clear feedback. The detailed spec strip — takeoff and landing distances, both at full MTOW and adjusted for your current fuel and payload settings — appears below the grid once an aircraft is selected.

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
- **Magnetic heading** — [NOAA World Magnetic Model](https://www.ngdc.noaa.gov/geomag/WMM/) (map ruler)
- **Flight planning** — [SimBrief](https://www.simbrief.com)

---

## Usage Notes

- Works entirely in the browser — no data leaves your machine except for the OurAirports fetch and live weather requests.
- Tested in Chrome and Edge. Safari and Firefox are generally compatible.
- The file can be saved locally and used offline (weather and airport database lookups require an internet connection).
- The interface scales with your display — the main screen and the Help / Release Notes panels widen to use roughly half the viewport on large (1440p / 4K) monitors, while staying at a comfortable fixed width on 1080p and smaller screens.
