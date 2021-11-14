import * as React from "react";
import { Link } from "react-router-dom";
import { LocalStoragePlayerDB, IPlayer } from "../../data/PlayerDB";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { v4 } from "uuid";

interface IProps {}

interface IState {
    modalContents?: IPlayer;
}

function makeId(length) {
    let result = "";
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        let letterPos =
            (crypto.getRandomValues(new Uint8Array(1))[0] / 255) *
                charactersLength -
            1;
        result += characters[letterPos];
    }
    return result;
}
export class PlayersPage extends React.Component<IProps, IState> {
    private ref$video = React.createRef<HTMLVideoElement>();
    private ref$canvas = React.createRef<HTMLCanvasElement>();

    constructor(props: IProps) {
        super(props);

        this.state = {};
    }

    async takePhoto() {
        try {
            // let stream = await navigator.mediaDevices.getUserMedia({
            //   video: true
            // });
            // let imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
            // let photo = await imageCapture.takePhoto({});

            if (this.ref$video.current && this.ref$canvas.current) {
                let video = this.ref$video.current;
                let canvas = this.ref$canvas.current;

                canvas
                    .getContext("2d")!
                    .drawImage(video, 0, 0, canvas.width, canvas.height);
                let image_data_url = canvas.toDataURL("image/jpeg");

                // data url of the image
                console.log(image_data_url);

                this.setState((curState) => {
                    return {
                        ...curState,
                        modalContents: {
                            ...curState.modalContents,
                            profilePic: image_data_url,
                        },
                    };
                });
            }

            //console.log("photo", photo);
        } catch (e) {
            console.error("failed", e);
        }
    }

    async startCamera() {
        let stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
        if (this.ref$video.current) {
            this.ref$video.current.srcObject = stream;
        }
    }

    async stopCamera() {
        if (this.ref$video.current) {
            let stream = this.ref$video.current.srcObject;
            if (stream != null && "getTracks" in stream) {
                stream.getTracks().forEach(function (track) {
                    if (track.readyState == "live") {
                        track.stop();
                    }
                });
            }
            this.ref$video.current.srcObject = null;
        }
    }

    render() {
        let playersDb = new LocalStoragePlayerDB();
        return (
            <>
                <h2>
                    <Link to="/">&lt; Home</Link>
                </h2>
                <h1>Players</h1>
                <hr />

                <div style={{ display: "flex" }}>
                    {playersDb.getPlayers().map((player) => {
                        return (
                            <div className="card" style={{ width: "18rem" }}>
                                <img
                                    src={player.profilePic}
                                    className="card-img-top"
                                    alt="..."
                                />
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {player.name}
                                    </h5>
                                    {/* <p className="card-text">
                                        Some quick example text to build on the
                                        card title and make up the bulk of the
                                        card's content.
                                    </p> */}

                                    <Button
                                        onClick={() => {
                                            this.setState({
                                                modalContents: player,
                                            });
                                        }}
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        variant="danger"
                                        onClick={() => {
                                            playersDb.deletePlayer(player);
                                            this.forceUpdate();
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {playersDb.getPlayers().length == 0 && (
                    <div className="alert alert-dark" role="alert">
                        There are no players yet
                    </div>
                )}

                <Modal show={!!this.state.modalContents}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Create User{" "}
                            {this.state.modalContents
                                ? ` (${this.state.modalContents.id}`
                                : null}{" "}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <label>Name</label>
                        <input
                            data-qa-label='name'
                            value={
                                this.state.modalContents
                                    ? this.state.modalContents.name
                                    : ""
                            }
                            onChange={(e) => {
                                let newVal = e.target.value;

                                this.setState((curState) => {
                                    return {
                                        ...curState,
                                        modalContents: {
                                            ...curState.modalContents,
                                            name: newVal,
                                        },
                                    };
                                });
                            }}
                        />

                        <video
                            ref={this.ref$video}
                            id="video"
                            width="320"
                            height="240"
                            autoPlay
                        ></video>
                        <canvas
                            ref={this.ref$canvas}
                            id="canvas"
                            width="320"
                            height="240"
                            style={{
                                display: "none",
                            }}
                        ></canvas>

                        {this.state.modalContents &&
                            this.state.modalContents.profilePic && (
                                <img
                                    src={this.state.modalContents.profilePic}
                                />
                            )}

                        <br />
                        <button onClick={this.startCamera.bind(this)}>
                            Start Camera
                        </button>
                        <button onClick={this.takePhoto.bind(this)}>
                            Take Picture
                        </button>
                        <button onClick={this.stopCamera.bind(this)}>
                            Stop Camera
                        </button>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                this.setState({
                                    modalContents: undefined,
                                });
                            }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (this.state.modalContents) {
                                    playersDb.savePlayer(
                                        this.state.modalContents
                                    );
                                    this.setState({
                                        modalContents: undefined,
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
                            modalContents: {
                                id: v4(),
                                name: "",
                                profilePic: "",
                            },
                        });
                    }}
                >
                    Add Player
                </Button>
            </>
        );
    }
}
