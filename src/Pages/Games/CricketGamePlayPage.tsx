import * as React from "react";
import "./X01GamesPage.scss";
import { Link } from "react-router-dom";
import { IDartValue, ISegmentType } from "../../Components/Segment";
import { Dartboard } from "../../Components/Dartboard";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import {
    getBlankScore,
    IGame,
    IGameDB,
    IPlayerScore,
    IThrowResult,
    LocalStorageGameDB,
} from "../../data/GamesDB";
import { calculateScores } from "./Cricket/Scorer";

interface IProps {
    gameId: string;
}

interface IState {}

export class CricketGamePlayPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    private getDB(): IGameDB {
        return new LocalStorageGameDB();
    }

    private getGame(): IGame {
        let db = this.getDB();

        return db.getGames().filter((x) => x.id == this.props.gameId)[0];
    }

    getDerivedProps() {
        let game = this.getGame();
        let playerIndex = game.turnNumber % game.players.length;

        return {
            round: Math.floor((game.turnNumber + 2) / game.players.length),
            currentPlayer: game.players[playerIndex],
            currentPlayerIndex: playerIndex,
        };
    }

    handleNextTurn() {
        let game = this.getGame();
        let newGame = {
            ...game,
            turns: [...game.turns, []],
            turnNumber: game.turnNumber + 1,
        };

        this.getDB().saveGame(newGame);
        this.forceUpdate();
    }

    handleSegmentClick(curThrow: IThrowResult) {
        if (curThrow.type === "Label") {
            return; // do nothing
        }

        let game = this.getGame();

        let turns = [...game.turns];

        let thisRound = turns[game.turnNumber] || [];

        if (thisRound.length === 3) {
            thisRound[2] = curThrow;
        } else {
            thisRound.push(curThrow);
        }

        turns[game.turnNumber] = thisRound;

        game.turns = turns;

        this.getDB().saveGame(game);

        this.forceUpdate();
    }

    calculateScores(): IPlayerScore[] {
        let game = this.getGame();

        return calculateScores(game);
    }

    render() {
        let { props } = this;
        let game = this.getGame();
        let derivedState = this.getDerivedProps();

        let currentTurn = game.turns[game.turnNumber];

        let currentScores = this.calculateScores();

        return (
            <div>
                <h2>
                    <Link to="/">&lt; Home</Link> Game {props.gameId}
                </h2>

                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Card>
                        <Card.Title>{derivedState.round}</Card.Title>
                        <Card.Subtitle>Current Round</Card.Subtitle>
                    </Card>

                    <div className="card mb-3" style={{ maxWidth: 540 }}>
                        <div className="row no-gutters">
                            <div className="col-md-4">
                                <img
                                    src={
                                        derivedState.currentPlayer.playerInfo
                                            .profilePic
                                    }
                                    className="card-img"
                                    alt="..."
                                />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">
                                        Currently Throwing
                                    </h5>
                                    <p className="card-text">
                                        {
                                            derivedState.currentPlayer
                                                .playerInfo.name
                                        }
                                    </p>
                                    <p className="card-text">
                                        <small className="text-muted">
                                            Last updated 3 mins ago
                                        </small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ display: "flex" }}>
                    <Dartboard
                        height="550"
                        width="550"
                        onSegmentClick={this.handleSegmentClick.bind(this)}
                    />

                    <div>
                        <div style={{ display: "flex" }}>
                            {[0, 1, 2].map((roundIndex, i) => {
                                let round = currentTurn[roundIndex];
                                return (
                                    <div
                                        style={{
                                            outline: "blue",
                                            margin: 10,
                                            width: 135,
                                            height: 70,
                                        }}
                                    >
                                        <h4>{i + 1}</h4>
                                        {round && (
                                            <h5>
                                                {round.value} / {round.type}
                                            </h5>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div style={{ display: "flex" }}>
                            <Button
                                onClick={() => {
                                    let game = this.getGame();

                                    // Don't let the game unwind completely
                                    if ((game.turnNumber = 1)) {
                                        return;
                                    }

                                    let turns = [...game.turns];

                                    game.turns = turns.slice(0, -1);
                                    game.turnNumber = game.turnNumber - 1;

                                    this.getDB().saveGame(game);
                                    this.forceUpdate();
                                }}
                                disabled={game.turnNumber <= 1}
                            >
                                Go To Previous Turn
                            </Button>
                            <Button
                                onClick={() => {
                                    let game = this.getGame();

                                    let turns = [...game.turns];

                                    turns[game.turnNumber] = turns[
                                        game.turnNumber
                                    ].slice(0, -1);

                                    game.turns = turns;

                                    this.getDB().saveGame(game);
                                    this.forceUpdate();
                                }}
                            >
                                Unthrow
                            </Button>
                            <Button onClick={this.handleNextTurn.bind(this)}>
                                Next Round
                            </Button>
                        </div>

                        <hr />

                        <div style={{ display: "flex" }}>
                            {game.players.map((player, playerIndex) => {
                                let score = currentScores[playerIndex];

                                let isCurrentPlayer =
                                    this.getDerivedProps().currentPlayer
                                        .playerInfo.id === player.playerInfo.id;

                                return (
                                    <div
                                        style={{
                                            outline: isCurrentPlayer
                                                ? "1px solid blue"
                                                : undefined,
                                            borderRadius: 10,
                                            margin: 10,
                                            padding: 10,
                                        }}
                                    >
                                        <h4>{player.playerInfo.name}</h4>
                                        <h5>
                                            Score:{" "}
                                            <span
                                                data-qa-score-for={
                                                    player.playerInfo.name
                                                }
                                            >
                                                {score.points}
                                            </span>
                                        </h5>

                                        <ol>
                                            {[
                                                "15",
                                                "16",
                                                "17",
                                                "18",
                                                "19",
                                                "20",
                                            ].map((segmentId) => {
                                                let count =
                                                    (score.marks as any)[
                                                        segmentId
                                                    ] || 0;

                                                let display =
                                                    count === 1
                                                        ? "∕"
                                                        : count === 2
                                                        ? "✕"
                                                        : count === 0
                                                        ? " "
                                                        : count === 3
                                                        ? "⦻"
                                                        : "?";

                                                return (
                                                    <li
                                                        style={{ fontSize: 28 }}
                                                    >
                                                        {segmentId}: {display}
                                                    </li>
                                                );
                                            })}
                                        </ol>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
