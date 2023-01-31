import express from "express";
import cors from "cors";
import {createEmptyField, Server, State} from "./Server";

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
    let data;

    if (!map.has(serverName)) {
        map.set(serverName, {
            spieler1: {
                name: "player1",
                feld1: createEmptyField(),
                feld2: createEmptyField()
            },
            spieler2: undefined,
            isSpieler1AmZug: true,
            state: State.joining
        })

        data = "player1";
    } else {
        map.get(serverName)!.spieler2 = {
            name: "player2",
            feld1: createEmptyField(),
            feld2: createEmptyField()
        }

        map.get(serverName)!.state = State.gameRunning;

        data = "player2";
    }

    console.log(map)
    console.log(data)

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.json({name: data})
})

app.post("/postCords", (req, res) => {
    let x: number = req.body.x;
    let y: number = req.body.y;

    let name: string = req.body.name;

    if (name === "player11") {
        if (player2Field[x][y] === "X") guessPlayer1Field[x][y] = "X";
        else guessPlayer1Field[x][y] = "O";
    } else {
        if (player1Field[x][y] === "X") guessPlayer2Field[x][y] = "X";
        else guessPlayer2Field[x][y] = "O";
    }

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.end();
})

app.get("/getGuessField", (req, res) => {
    let data;
    let playerName = req.query.playerName;

    if(playerName == "player11") data = {field: guessPlayer1Field};
    else data = {field: guessPlayer2Field};

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.json(data);
})

app.post("/postField", (req, res) => {
    let playField: string[][] = req.body.field;
    let playerName: string = req.body.playerName;
    let serverName: string = req.body.serverName;

    if (!map.has(serverName)) {
        res.end();
        return;
    }

    // if (playerName === "player1") {
    //     map.get(serverName)![0].playerField = playField;
    // } else {
    //     map.get(serverName)![1].playerField = playField;
    // }

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.end();
})

app.get("/getField", (req, res) => {
    let data;
    let elem = req.query.playerName;

    let playerName = elem!.toString().split(",")[0]
    let serverName = elem!.toString().split(",")[1]

    console.log(playerName)
    console.log(serverName)

    if(map.has(serverName)) {
        if(playerName === "player1") {
            data = {field: map.get(serverName)!.spieler1.feld1}
        } else {
            data = {field: map.get(serverName)!.spieler2!.feld1}
        }
    }

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.json(data);
})

let player1Field: string[][] =
    [
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
    ];

let player2Field: string[][] =
    [
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
    ];

let guessPlayer1Field: string[][] =
    [
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
    ];

let guessPlayer2Field: string[][] =
    [
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
    ];