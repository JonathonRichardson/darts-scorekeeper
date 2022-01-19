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
            <div className="pages--cricket">
                {/* <ul className="tg-list">
                    <li className="tg-list-item">
                        <h4>Double In</h4>
                        <input
                            id="cb1"
                            className="tgl tgl-light"
                            type="checkbox"
                        />
                        <label className="tgl-btn" htmlFor="cb1" />
                    </li>
                </ul> */}

                <div className="card-container">
                    {games.map((game) => {
                        return (
                            <Card
                                className="game-card"
                                data-qa-game-id={game.id}
                            >
                                <Card.Body>
                                    <div className="title-box">
                                        Game #{game.id} -{" "}
                                        {moment(game.startedAt).fromNow()}
                                    </div>
                                    {/* <Card.Title>Game #{game.id}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    {moment(game.startedAt).fromNow()}
                                </Card.Subtitle> */}
                                    <Card.Text>
                                        <div className="player-container">
                                            {game.players.map((p, index) => {
                                                let dataURI =
                                                    p.playerInfo.profilePic;
                                                var mime = dataURI
                                                    .split(",")[0]
                                                    .split(":")[1]
                                                    .split(";")[0];
                                                var binary = atob(
                                                    dataURI.split(",")[1]
                                                );
                                                var array = [];
                                                for (
                                                    var i = 0;
                                                    i < binary.length;
                                                    i++
                                                ) {
                                                    array.push(
                                                        binary.charCodeAt(i)
                                                    );
                                                }
                                                let blob = new Blob(
                                                    [new Uint8Array(array)],
                                                    { type: mime }
                                                );
                                                let url =
                                                    URL.createObjectURL(blob);
                                                return (
                                                    <>
                                                        {index !== 0 && (
                                                            <span
                                                                style={{
                                                                    marginRight: 15,
                                                                }}
                                                            >
                                                                vs.
                                                            </span>
                                                        )}
                                                        <div className="player-card">
                                                            <div className="player-card-title">
                                                                {
                                                                    p.playerInfo
                                                                        .name
                                                                }
                                                            </div>
                                                            <svg
                                                                width="150px"
                                                                height="150px"
                                                                viewBox="0 0 150 150"
                                                                className="image"
                                                                // style={{
                                                                //     display: "none",
                                                                // }}
                                                            >
                                                                <defs>
                                                                    <filter
                                                                        id="f1"
                                                                        x="0%"
                                                                        y="0%"
                                                                        width="100%"
                                                                        height="100%"
                                                                        color-interpolation-filters="sRGB"
                                                                    >
                                                                        <feColorMatrix
                                                                            id="tinter"
                                                                            type="matrix"
                                                                            // values=".6 .6 .6 0 0
                                                                            //         .2 .2 .2 0 0
                                                                            //         .0 .0 .0 0 0
                                                                            //         0  0  0  1 0"
                                                                            //values="0.24 0.24 0.24 0 0 0.33 0.33 0.33 0 0 0.74 0.74 0.74 0 0 0 0 0 1 0"
                                                                            //values="0.14 0.14 0.14 0 0 0.13 0.13 0.13 0 0 0.89 0.89 0.89 0 0 0 0 0 1 0"
                                                                            values="0.14 0.14 0.14 0 0 0.13 0.13 0.13 0 0 0.4 0.4 0.4 0 0 0 0 0 1 0"
                                                                        />
                                                                    </filter>
                                                                </defs>
                                                                <image
                                                                    x="0"
                                                                    y="0"
                                                                    //width="150"
                                                                    height="150"
                                                                    preserveAspectRatio="true"
                                                                    filter="url(#f1)"
                                                                    //xlinkHref={url}
                                                                    xlinkHref={
                                                                        p
                                                                            .playerInfo
                                                                            .profilePic
                                                                    }
                                                                ></image>
                                                            </svg>
                                                        </div>
                                                    </>
                                                );
                                            })}
                                        </div>
                                    </Card.Text>

                                    <Link
                                        className="btn btn-success"
                                        to={`/games/cricket/${game.id}`}
                                        style={{
                                            position: "absolute",
                                            right: 18,
                                            bottom: -17,
                                            border: "2px solid #195a85",
                                        }}
                                    >
                                        Play Game
                                    </Link>
                                    {/* <Card.Link href="#">Card Link</Card.Link>
                                <Card.Link href="#">Another Link</Card.Link> */}
                                </Card.Body>
                            </Card>
                        );
                    })}
                </div>

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

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        marginBottom: 40,
                    }}
                >
                    <div
                        style={{
                            marginRight: 50,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#0c1920",
                            padding: "20px 10px",
                            border: "1px solid #195a85",
                            color: "#4bb0c5",
                            width: 200,
                            height: 200,
                        }}
                    >
                        <Link
                            to="/"
                            style={{
                                color: "#4bb0c5",
                                textDecoration: "none",
                                fontSize: 40,
                                fontWeight: "bold",
                            }}
                        >
                            &lt;
                            <br />
                            Home
                        </Link>
                    </div>

                    <Button
                        onClick={() => {
                            this.setState({
                                playersForGame: [],
                            });
                        }}
                        style={{
                            marginRight: 50,
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#0c1920",
                            padding: "20px 10px",
                            border: "1px solid #195a85",
                            color: "#4bb0c5",
                            width: 200,
                            height: 200,
                            fontSize: 40,
                            fontWeight: "bold",
                        }}
                    >
                        +
                        <br />
                        <span
                            style={{
                                fontSize: 30,
                            }}
                        >
                            Create New Game
                        </span>
                    </Button>
                </div>
            </div>
        );
    }
}
