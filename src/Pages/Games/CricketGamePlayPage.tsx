import * as React from "react";
import "./X01GamesPage.scss";
import { Link } from "react-router-dom";
import { IDartValue, ISegmentType } from "../../Components/Segment";
import { Dartboard } from "../../Components/Dartboard";

interface IProps {
  gameId: number;
}

type ISector = "Bull" | IDartValue;

interface IPlayerScore {
  points: number;
  marks: {
    [k in ISector]?: number;
  };
}

interface IPlayer {
  name: string;
  score: IPlayerScore;
}

interface IThrowResult {
  type: ISegmentType;
  value: IDartValue | "Bull";
}

interface IState {
  players: IPlayer[];
  turnNumber: number;
  turns: IThrowResult[][];
}

const getBlankScore = () => {
  let score: IPlayerScore = {
    points: 0,
    marks: {}
  };

  return score;
};

export class CricketGamePlayPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      players: [
        {
          name: "Indra",
          score: getBlankScore()
        },
        {
          name: "Jonathon",
          score: getBlankScore()
        }
      ],
      turnNumber: 0,
      turns: [[]]
    };
  }

  getDerivedProps() {
    let playerIndex = this.state.turnNumber % this.state.players.length;

    return {
      round: Math.floor(
        (this.state.turnNumber + 2) / this.state.players.length
      ),
      currentPlayer: this.state.players[playerIndex],
      currentPlayerIndex: playerIndex
    };
  }

  handleNextTurn() {
    this.setState((curState) => {
      return {
        turns: [...curState.turns, []],
        turnNumber: curState.turnNumber + 1
      };
    });
  }

  handleSegmentClick(curThrow: IThrowResult) {
    if (curThrow.type === "Label") {
      return; // do nothing
    }

    this.setState((curState) => {
      let turns = [...curState.turns];

      let thisRound = turns[this.state.turnNumber] || [];

      if (thisRound.length === 3) {
        thisRound[2] = curThrow;
      } else {
        thisRound.push(curThrow);
      }

      turns[this.state.turnNumber] = thisRound;

      return {
        turns: turns
      };
    });
  }

  calculateScores(): IPlayerScore[] {
    let playerScores: IPlayerScore[] = this.state.players.map(
      (player, playerIndex) => {
        return {
          points: 0,
          marks: {}
        };
      }
    );

    this.state.turns.forEach((turn, turnIndex) => {
      let playerIndex = turnIndex % this.state.players.length;
      let player = playerScores[playerIndex];

      for (var throwResult of turn) {
        let count =
          throwResult.type === "Double"
            ? 2
            : throwResult.type === "Treble"
            ? 3
            : 1;

        let resultForValue = player.marks[throwResult.value] || 0;
        Array(count)
          .fill("")
          .forEach(() => {
            if (resultForValue === 3) {
              player.points = player.points + parseInt(throwResult.value);
            } else {
              resultForValue = resultForValue + 1;
            }
          });

        player.marks[throwResult.value] = resultForValue;
      }
    });

    return playerScores;
  }

  render() {
    let { props } = this;
    let derivedState = this.getDerivedProps();

    let currentTurn = this.state.turns[this.state.turnNumber];

    let currentScores = this.calculateScores();

    return (
      <div>
        <h2>
          <Link to="/">&lt; Home</Link> Game {props.gameId}
        </h2>

        <h3>Current Round: {derivedState.round}</h3>
        <h3>Current Player: {derivedState.currentPlayer.name}</h3>

        <div style={{ display: "flex" }}>
          <div>
            <Dartboard
              height="400"
              width="400"
              onSegmentClick={this.handleSegmentClick.bind(this)}
            />
            <button
              onClick={() => {
                this.setState((curState) => {
                  let turns = [...curState.turns];

                  turns[this.state.turnNumber] = turns[
                    this.state.turnNumber
                  ].slice(0, -1);

                  return {
                    turns: turns
                  };
                });
              }}
            >
              Unthrow
            </button>
            <button onClick={this.handleNextTurn.bind(this)}>Next Round</button>
          </div>
          <div>
            <div style={{ display: "flex" }}>
              {currentTurn.map((round, i) => {
                return (
                  <div style={{ outline: "blue", margin: 10 }}>
                    <h4>{i + 1}</h4>
                    <h5>
                      {round.value} / {round.type}
                    </h5>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex" }}>
              {this.state.players.map((player, playerIndex) => {
                let score = currentScores[playerIndex];

                return (
                  <div style={{ outline: "blue", margin: 10 }}>
                    <h4>{player.name}</h4>
                    <h5>Score: {score.points}</h5>

                    <ol>
                      {["15", "16", "17", "18", "19", "20"].map((segmentId) => {
                        let count = (score.marks as any)[segmentId] || 0;

                        let display =
                          count === 1
                            ? "∕"
                            : count === 2
                            ? "✕"
                            : count === 0
                            ? " "
                            : count === 3
                            ? "⦻"
                            : "?";

                        return (
                          <li>
                            {segmentId}: {display}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
