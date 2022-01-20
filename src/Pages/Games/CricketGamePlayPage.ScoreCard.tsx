import * as React from "react";
import { IPlayerScore } from "../../data/GamesDB";
import "./CricketGamePlayPage.scss";

interface IProps {
    playerName: string;
    isCurrentPlayer: boolean;
    score: IPlayerScore;
}

interface IState {
    currentlyEnteringScore: boolean;
}

export class ScoreCard extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            currentlyEnteringScore: false,
        };
    }

    render() {
        let { props } = this;
        let { score, isCurrentPlayer, playerName } = props;

        return (
            <div
                className={["scorecard", isCurrentPlayer ? "active" : ""].join(
                    " "
                )}
            >
                <h4>{playerName}</h4>

                <ol>
                    {["15", "16", "17", "18", "19", "20"].map((segmentId) => {
                        let count = (score.marks as any)[segmentId] || 0;

                        let display =
                            count === 1 ? (
                                "∕"
                            ) : count === 2 ? (
                                "✕"
                            ) : count === 0 ? (
                                <>&nbsp;</>
                            ) : count === 3 ? (
                                "⦻"
                            ) : (
                                "?"
                            );

                        return <li>{display}</li>;
                    })}

                    <li>
                        <span data-qa-score-for={playerName}>
                            {score.points}
                        </span>
                    </li>
                </ol>
            </div>
        );
    }
}
