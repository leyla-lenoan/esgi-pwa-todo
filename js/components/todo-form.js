import {css, html, LitElement} from "lit-element";

export default class TodoForm extends LitElement {
    constructor() {
        super();
        this.title = "";
        this.placeholder = "";
    }

    static get properties() {
        return {
            title: {type: String},
            placeholder: {type: String}
        }
    }

    static get styles() {
        return css`
            :root {
                background: #f5f6fa;
                color: #9c9c9c;
                font: 1rem "PT Sans", sans-serif;
            }

            a {
                color: inherit;
            }

            a:hover {
                color: #7f8ff4;
            }
            
            .container {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
            }
            
            .container > label {
                width: 360px;
                margin: 10px 0 5px;
                font-size: 1rem;
            }

            .input {
                width: 360px;
                background: #fff;
                color: #5a5a5a;
                font: inherit;
                box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.1);
                border: 0;
                outline: 0;
                padding: 22px 18px;
            }
            
            .uppercase {
                text-transform: uppercase;
            }
            
            .btn {
                margin: 10px 0;
                background: transparent;
                color: inherit;
                font: inherit;
                border: 0;
                outline: 0;
                padding: 0;
                transition: all 200ms ease-in;
                cursor: pointer;
            }

            .btn-primary {
                background: #7f8ff4;
                color: #fff;
                box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.1);
                border-radius: 1.25rem;
                padding: 10px 20px;
            }

            .btn-primary:hover {
                background: #6c7ff2;
            }

            .btn-primary:active {
                background: #7f8ff4;
                box-shadow: inset 0 0 10px 2px rgba(0, 0, 0, 0.2);
            }
        `
    }

    addTodo() {
        let newTodo = this.shadowRoot.querySelector('.input');        
        if (newTodo.value !== '') {    
            let event = new CustomEvent('new-todo', {
                detail: newTodo.value
            });
            document.dispatchEvent(event);
            newTodo.value = '';
        }
    }

    firstUpdated(_changeProperty) {
        let btn = this.shadowRoot.querySelector('.btn');
        btn.addEventListener('click', () => {
            this.addTodo();
        });
        this.shadowRoot.querySelector('.input').addEventListener('keydown', e => {
            if (e.keyCode == 13) {
                btn.click();
            }
        });
    }

    render() {
        return html`
            <div class="container">
                <label for="input-new-todo">Nouvelle tâche</label>
                <input type="text" id="input-new-todo" class="input" placeholder="${this.placeholder}"/>
                <button class="btn btn-primary uppercase">${this.title}</button>
            </div>
        `;
    }
}

customElements.define('todo-form', TodoForm);