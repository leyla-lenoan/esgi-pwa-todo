import { openDB } from "idb";
import TodoElement from "./components/todo-element.js";
import checkConnectivity from '/js/connection.js';

(async function (document) {
    const app = document.querySelector('#app');
    const skeleton = app.querySelector('.skeleton');
    const listPage = app.querySelector('[page=list]');
    skeleton.removeAttribute('active');
    listPage.setAttribute('active', '');

    // teste la connectivité
    checkConnectivity();
    document.addEventListener('connection-changed', ({detail}) => {
        console.log(detail);
    });

    // récupération des todo-elements
    try {
        const data = await fetch('/data/spacex.json');
        const json = await data.json();

        // création de l'index indexDB
        const database = await openDB("todo-store", 1, {
            upgrade(db) {
                db.createObjectStore('todo');
            },
        });

        // teste si connecté à un réseau
        if(navigator.onLine) {
            await database.put('todo', json, 'todo');
        }
        let elements = await database.get('todo', 'todo');
        if (typeof elements === 'undefined') {
            elements = [];
        }

        // création des todo-element dans le DOM
        elements.map(elem => {
            let element = new TodoElement();
            element.init(elem.title, elem.active, elem.id);
            listPage.appendChild(element);
            return element;
        });

        // listener check element
        document.addEventListener('check-task', e => {
            elements[e.detail.id] = {
                title: e.detail.title,
                active: e.detail.active,
                id: e.detail.id
            };
            database.put('todo', elements, 'todo');
        });

        // listener new element
        document.addEventListener('new-todo', e => {
            let id = elements.length;
            elements.push({
                title: e.detail,
                active: true,
                id: id
            });
            database.put('todo', elements, 'todo');

            // création d'un element dans le DOM
            let element = new TodoElement();
            element.init(e.detail, true, id);
            listPage.appendChild(element);
            return element;
        });
    } catch (error) {
        console.log(error);
    }
})(document);