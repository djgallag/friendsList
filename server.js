const path = require('path');
const db = require('./db');
const { Friend } = db.models;
const faker = require('faker');
const express = require('express');

const app = express();
app.use(require('body-parser').json());

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/friends', async (req, res, next) => {
    try {
        console.log(Friend.findAll({ order: [['rating', 'desc']]}));
        res.send(await Friend.findAll({ order: [['rating', 'desc']]}));
    }
    catch(err) {
        next(err);
    }
});

app.put('/api/friends/:id', async (req, res, next) => {
    try {
        const friend = await Friend.findByPk(req.params.id);
        await friend.update(req.body);
        res.send(friend);
    }
    catch(err) {
        next(err);
    }
});

app.delete('/api/friends/:id', async (req, res, next) => {
    try {
        const friend = await Friend.findByPk(req.params.id);
        await friend.destroy();
        res.sendStatus(204);
    }
    catch(err) {
        next(err);
    }
});

app.post('/api/friends', async (req, res, next) => {
    try {
        res.send(await Friend.create({name: faker.name.firstName()}));
    }
    catch(err) {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({error: err.message});
});

const init = async () => {
    try {
        await db.syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on port ${port}`));
    }
    catch(err) {
        console.error(err);
    }
}
init();