import { openDB } from "idb";
import TodoElement from "./components/todo-element.js";
import checkConnectivity from '/js/connection.js';

(async function (document) {
    let app = document.querySelector('#app');
    let skeleton = app.querySelector('.skeleton');
    let listPage = app.querySelector('[page=list]');
    skeleton.removeAttribute('active');
    listPage.setAttribute('active', '');

    // teste la connectivite
    checkConnectivity();
    document.addEventListener('connection-changed', ({detail}) => {
        console.log(detail);
    });

    // recuperation des todo-elements
    try {
        // const data = await fetch('../data/spacex.json');
        // const json = await data.json();

        // creation de l'indexDB
        let database = await openDB('todo-store', 1, {
            upgrade(db) {
                db.createObjectStore('todo');
            }
        });

        // teste si connecte à un reseau
        // if(navigator.onLine) {
        //     await database.put('todo', json, 'tasks');
        // }

        let elements = await database.get('todo', 'tasks');
        if (typeof elements === 'undefined') {
            elements = [];
        }

        // creation des todo-element dans le DOM
        elements.map(e => {
            let element = new TodoElement();
            element.init(e.title, e.active, e.id);
            listPage.appendChild(element);
            return element;
        });

        // listener - check une tache
        document.addEventListener('check-task', e => {
            elements[e.detail.id] = {
                title: e.detail.title,
                active: e.detail.active,
                id: e.detail.id
            };
            database.put('todo', elements, 'tasks');
        });

        // listener - creation nouvel tache
        document.addEventListener('new-todo', e => {            
            let id = elements.length;
            elements.push({
                title: e.detail,
                active: true,
                id: id
            });
            database.put('todo', elements, 'tasks');

            // creation d'un element dans le DOM
            let element = new TodoElement();
            element.init(e.detail, true, id);
            listPage.appendChild(element);
            return element;
        });
    } catch (error) {
        console.log(error);
    }
})(document);