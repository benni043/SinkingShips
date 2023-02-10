import express from "express";
import cors from "cors";
import {createEmptyField, Feld, FeldState, Server, State, Status} from "../../Server";
import path = require("path");

const port = 3000
const app = express();

app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`sinking ships engine successfully started on port: ${port}`)
})

app.use(express.static(path.join(__dirname, '../../frontend/dist/frontend')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/frontend/index.html'));
    res.end()
});

let map: Map<string, Server> = new Map();

app.get("/opponent", (req, res) => {
    let serverName: string = req.query.serverName!.toString();
    let playerName: string = req.query.playerName!.toString();

    if(!map.has(serverName)) {
        res.end()
        return;
    }

    if(map.get(serverName)!.spieler1.name === playerName) {
        res.json({opponent: map.get(serverName)!.spieler2!.name})
    } else {
        res.json({opponent: map.get(serverName)!.spieler1.name})
    }
})
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
    let serverName: string = req.query.serverName!.toString();
    let playerName: string = req.query.playerName!.toString();

    if (playerName === map.get(serverName)!.spieler1.name) res.json({player: map.get(serverName)!.spieler1})
    else res.json({player: map.get(serverName)!.spieler2})
})

app.post("/playerLeft", (req, res) => {
    let serverName = req.body.serverName;
    let playerName = req.body.playerName;

    // if(!map.has(serverName)) {
    //     res.end()
    //     return;
    // }

    if (playerName === map.get(serverName)!.spieler1.name) map.get(serverName)!.spieler1.isOnline = false;
    else map.get(serverName)!.spieler2!.isOnline = false;

    if(!map.get(serverName)!.spieler1.isOnline && !map.get(serverName)!.spieler2!.isOnline) {
        map.delete(serverName);
    }

    res.end()
})

//create new game
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

//won check
app.get("/isGameFinished", (req, res) => {
    let serverName = req.query.serverName!.toString();

    if (map.get(serverName)!.gameEnd) res.json({finished: true, server: map.get(serverName)})
    else res.json({finished: false, server: map.get(serverName)})
})

function checkField(field: Feld): boolean {
    for (let i = 0; i < field.length; i++) {
        for (let j = 0; j < field[i].length; j++) {
            if(field[i][j].state === FeldState.ship) return false;
        }
    }
    return true;
}

//opponentPlayField
app.post("/postGuessFieldCords", (req, res) => {
    let x: number = req.body.x;
    let y: number = req.body.y;

    let oldX: number = req.body.oldX;
    let oldY: number = req.body.oldY;

    let playerName: string = req.body.playerName;
    let serverName: string = req.body.serverName;

    if (playerName === map.get(serverName)!.spieler1.name) {
        if (!map.get(serverName)!.isSpieler1AmZug) {
            res.json({isPlayerAmZug: false})
            return
        }
        if (map.get(serverName)!.spieler2!.feld1[x][y].state === FeldState.ship) {
            map.get(serverName)!.spieler1.feld2[x][y].state = FeldState.ship;
            map.get(serverName)!.spieler2!.feld1[x][y].state = FeldState.koShip;
            map.get(serverName)!.spieler2!.feld1[x][y].hit = true;
        } else {
            map.get(serverName)!.spieler1.feld2[x][y].state = FeldState.water;
            map.get(serverName)!.spieler2!.feld1[x][y].state = FeldState.water;
        }

        map.get(serverName)!.spieler2!.feld1[oldX][oldY].lastHit = false;
        map.get(serverName)!.spieler2!.feld1[x][y].lastHit = true;

        if (checkField(map.get(serverName)!.spieler2!.feld1)) {
            map.get(serverName)!.gameEnd = true;
        }
        map.get(serverName)!.isSpieler1AmZug = false;
    } else {
        if (map.get(serverName)!.isSpieler1AmZug) {
            res.json({isPlayerAmZug: false})
            return
        }
        if (map.get(serverName)!.spieler1!.feld1[x][y].state === FeldState.ship) {
            map.get(serverName)!.spieler2!.feld2[x][y].state = FeldState.ship;
            map.get(serverName)!.spieler1!.feld1[x][y].state = FeldState.koShip;
            map.get(serverName)!.spieler1!.feld1[x][y].hit = true;
        } else {
            map.get(serverName)!.spieler2!.feld2[x][y].state = FeldState.water;
            map.get(serverName)!.spieler1!.feld1[x][y].state = FeldState.water;
        }

        map.get(serverName)!.spieler1.feld1[oldX][oldY].lastHit = false;
        map.get(serverName)!.spieler1.feld1[x][y].lastHit = true;

        if (checkField(map.get(serverName)!.spieler1.feld1)) {
            map.get(serverName)!.gameEnd = true;
        }
        map.get(serverName)!.isSpieler1AmZug = true;
    }

    res.json({isPlayerAmZug: true});
})
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


//ownPlayField
app.post("/postField", (req, res) => {
    let playField: Feld = req.body.field;

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
    // let serverName: string = req.query.serverName!.toString();
    // let playerName: string = req.query.playerName!.toString();

    let data;
    let elem = req.query.playerName;

    let playerName = elem!.toString().split(",")[0]
    let serverName = elem!.toString().split(",")[1]

    if(!map.has(serverName)) {
        res.json({field: undefined})
        return
    }

    if (playerName === map.get(serverName)!.spieler1.name) {
        data = {field: map.get(serverName)!.spieler1.feld1}
    } else {
        data = {field: map.get(serverName)!.spieler2!.feld1}
    }

    res.json(data);
})