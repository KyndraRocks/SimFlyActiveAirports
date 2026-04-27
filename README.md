# SimFly Active Airports

A single-file flight planning tool for SimFly users. Download it, open it in any browser, and start planning — no installation, no server, no account required.

**Current version: v2.16.14**

---

## Download

Grab the latest release from the [Releases](https://github.com/KyndraRocks/SimFlyActiveAirports/releases) page. Download `SimFly_Active_Airports-LATEST.html`, open it in your browser, and you're ready to go.

---

## Features

### Point-to-Point Distance
Enter departure and arrival ICAOs to instantly calculate the great-circle distance in nautical miles. An arrow between the fields lets you swap the route direction with one click.

### Owner Distance Matrix
Select departure and arrival fleet owners from dropdown menus to generate a full distance matrix — every combination of their airports, at a glance. Sort any row or column, filter by distance range or airport category, and click any cell to populate the ICAO fields.

### Distance Map
An interactive map renders all departure and arrival airports with colour-coded markers. Click any marker to zoom to fit all airports in view. Overlays weather flight category rings when weather data is loaded.

### Weather & Flight Conditions
Flight category dots (VFR / MVFR / IFR / LIFR) appear on every matrix header and inline on the departure/arrival name lines. Hovering any dot shows a decoded weather breakdown: conditions, wind, visibility, ceiling, altimeter, and raw METAR. Data is cached for 30 minutes and invalidates automatically when you change owners.

### File on SimBrief
Once departure and arrival ICAOs are set, the **File on SimBrief →** button lights up. Click it to open SimBrief's dispatch page pre-filled with your route — ready to generate a full flight plan in one click.

### Aircraft Panel
View aircraft specs relevant to the selected route — estimated flight time, fuel burn, and range figures. All figures are rough planning estimates; use SimBrief for final calculations.

### Airport Info & External Links
Click any ICAO to open a tooltip with runway details, surface type, elevation, and direct links to external resources.

---


## Data Sources

- **Airport database** — [OurAirports](https://ourairports.com) (open data, fetched at runtime)
- **Weather** — [CheckWX](https://www.checkwxapi.com) (requires free API key)
- **Flight planning** — [SimBrief](https://www.simbrief.com)

---

## Usage Notes

- Works entirely in the browser — no data leaves your machine except for the OurAirports fetch and optional CheckWX weather requests.
- Tested in Chrome and Edge. Safari and Firefox are generally compatible.
- The file can be saved locally and used offline (weather and airport database lookups require an internet connection).
