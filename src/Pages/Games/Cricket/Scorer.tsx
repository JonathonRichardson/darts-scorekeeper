import { IGame, IPlayerScore } from "../../../data/GamesDB";

export interface ICricketOptionsConfig {}

const DefaultCricketOptionsConfig: ICricketOptionsConfig = {};

export const calculateScores = (
    game: IGame,
    configOverrides?: ICricketOptionsConfig
): IPlayerScore[] => {
    let config = { ...DefaultCricketOptionsConfig, ...configOverrides };

    let playerScores: IPlayerScore[] = game.players.map(
        (player, playerIndex) => {
            return {
                points: 0,
                marks: {},
            };
        }
    );

    game.turns.forEach((turn, turnIndex) => {
        let playerIndex = turnIndex % game.players.length;
        let player = playerScores[playerIndex];

        for (var throwResult of turn) {
            let otherPlayersMarks = playerScores
                .filter((p, i) => i !== playerIndex)
                .map((player) => player?.marks[throwResult.value] ?? 0);

            let playersThatAreNotClosedOut = otherPlayersMarks.filter(
                (m) => m < 3
            );

            let notAllOtherPlayersAreClosedOut =
                playersThatAreNotClosedOut.length > 0 ||
                game.players.length === 1;

            if (throwResult.value == "Bull") {
                let count = throwResult.type == "Double" ? 2 : 1;
                let currentCumulativeMarks =
                    player.marks[throwResult.value] || 0;

                Array(count)
                    .fill("")
                    .forEach(() => {
                        // Check if all other players have this closed out

                        if (currentCumulativeMarks === 3) {
                            if (notAllOtherPlayersAreClosedOut) {
                                player.points = player.points + 25;
                            }
                        } else {
                            currentCumulativeMarks = currentCumulativeMarks + 1;
                        }
                    });

                player.marks[throwResult.value] = currentCumulativeMarks;
            } else if (parseInt(throwResult.value) >= 15) {
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
                            if (notAllOtherPlayersAreClosedOut) {
                                player.points =
                                    player.points + parseInt(throwResult.value);
                            }
                        } else {
                            resultForValue = resultForValue + 1;
                        }
                    });

                player.marks[throwResult.value] = resultForValue;
            }
        }
    });

    return playerScores;
};
