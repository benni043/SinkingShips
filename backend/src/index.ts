import express from "express";
import cors from "cors";
import {createEmptyField, FeldState, Server, State, Status} from "../../Server";
import path = require("path");

const port = 3000
const app = express();

app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`sinking ships engine successfully started on port: ${port}`)
})

let map: Map<string, Server> = new Map();

app.use(express.static(path.join(__dirname, '../../frontend/dist/frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/frontend/index.html'));
    res.end()
});

app.get("/isStarted", (req, res) => {
    let serverName: string = req.query.serverName!.toString();

    let player1Ready = map.get(serverName)!.isPlayer1Ready;
    let player2Ready = map.get(serverName)!.isPlayer2Ready;

    if (player1Ready && player2Ready) res.json({started: true})
    else res.json({started: false});
})
app.post("/check", (req, res) => {
    let serverName = req.body.serverName;
    let playerName = req.body.playerName;

    if (!map.has(serverName)) {
        res.json({status: Status.join})
        return;
    }
    if (map.get(serverName)!.state === State.joining) {
        if (playerName === map.get(serverName)!.spieler1.name) res.json({status: Status.full})
        else res.json({status: Status.join})
        return;
    }
    if (playerName === map.get(serverName)!.spieler1.name) {
        if (map.get(serverName)!.spieler1.isOnline) {
            res.json({status: Status.full})
        } else {
            map.get(serverName)!.spieler1.isOnline = true;
            res.json({status: Status.rejoin})
        }
    } else if (playerName === map.get(serverName)!.spieler2!.name) {
        if (map.get(serverName)!.spieler2!.isOnline) {
            res.json({status: Status.full})
        } else {
            map.get(serverName)!.spieler2!.isOnline = true;
            res.json({status: Status.rejoin})
        }
    } else {
        res.json({status: Status.full})
    }
})

app.get("/getPlayer", (req, res) => {
    let elem = req.query.playerName;

    let playerName = elem!.toString().split(",")[0]
    let serverName = elem!.toString().split(",")[1]

    if (playerName === map.get(serverName)!.spieler1.name) res.json({player: map.get(serverName)!.spieler1})
    else res.json({player: map.get(serverName)!.spieler2})
})
app.post("/playerLeft", (req, res) => {
    let serverName = req.body.serverName;
    let playerName = req.body.playerName;

    if (playerName === map.get(serverName)!.spieler1.name) map.get(serverName)!.spieler1.isOnline = false;
    else map.get(serverName)!.spieler2!.isOnline = false;

    // if (!map.get(serverName)!.spieler1.isOnline && !map.get(serverName)!.spieler2!.isOnline) {
    //     console.log(1)
    //     map.delete(serverName);
    // }

    res.end()
})

app.post("/addGame", (req, res) => {
    let serverName = req.body.serverName;
    let playerName = req.body.playerName;

    if (!map.has(serverName)) {
        map.set(serverName, {
            spieler1: {
                name: playerName,
                isOnline: true,
                fieldSent: false,
                feld1: createEmptyField(),
                feld2: createEmptyField()
            },
            spieler2: {
                name: undefined,
                isOnline: false,
                fieldSent: false,
                feld1: createEmptyField(),
                feld2: createEmptyField()
            },
            isSpieler1AmZug: true,
            state: State.joining,
            isPlayer1Ready: false,
            isPlayer2Ready: false,
            gameEnd: false
        })
    } else {
        map.get(serverName)!.spieler2!.name = playerName;
        map.get(serverName)!.spieler2!.isOnline = true;
        map.get(serverName)!.state = State.gameRunning;
    }
    res.end()
})

app.post("/postGuessFieldCords", (req, res) => {
    let x: number = req.body.x;
    let y: number = req.body.y;

    let playerName: string = req.body.playerName;
    let serverName: string = req.body.serverName;

    if (playerName === map.get(serverName)!.spieler1.name) {
        if (!map.get(serverName)!.isSpieler1AmZug) {
            res.json({isPlayerAmZug: false})
            return
        }
        if (map.get(serverName)!.spieler2!.feld1[x][y] === FeldState.ship) {
            map.get(serverName)!.spieler1.feld2[x][y] = FeldState.ship;
            map.get(serverName)!.spieler2!.feld1[x][y] = FeldState.koShip;
        } else {
            map.get(serverName)!.spieler1.feld2[x][y] = FeldState.water;
            map.get(serverName)!.spieler2!.feld1[x][y] = FeldState.water;
        }
        if (hasPlayerWon(playerName, serverName)) {
            map.get(serverName)!.gameEnd = true;
        }
        map.get(serverName)!.isSpieler1AmZug = false;
    } else {
        if (map.get(serverName)!.isSpieler1AmZug) {
            res.json({isPlayerAmZug: false})
            return
        }
        if (map.get(serverName)!.spieler1!.feld1[x][y] === FeldState.ship) {
            map.get(serverName)!.spieler2!.feld2[x][y] = FeldState.ship;
            map.get(serverName)!.spieler1!.feld1[x][y] = FeldState.koShip;
        } else {
            map.get(serverName)!.spieler2!.feld2[x][y] = FeldState.water;
            map.get(serverName)!.spieler1!.feld1[x][y] = FeldState.water;
        }
        if (hasPlayerWon(playerName, serverName)) {
            map.get(serverName)!.gameEnd = true;
        }
        map.get(serverName)!.isSpieler1AmZug = true;
    }

    res.json({isPlayerAmZug: true});
})

app.get("/isGameFinished", (req, res) => {
    let serverName = req.query.serverName!.toString();

    if (map.get(serverName)!.gameEnd) res.json({finished: true})
    else res.json({finished: false})
})

function hasPlayerWon(playerName: string, serverName: string): boolean {
    for (let feld1Element of map.get(serverName)!.spieler1.feld1) {
        for (let feldState of feld1Element) {
            if (feldState === FeldState.ship) return false;
        }
    }
    for (let feld1Element of map.get(serverName)!.spieler1.feld1) {
        for (let feldState of feld1Element) {
            if (feldState === FeldState.ship) return false;
        }
    }
    return true;
}

app.get("/getGuessField", (req, res) => {
    let data;
    let elem = req.query.playerName;

    let playerName = elem!.toString().split(",")[0]
    let serverName = elem!.toString().split(",")[1]

    if (playerName === map.get(serverName)!.spieler1!.name) {
        data = {field: map.get(serverName)!.spieler1.feld2}
    } else {
        data = {field: map.get(serverName)!.spieler2!.feld2}
    }

    res.json(data);
})

app.post("/postField", (req, res) => {
    let playField: FeldState[][] = req.body.field;

    let playerName: string = req.body.name;
    let serverName: string = req.body.server;

    if (map.has(serverName)) {
        if (playerName === map.get(serverName)!.spieler1.name) {
            map.get(serverName)!.spieler1.feld1 = playField;
            map.get(serverName)!.spieler1.fieldSent = true;
            map.get(serverName)!.isPlayer1Ready = true;
        } else {
            map.get(serverName)!.spieler2!.feld1 = playField;
            map.get(serverName)!.spieler2!.fieldSent = true;
            map.get(serverName)!.isPlayer2Ready = true;
        }
    }

    res.end();
})

app.get("/getField", (req, res) => {
    let data;
    let elem = req.query.playerName;

    let playerName = elem!.toString().split(",")[0]
    let serverName = elem!.toString().split(",")[1]

    if (playerName === map.get(serverName)!.spieler1.name) {
        data = {field: map.get(serverName)!.spieler1.feld1}
    } else {
        data = {field: map.get(serverName)!.spieler2!.feld1}
    }

    res.json(data);
})