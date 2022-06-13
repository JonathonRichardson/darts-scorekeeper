import * as React from "react";
import { Link } from "react-router-dom";
import "./MainPage.scss";
import { Dartboard } from "../Components/Dartboard";

interface IProps {}

export const MainPage: React.FunctionComponent<IProps> = (props) => {
    return (
        <div className="pages--main">
            <Dartboard height="200" width="200" notClickable />

            <Link className="link" to="/games/cricket">
                Cricket
            </Link>
            <br />
            <Link className="link" to="/games/x01">
                X01 Games
            </Link>
            <br />

            <Link className="link" to="/settings/players">
                Players
            </Link>
        </div>
    );
};
