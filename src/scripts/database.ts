import { Answer } from "../models/answer.model";

export const setupDatabase = () => {
    console.log("Setup default database data");
    Answer.insertMany([
        { description: "Повністю не згоден", value: 1 },
        { description: "Здебільшого, не згоден", value: 2 },
        { description: "Де в чому не згоден", value: 3 },
        { description: "Де в чому згоден", value: 4 },
        { description: "Швидше, згоден", value: 5 },
        { description: "Повністю згоден", value: 6 }
    ]);

    Answer.find().then(data => console.log(data));
};