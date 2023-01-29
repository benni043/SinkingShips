import express from "express";
import cors from "cors";

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

app.post("/postCords", (req, res) => {
    let x: number = req.body.x;
    let y: number = req.body.y;

    let name: string = req.body.name;

    if(name === "player11") {
        if(player2Field[x][y] === "X") guessPlayer1Field[x][y] = "X";
        else guessPlayer1Field[x][y] = "O";
    } else {
        if(player1Field[x][y] === "X") guessPlayer2Field[x][y] = "X";
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
    let name: string = req.body.name;

    if(name === "player1") player1Field = playField;
    else player2Field = playField;

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.end();
})

app.get("/getField", (req, res) => {
    let data;
    let playerName = req.query.playerName;

    if(playerName == "player1") data = {field: player1Field};
    else data = {field: player2Field};

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