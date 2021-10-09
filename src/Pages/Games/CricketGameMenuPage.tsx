import * as React from "react";
import "./X01GamesPage.scss";
import { Link } from "react-router-dom";

interface IProps {}

interface IState {}

export class CricketGameMenuPage extends React.Component<IProps, IState> {
  render() {
    return (
      <div>
        <h2>
          <Link to="/">&lt; Home</Link>
        </h2>
        <ul className="tg-list">
          <li className="tg-list-item">
            <h4>Double In</h4>
            <input id="cb1" className="tgl tgl-light" type="checkbox" />
            <label className="tgl-btn" htmlFor="cb1" />
          </li>
        </ul>

        <Link to="/games/cricket/1">Play Game</Link>
      </div>
    );
  }
}
