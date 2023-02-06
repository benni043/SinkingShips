export type Server = {
    spieler1: Spieler
    spieler2: Spieler | undefined
    isSpieler1AmZug: boolean
    state: State
    isPlayer1Ready: boolean
    isPlayer2Ready: boolean
    gameEnd: boolean
}

export type Spieler = {
    name: string | undefined;
    isOnline: boolean;
    fieldSent: boolean,
    feld1: Feld;
    feld2: Feld;
}

export type Feld = FeldState[][];

export enum FeldState {
    ship = "X",
    koShip = "|",
    water = "O",
    empty = " "
}

export enum State {
    joining,
    gameRunning
}

export enum Status {
    join,
    rejoin,
    full
}

export function createEmptyField(): Feld {
    let field: FeldState[][] = [];

    for (let i = 0; i < 10; i++) {
        field[i] = [];
        for (let j = 0; j < 10; j++) {
            field[i][j] = FeldState.empty;
        }
    }

    return field;
}