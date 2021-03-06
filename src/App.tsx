import "./styles.scss";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { MainPage } from "./Pages/MainPage";
import { X01GamesPage } from "./Pages/Games/X01GamesPage";
import { CricketGameMenuPage } from "./Pages/Games/CricketGameMenuPage";
import { CricketGamePlayPage } from "./Pages/Games/CricketGamePlayPage";
import { PlayersPage } from "./Pages/Settings/PlayersPage";
import * as React from "react";

export function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <MainPage />
                </Route>

                <Route
                    path="/games/cricket/:id"
                    render={(params) => {
                        return (
                            <CricketGamePlayPage gameId={params.match.params["id"]} />
                        );
                    }}
                ></Route>

                <Route path="/games/cricket">
                    <CricketGameMenuPage />
                </Route>

                <Route path="/games/x01">
                    <X01GamesPage />
                </Route>

                <Route path="/settings/players">
                    <PlayersPage />
                </Route>
            </Switch>
        </Router>
    );
}
