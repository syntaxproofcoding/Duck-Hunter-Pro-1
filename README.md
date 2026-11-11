# TPS Notes

Parser, notes, call tracking and progress for TruePeopleSearch profiles, built for Android (Chrome).

- index.html: the app. Works offline once installed (Chrome menu > Install app).
- duck.html: Duck View, a 3D satellite map of your entries (needs internet; uses Mapbox).
- sw.js: offline support. When updating, raise the CACHE number on its first line.
- supabase-setup.sql: one-time setup for cloud sync (run in Supabase > SQL Editor).

Your data lives on your phone. If you sign in to Cloud sync (Stats tab), it is also saved to your private Supabase project.
Duck View sends entry addresses to Mapbox to place them on the map.

Caller lookup: opening the app as `https://syntaxproofcoding.github.io/Duck-Hunter-Pro-1/#call=NUMBER` shows that caller's entry (MacroDroid does this on incoming calls). The number stays on the phone; it isn't sent to GitHub.
