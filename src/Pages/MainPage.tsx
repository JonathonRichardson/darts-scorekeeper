import * as React from "react";
import { Link } from "react-router-dom";
import "./MainPage.scss";
import { Dartboard } from "../Components/Dartboard";

interface IProps {}

export const MainPage: React.FunctionComponent<IProps> = (props) => {
    return (
        <div className="pages--main">
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                <h1>Shot Tracker</h1>
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    marginBottom: 60,
                }}
            >
                <Dartboard height="400" width="400" notClickable />
            </div>

            <Link className="link" to="/games/cricket">
                Play Cricket
            </Link>
            <br />

            <Link className="link" to="/settings/players">
                Edit Players
            </Link>
        </div>
    );
};
