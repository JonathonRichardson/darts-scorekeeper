import * as React from "react";
import { Link } from "react-router-dom";

interface IProps {}

interface IState {
  picture: null | string;
}

export class PlayersPage extends React.Component<IProps, IState> {
  private ref$video = React.createRef<HTMLVideoElement>();
  private ref$canvas = React.createRef<HTMLCanvasElement>();

  constructor(props: IProps) {
    super(props);

    this.state = {
      picture: null,
    }
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

        canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);
        let image_data_url = canvas.toDataURL('image/jpeg');
        
        // data url of the image
        console.log(image_data_url);

        this.setState({
          picture: image_data_url
        })

      }

      //console.log("photo", photo);
    } catch (e) {
      console.error("failed", e);
    }
  }

  async startCamera() {
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    if (this.ref$video.current) {
      this.ref$video.current.srcObject = stream;
    } 
  }

  async stopCamera() {
    if (this.ref$video.current) {
      let stream = this.ref$video.current.srcObject;
      if (stream != null && 'getTracks' in stream) {
          stream.getTracks().forEach(function(track) {
            if (track.readyState == 'live') {
                track.stop();
            }
        });
      }
      this.ref$video.current.srcObject = null;
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
        
        <video ref={this.ref$video} id="video" width="320" height="240" autoPlay></video>
        <canvas ref={this.ref$canvas} id="canvas" width="320" height="240"></canvas>

        {this.state.picture && (
          <img src={this.state.picture}/>
        )}

        <button onClick={this.startCamera.bind(this)}>Start Camera</button>
        <button onClick={this.takePhoto.bind(this)}>Take Picture</button>
        <button onClick={this.stopCamera.bind(this)}>Stop Camera</button>

        <button>Save</button>
      </>
    );
  }
}
