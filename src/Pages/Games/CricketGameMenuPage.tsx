import * as React from "react";
import "./X01GamesPage.scss";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { getBlankScore, LocalStorageGameDB } from "../../data/GamesDB";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { LocalStoragePlayerDB } from "../../data/PlayerDB";
import moment from "moment";

interface IProps {}

interface IState {
    playersForGame?: string[];
}

export class CricketGameMenuPage extends React.Component<IProps, IState> {
    state: IState = {};

    render() {
        let db = new LocalStorageGameDB();
        let games = db.getGames();
        let playersDB = new LocalStoragePlayerDB();

        return (
            <div>
                <h2>
                    <Link to="/">&lt; Home</Link>
                </h2>
                <ul className="tg-list">
                    <li className="tg-list-item">
                        <h4>Double In</h4>
                        <input
                            id="cb1"
                            className="tgl tgl-light"
                            type="checkbox"
                        />
                        <label className="tgl-btn" htmlFor="cb1" />
                    </li>
                </ul>

                {games.map((game) => {
                    return (
                        <Card style={{ width: "18rem" }}>
                            <Card.Body>
                                <Card.Title>{game.id}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {moment(game.startedAt).fromNow()}
                                </Card.Subtitle>
                                <Card.Text>
                                    {game.players
                                        .map((p) => p.playerInfo.name)
                                        .join(", ")}
                                </Card.Text>

                                <Link
                                    className="btn btn-success"
                                    to={`/games/cricket/${game.id}`}
                                >
                                    Play Game
                                </Link>
                                {/* <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link> */}
                            </Card.Body>
                        </Card>
                    );
                })}

                <Modal show={!!this.state.playersForGame}>
                    <Modal.Header closeButton>
                        <Modal.Title>New Game</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            {playersDB.getPlayers().map((player) => {
                                return (
                                    <div key={player.id} className="mb-3">
                                        <Form.Check
                                            type="checkbox"
                                            label={player.name}
                                            id={player.id}
                                            checked={
                                                this.state.playersForGame &&
                                                !!this.state.playersForGame.find(
                                                    (x) => x == player.id
                                                )
                                            }
                                            onClick={() => {
                                                this.setState((curState) => {
                                                    let currentPlayers =
                                                        curState.playersForGame
                                                            ? [
                                                                  ...curState.playersForGame,
                                                              ]
                                                            : [];

                                                    if (
                                                        currentPlayers.find(
                                                            (x) =>
                                                                x == player.id
                                                        )
                                                    ) {
                                                        currentPlayers =
                                                            currentPlayers.filter(
                                                                (x) =>
                                                                    x !==
                                                                    player.id
                                                            );
                                                    } else {
                                                        currentPlayers.push(
                                                            player.id
                                                        );
                                                    }

                                                    return {
                                                        playersForGame:
                                                            currentPlayers,
                                                    };
                                                });
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                this.setState({
                                    playersForGame: undefined,
                                });
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            disabled={
                                !this.state.playersForGame ||
                                this.state.playersForGame.length == 0
                            }
                            onClick={() => {
                                if (this.state.playersForGame) {
                                    db.saveGame({
                                        id: `${db.getGames().length}`,
                                        startedAt: new Date(),
                                        turnNumber: 0,
                                        turns: [[]],
                                        players: this.state.playersForGame.map(
                                            (id) => {
                                                return {
                                                    playerInfo: playersDB
                                                        .getPlayers()
                                                        .find(
                                                            (x) => x.id === id
                                                        ),
                                                    score: getBlankScore(),
                                                };
                                            }
                                        ),
                                    });
                                    this.setState({
                                        playersForGame: undefined,
                                    });
                                }
                            }}
                        >
                            Save changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Button
                    onClick={() => {
                        this.setState({
                            playersForGame: [],
                        });
                    }}
                >
                    New Game
                </Button>
            </div>
        );
    }
}
