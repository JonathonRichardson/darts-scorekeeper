# Dart Scorekeeper

## Prereqs

Yarn v2 is Required.

For Windows, install VSCode, Windows Terminal and [NVM for Windows](https://github.com/coreybutler/nvm-windows)).

Then, open Windows Terminal.

```
nvm install 14.18.1
```

Now, open Windows Terminal as an administrator (otherwise the `nvm use` command will error on permissions)

```
nvm use 14.18.1
```

Close the admin terminal and go back to your regular one.

```
npm install --global yarn
```

You should be ready to go now.

## Running the Development Site with HMR

The project uses zero installs, however, you still need to run `yarn install` to make sure the packages are configured for your system:

```
yarn install
```

To run the development site:

```
yarn develop
```

The app will be available at http://localhost:9000.

Note that although the app will route you around, the hot reload server will only serve the root index file, so any page refreshes will cause you to get an error like:

```
Cannot GET /games/cricket
```

Just alter the address bar manully to go back to back to the site root: `http://localhost:9000/`.

## Running the Test Suites

To run the interactive cypress tests:

```
yarn run cypress open
```
