const Sequelize = require('sequelize');
const { EnvironmentPlugin } = require('webpack');
const {STRING, INTEGER} = Sequelize;
const baseFriends = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_db');

const Friend = baseFriends.define('friend', {
    name: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    rating: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 5
    }
});

const syncAndSeed = async () => {
    await baseFriends.sync({force: true});
    const [andrew, anne, shane] = await Promise.all([
        Friend.create({name: 'andrew', rating: 11}),
        Friend.create({name: 'anne', rating: 14}),
        Friend.create({name: 'shane'}),
    ])
};

module.exports = {
    models: {
        Friend
    },
    syncAndSeed
};