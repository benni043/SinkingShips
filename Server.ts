export type Server = {
    spieler1: Spieler
    spieler2: Spieler | undefined
    isSpieler1AmZug: boolean
    state: State
}

export type Spieler = {
    name: string;
    feld1: Feld;
    feld2: Feld;
}

export type Feld = FeldState[][];

export enum FeldState {
    ship = "X",
    water = "O",
    empty = " "
}

export enum State {
    joining,
    gameRunning
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