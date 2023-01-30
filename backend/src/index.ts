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

let map: Map<string, { playerName: string, amZug: boolean, playerField: string[][], guessPlayerField: string[][] }[]> = new Map<string, { playerName: string, amZug: boolean, playerField: string[][], guessPlayerField: string[][] }[]>;

let map2: Map<string, Map<string, { amZug: boolean, playerField: string[][], guessPlayerField: string[][] }>[]> = new Map<string, Map<string, { amZug: boolean, playerField: string[][], guessPlayerField: string[][] }>[]>;

app.post("/addPlayer", (req, res) => {
    let serverName = req.body.serverName;
    let data;

    //
    // if (!map2.has(serverName)) {
    //     // @ts-ignore
    //     map2.set(serverName, [map2.get(serverName).set("player1", {
    //         amZug: true,
    //         playerField:
    //             [
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //             ],
    //         guessPlayerField:
    //             [
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //             ]
    //     })]);
    //
    //     data = "player1";
    // } else {
    //     // @ts-ignore
    //     map2.get(serverName).push(map2.get(serverName).set("player2", {
    //         amZug: true,
    //         playerField:
    //             [
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //             ],
    //         guessPlayerField:
    //             [
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //                 ["", "", "", "", "", "", "", "", "", ""],
    //             ]
    //     }))
    //
    //     data = "player2";
    // }

    if (!map.has(serverName)) {
        map.set(serverName, [{
            playerName: "player1", amZug: true,
            playerField:
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
                ],
            guessPlayerField:
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
                ]
        }]);

        data = "player1";
    } else {
        // @ts-ignore
        if (map.get(serverName).length == 2) return;
        // @ts-ignore
        map.get(serverName).push({
            playerName: "player2", amZug: false,
            playerField:
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
                ],
            guessPlayerField:
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
                ]
        });
        data = "player2";
    }

    res.json({name: data})
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.end();
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

    if(playerName === "player1") {
        // @ts-ignore
        map.get(serverName)[0].playerField = playField;
    } else {
        // @ts-ignore
        map.get(serverName)[1].playerField = playField;
    }

    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.end();
})

app.get("/getField", (req, res) => {
    let data;
    let playerName = req.query.playerName;
    let serverName = req.query.serverName;

    if(playerName === "player1") {
        // @ts-ignore
        data = map.get(serverName)[0].playerField;
    } else {
        // @ts-ignore
        data = map.get(serverName)[1].playerField;
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