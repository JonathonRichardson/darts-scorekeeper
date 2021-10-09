import * as React from "react";
import { Link } from "react-router-dom";

interface IProps {}

interface IState {}

export class PlayersPage extends React.Component<IProps, IState> {
  async takePhoto() {
    try {
      let stream = await navigator.mediaDevices.getUserMedia({
        video: true
      });
      let imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
      let photo = await imageCapture.takePhoto(imageCapture);
      console.log("photo", photo);
    } catch (e) {
      console.error("failed", e);
    }
  }

  render() {
    return (
      <>
        <h2>
          <Link to="/">&lt; Home</Link>
        </h2>
        <h1>Players</h1>
        <div></div>
        <hr />
        <label>Name</label>
        <input />

        <button onClick={this.takePhoto.bind(this)}>Take Picture</button>

        <button>Save</button>
      </>
    );
  }
}
