import { IDartValue, ISegmentType } from "../Components/Segment";
import { IPlayer } from "./PlayerDB";

type ISector = "Bull" | IDartValue;

export interface IPlayerScore {
    points: number;
    marks: {
        [k in ISector]?: number;
    };
}

interface IPlayerResult {
    playerInfo: IPlayer;
    score: IPlayerScore;
}

export interface IThrowResult {
    type: ISegmentType;
    value: IDartValue | "Bull";
}

export const getBlankScore = () => {
    let score: IPlayerScore = {
        points: 0,
        marks: {},
    };

    return score;
};

export interface IGame {
    id: string;
    startedAt: Date;
    players: IPlayerResult[];
    turnNumber: number;
    turns: IThrowResult[][];
}

export interface IGameDB {
    getGames(): IGame[];
    saveGame(newGame: IGame): IGame;
    deleteGame(Game: IGame): IGame;
}

const LOCAL_STORAGE_KEY = "DARTS.GAMES";

export class LocalStorageGameDB implements IGameDB {
    private getDataFromLocalStorage(): IGame[] {
        let rawText = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (rawText) {
            return JSON.parse(rawText) as IGame[];
        } else {
            return [];
        }
    }

    private saveDataToLocalStorage(Games: IGame[]) {
        let text = JSON.stringify(Games);

        localStorage.setItem(LOCAL_STORAGE_KEY, text);
    }

    getGames(): IGame[] {
        return this.getDataFromLocalStorage();
    }

    deleteGame(Game: IGame): IGame {
        let Games = this.getDataFromLocalStorage();

        let filteredGames = Games.filter((p) => p.id !== Game.id);

        this.saveDataToLocalStorage(filteredGames);

        return Game;
    }

    saveGame(newGame: IGame): IGame {
        let Games = this.getDataFromLocalStorage();

        let index = Games.findIndex((p) => p.id == newGame.id);

        if (index == -1) {
            Games.push(newGame);
        } else {
            Games[index] = newGame;
        }

        this.saveDataToLocalStorage(Games);

        return newGame;
    }
}
