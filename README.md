# Note Constellation

A neon, zodiac-inspired note-taking interface where ideas become stars in a personal constellation.

## Features

- Cosmic constellation canvas with glowing note nodes
- Zodiac labels and animated star field
- Create and edit notes with tags and neon colors
- Notes persist in browser `localStorage`
- IP location globe for OSINT-style investigation notes
- Public-IP geolocation rendered as an approximate glowing, pulsing map pin
- Responsive layout for desktop and mobile

## IP globe

Use **Locate an IP on the globe** and enter a public IPv4 or IPv6 address. The browser requests approximate geolocation data from `ipapi.co`, then plots the result on the stylized globe.

Geolocation is approximate and should be treated as contextual OSINT data, not an exact physical location. Only investigate systems and addresses you are authorized to research.

## Run locally

Open `index.html` in a browser. No build step is required.

## Visual direction

The interface combines a dark starfield, neon cyan/pink/gold accents, zodiac-inspired labels, and constellation connections to make note-taking feel spatial and exploratory.
