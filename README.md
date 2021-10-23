# Dart Scorekeeper

## Prereqs

The only prereq is yarn v2+.

## Running the Development Site with HMR

To run the development site:

```
yarn run webpack serve --hot
```

The app will be available at http://localhost:9000.

Note that although the app will route you around, the hot reload server will only serve the root index file, so any page refreshes will cause you to get an error like:

```
Cannot GET /games/cricket
```

Just alter the address bar manully to go back to back to the site root: `http://localhost:9000/`.