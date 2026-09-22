# Note Constellation

A neon, zodiac-inspired note-taking interface where ideas become stars in a personal constellation, with an OSINT-friendly dated IP signal map.

## Features

- Cosmic constellation canvas with glowing note nodes
- Zodiac labels and animated star field
- Add and edit notes with tags and neon colors
- Notes and IP observations persist in browser `localStorage`
- Enter a public IP plus an observation date to create a location record
- Approximate IP geolocation shown as a glowing pulsing pin on the constellation and globe
- Signal history cards and JSON export
- Responsive desktop and mobile layout

## Dated IP signals

Select **Add dated IP**, enter a public IPv4 or IPv6 address, choose the date associated with the observation, and optionally add a case label. The app uses `ipapi.co` for an approximate latitude/longitude lookup, then creates a persistent pin and dated history card.

Each observation is kept as a separate record, so repeated sightings of the same IP on different dates create separate pins/events. This is useful for organizing authorized missing-person, incident-response, and OSINT research timelines.

Geolocation is approximate and should not be treated as an exact physical address. The app does not ping or scan the target; it performs a public geolocation lookup. Use it only with addresses and investigations you are authorized to research, and consider the privacy and safety of people involved.

## Run locally

Open `index.html` in a browser. No build step is required. An internet connection is needed for IP geolocation lookups.

## Export

Use **Export JSON** to download the locally stored IP observation records for a case file or timeline workflow.
