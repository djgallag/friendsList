const axios = require('axios');

const render = (friends) => {
    const list = document.querySelector('ul');
    const error = document.querySelector('#error');
    error.innerText = '';
    friends.sort((x,y) => y.rating - x.rating);
    const html = friends.map(friend => {
        return `
            <li data-id='${friend.id}'>
                <h2>${friend.name}</h2>
                <span>${friend.rating}</span>
                <button data-id='${friend.id}'>+</button>
                <button data-id='${friend.id}'>-</button>
                <button data-id='${friend.id}'>x</button>
            </li>
        `;
    }).join('');
    list.innerHTML = html;
}

const init = async () => {
    const response = await axios.get('/api/friends');
    let friends = response.data;
    render(friends);
    const list = document.querySelector('ul');
    const form = document.querySelector('form');

    list.addEventListener('click', async (event) => {
        try {
            if (event.target.tagName === 'BUTTON') {
                if (event.target.innerHTML === 'x') {
                    const id = event.target.getAttribute('data-id')*1;
                    await axios.delete(`api/friends/${id}`);
                    friends = friends.filter(friend => friend.id !== id);
                    render(friends);
                }
                else {
                    const id = event.target.getAttribute('data-id')*1;
                    const friend = friends.find(elem => elem.id === id);
                    const check = event.target.innerHTML === '+';
                    friend.rating = check ? ++friend.rating : --friend.rating;
                    await axios.put(`/api/friends/${friend.id}`, {rating: friend.rating});
                    render(friends);
                }
            }
        }
        catch(err) {
            console.error(err);
        }
    })

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        try{
            const response = await axios.post('api/friends');
            friends.push(response.data);
            render(friends);
        }
        catch(err) {
            console.error(err);
        }
    })
}

init();