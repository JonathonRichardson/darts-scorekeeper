import { IGame, IPlayerScore } from "../../../data/GamesDB";
import { calculateScores } from "./Scorer";

test("Cricket Scorer", () => {
    let game: IGame = {
        id: "1",
        startedAt: new Date(),
        players: [
            {
                playerInfo: { id: "jon", name: "Jonathon", profilePic: "" },
                score: {
                    points: 1,
                    marks: {},
                },
            },
        ],
        turnNumber: 1,
        turns: [
            [
                {
                    type: "Treble",
                    value: "16",
                },
                {
                    type: "Treble",
                    value: "16",
                },
            ],
        ],
    };

    let scores = calculateScores(game);

    expect(scores[0].points).toBe(48);
});
