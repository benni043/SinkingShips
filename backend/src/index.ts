import express from "express";
import cors from "cors";
import {createEmptyField, FeldState, Server, State} from "../../Server";

const port = 3000
const app = express();

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`sinking ships engine successfully started on port: ${port}`)
})

let map: Map<string, Server> = new Map();

//let map2: Map<string, Map<string, { amZug: boolean, playerField: string[][], guessPlayerField: string[][] }>[]> = new Map<string, Map<string, { amZug: boolean, playerField: string[][], guessPlayerField: string[][] }>[]>;

app.post("/addPlayer", (req, res) => {
    let serverName = req.body.serverName;
    let playerName = req.body.playerName;
    let data;

    if (!map.has(serverName)) {
        map.set(serverName, {
            spieler1: {
                name: playerName,
                feld1: createEmptyField(),
                feld2: createEmptyField()
            },
            spieler2: undefined,
            isSpieler1AmZug: true,
            state: State.joining
        })
    } else {
        if(map.get(serverName)!.state === State.gameRunning) {
            res.end();
            return;
        }

        map.get(serverName)!.spieler2 = {
            name: playerName,
            feld1: createEmptyField(),
            feld2: createEmptyField()
        }

        map.get(serverName)!.state = State.gameRunning;
    }

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.end();
})

app.post("/postCords", (req, res) => {
    let x: number = req.body.x;
    let y: number = req.body.y;

    let playerName: string = req.body.playerName;
    let serverName: string = req.body.serverName;

    if(map.has(serverName)) {
        if(playerName === map.get(serverName)!.spieler1.name) {
            if(map.get(serverName)!.spieler2!.feld1[x][y] === FeldState.ship) {
                map.get(serverName)!.spieler1.feld2[x][y] = FeldState.ship;
            } else {
                map.get(serverName)!.spieler1.feld2[x][y] = FeldState.water;
            }
        } else {
            if(map.get(serverName)!.spieler1!.feld1[x][y] === FeldState.ship) {
                map.get(serverName)!.spieler2!.feld2[x][y] = FeldState.ship;
            } else {
                map.get(serverName)!.spieler2!.feld2[x][y] = FeldState.water;
            }
        }
    }

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.end();
})

app.get("/getGuessField", (req, res) => {
    let data;
    let elem = req.query.playerName;

    let playerName = elem!.toString().split(",")[0]
    let serverName = elem!.toString().split(",")[1]

    if(map.has(serverName)) {
        if(playerName === map.get(serverName)!.spieler1.name) {
            data = {field: map.get(serverName)!.spieler1.feld2}
        } else {
            data = {field: map.get(serverName)!.spieler2!.feld2}
        }
    }

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.json(data);
})

app.post("/postField", (req, res) => {
    let playField: FeldState[][] = req.body.field;

    let playerName: string = req.body.name;
    let serverName: string = req.body.server;

    if(map.has(serverName)) {
        if(playerName === map.get(serverName)!.spieler1.name) {
            map.get(serverName)!.spieler1.feld1 = playField;
        } else {
            map.get(serverName)!.spieler2!.feld1 = playField;
        }
    }

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.end();
})

app.get("/getField", (req, res) => {
    let data;
    let elem = req.query.playerName;

    let playerName = elem!.toString().split(",")[0]
    let serverName = elem!.toString().split(",")[1]

    if(map.has(serverName)) {
        if(playerName === map.get(serverName)!.spieler1.name) {
            data = {field: map.get(serverName)!.spieler1.feld1}
        } else {
            data = {field: map.get(serverName)!.spieler2!.feld1}
        }
    }

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.json(data);
})