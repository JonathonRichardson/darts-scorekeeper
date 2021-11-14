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
            if (parseInt(throwResult.value) >= 15) {
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
                            player.points =
                                player.points + parseInt(throwResult.value);
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
