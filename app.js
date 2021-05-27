const express = require("express");

const fs = require("fs");

const app = express();
const jsonParser = express.json();

app.use(express.static(__dirname+"/public"));

const filePath = "users.json";
app.get("/api/users", function (request, response){

    const content = fs.readFileSync(filePath,"utf8");
    const users = JSON.parse(content);
    response.send(users);
});

app.get("/api/users/:id", function(request, response){

    const id = request.params.id;
    const content = fs.readFileSync(filePath, "utf8");
    const users = JSON.parse(content);
    let user = null;

    for (var i=0; i<users.length; i++)
    {
        if (users[i].id == id)
        {
            user = users[i];
            break;
        }
    }

    if(user)
    {
        response.send(user);
    }
    else
    {
        response.sendStatus(404);
    }
});

app.post("/api/users", jsonParser, function (request, response){

    if (!request.body) return response.SendStatus(400);

    const userName = request.body.name;
    const userAge = request.body.age;
    let user = {name: userName, age: userAge, id: null};

    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);

    const id = Math.max.apply(Math, users.map(function (o){return o.id;}))

    user.id = id+1;

    users.push(user);

    data = JSON.stringify(users);

    fs.writeFileSync(filePath, data)

    response.send(user);
});

app.delete("/api/users/:id", function (request, response){

    const id = request.params.id;
    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
    let index = -1;

    for (var i=0; i < users.length; i++)
    {
        if(users[i].id == id)
        {
            index = i;
            break;
        }
    }
    if (index !== -1)
    {
        let user = users[index];
        users.splice(index, 1);
        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);
        response.send(user);
    }
    else
    {
        response.sendStatus(404);
    }
});

app.put("/api/users", jsonParser, function (request, response){

    if (!request.body) return response.sendStatus(400);

    const userId = request.body.id;
    const userName = request.body.name;
    const userAge = request.body.age;

    let data = fs.readFileSync(filePath, "utf8");
    let users = JSON.parse(data);
    let index = -1;

    for (var i=0; i<users.length; i++)
    {
        if (users[i].id == userId)
        {
            index = i;
            break;
        }
    }

    if (index !== -1)
    {
        users[index].age = userAge;
        users[index].name = userName;
        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);
        response.send(users[index]);
    }
    else {
        response.sendStatus(404);
    }
});

app.listen(3000, function (){
    console.log("Сервер ожидает подключения...");
});