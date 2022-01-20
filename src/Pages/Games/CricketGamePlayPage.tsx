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
import "./CricketGamePlayPage.scss";
import { ScoreCard } from "./CricketGamePlayPage.ScoreCard";

interface IProps {
    gameId: string;
}

interface IState {
    currentlyEnteringScore: boolean;
}

export class CricketGamePlayPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            currentlyEnteringScore: false,
        };
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

        let playerHalfwayIndex = Math.ceil(game.players.length / 2);

        return (
            <div className="cricket--game-play-page">
                <header>
                    <Card className="blocks">
                        <Card.Subtitle>Current Round</Card.Subtitle>
                        <Card.Title className="round-number">
                            {derivedState.round}
                        </Card.Title>
                    </Card>

                    <img
                        src={derivedState.currentPlayer.playerInfo.profilePic}
                        className="card-img"
                        alt="..."
                        style={{
                            height: 300,
                            width: 350,
                        }}
                    />

                    <Card className="blocks">
                        <Card.Subtitle>Current Player</Card.Subtitle>
                        <Card.Title className="round-number">
                            {derivedState.currentPlayer.playerInfo.name}
                        </Card.Title>
                    </Card>
                </header>

                <section className="main" style={{ display: "flex" }}>
                    {this.state.currentlyEnteringScore ? (
                        <>
                            <Dartboard
                                height="650"
                                width="650"
                                onSegmentClick={this.handleSegmentClick.bind(
                                    this
                                )}
                            />

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
                            </div>
                        </>
                    ) : (
                        <>
                            <div style={{ display: "flex" }}>
                                {game.players
                                    .splice(0, playerHalfwayIndex)
                                    .map((player, playerIndex) => {
                                        return (
                                            <ScoreCard
                                                playerName={
                                                    player.playerInfo.name
                                                }
                                                score={
                                                    currentScores[playerIndex]
                                                }
                                                isCurrentPlayer={
                                                    this.getDerivedProps()
                                                        .currentPlayer
                                                        .playerInfo.id ===
                                                    player.playerInfo.id
                                                }
                                            />
                                        );
                                    })}

                                <div className="scorecard labels">
                                    <ol>
                                        {[
                                            "15",
                                            "16",
                                            "17",
                                            "18",
                                            "19",
                                            "20",
                                        ].map((segmentId) => {
                                            return <li>{segmentId}</li>;
                                        })}

                                        <li>Score</li>
                                    </ol>
                                </div>

                                {game.players
                                    .splice(-playerHalfwayIndex)
                                    .map((player, playerIndex) => {
                                        return (
                                            <ScoreCard
                                                playerName={
                                                    player.playerInfo.name
                                                }
                                                score={
                                                    currentScores[
                                                        playerIndex +
                                                            playerHalfwayIndex
                                                    ]
                                                }
                                                isCurrentPlayer={
                                                    this.getDerivedProps()
                                                        .currentPlayer
                                                        .playerInfo.id ===
                                                    player.playerInfo.id
                                                }
                                            />
                                        );
                                    })}
                            </div>
                        </>
                    )}
                </section>

                <footer>
                    <Link className="nav-button" to="/games/cricket">
                        Game List
                    </Link>

                    <button
                        className="nav-button"
                        onClick={(e) => {
                            this.setState((curState) => {
                                return {
                                    currentlyEnteringScore:
                                        !curState.currentlyEnteringScore,
                                };
                            });
                            if (this.state.currentlyEnteringScore) {
                                this.handleNextTurn();
                            }
                        }}
                    >
                        {this.state.currentlyEnteringScore
                            ? "Done (Next Round)"
                            : "Record Your Throws"}
                    </button>

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
                        className="nav-button"
                    >
                        Go To Previous Turn
                    </Button>
                </footer>
            </div>
        );
    }
}
