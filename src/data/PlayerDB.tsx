export interface IPlayer {
    id: string;
    /**
     * Player's Name
     */
    name: string;
    /**
     * Data for the profile pic.
     */
    profilePic: string;
}

export interface IPlayerDB {
    getPlayers(): IPlayer[];
    savePlayer(newPlayer: IPlayer): IPlayer;
    deletePlayer(player: IPlayer): IPlayer;
}

const LOCAL_STORAGE_KEY = "DARTS.PLAYERS";

export class LocalStoragePlayerDB implements IPlayerDB {
    private getDataFromLocalStorage(): IPlayer[] {
        let rawText = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (rawText) {
            return JSON.parse(rawText) as IPlayer[];
        } else {
            return [];
        }
    }

    private saveDataToLocalStorage(players: IPlayer[]) {
        let text = JSON.stringify(players);

        localStorage.setItem(LOCAL_STORAGE_KEY, text);
    }

    getPlayers(): IPlayer[] {
        return this.getDataFromLocalStorage();
    }

    deletePlayer(player: IPlayer): IPlayer {
        let players = this.getDataFromLocalStorage();

        let filteredPlayers = players.filter((p) => p.id !== player.id);

        this.saveDataToLocalStorage(filteredPlayers);

        return player;
    }

    savePlayer(newPlayer: IPlayer): IPlayer {
        let players = this.getDataFromLocalStorage();

        let index = players.findIndex((p) => p.id == newPlayer.id);

        if (index == -1) {
            players.push(newPlayer);
        } else {
            players[index] = newPlayer;
        }

        this.saveDataToLocalStorage(players);

        return newPlayer;
    }
}
