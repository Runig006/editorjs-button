import css from './index.css';

export default class Button {

    /**
     *
     * @returns {{icon: string, title: string}}
     */
    static get toolbox() {
        return {
            title: "Button",
            icon: '<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" enable-background="new 0 0 512 512" height="20" viewBox="0 0 512 512" width="20"><path d="m237.102 366v-90.018h-90c-11.046 0-20-8.954-20-20s8.954-20 20-20h90v-90.982c0-11.046 8.954-20 20-20s20 8.954 20 20v90.982h90c11.046 0 20 8.954 20 20s-8.954 20-20 20h-90v90.018c0 11.046-8.954 20-20 20s-20-8.954-20-20zm254.898-15c11.046 0 20-8.954 20-20v-251c0-44.112-35.888-80-80-80h-352c-44.112 0-80 35.888-80 80v352c0 44.112 35.888 80 80 80h352c44.112 0 80-35.888 80-80 0-11.046-8.954-20-20-20s-20 8.954-20 20c0 22.056-17.944 40-40 40h-352c-22.056 0-40-17.944-40-40v-352c0-22.056 17.944-40 40-40h352c22.056 0 40 17.944 40 40v251c0 11.046 8.954 20 20 20z"/></svg>'
        }
    }

    static get enableLineBreaks() {
        return false;
    }

    /**
     * @param savedData
     * @returns {boolean}
     */
    validate(savedData) {
        if (this.data.link === "" || this.data.text === "") {
            return false;
        }
        return true;
    }

    /**
     *
     * @param block
     * @returns {{caption: string, text: string, alignment: string}}
     */
    save(block) {
        console.log(this.data);
        return this.data;
    }

    /**
     * @returns {{link: boolean, text: boolean}}
     */
    static get sanitize() {
        return {
            text: false,
            link: false
        }
    }

    /**
     *
     * @param data
     * @param config
     * @param api
     */
    constructor({ data, config, api }) {
        this.data = data;
        this.api = api;
        this.nodes = {
            wrapper: null,
            container: null,
            inputHolder: null,
            toggleHolder: null,
            ButtonHolder: null,
            textInput: null,
            linkInput: null,
            registButton: null,
            Button: null,
        }
        //css overwrite
        const _CSS = {
            baseClass: this.api.styles.block,
            hide: "hide",
            btn: "btn",
            container: "ButtonContainer",
            input: "ButtonContainer__input",

            inputHolder: "ButtonContainer__inputHolder",
            inputText: "ButtonContainer__input--text",
            inputLink: "ButtonContainer__input--link",
            registButton: "ButtonContainer__registerButton",
            ButtonHolder: "ButtonContainer__ButtonHolder",
            btnColor: "btn-primary",
            toggleSwitch: "toggle-switch",
            toggleInput: "toggle-input",
            toggleLabel: "toggle-label",
        }
        this.CSS = Object.assign(_CSS, config.css);
    }

    render() {
        this.nodes.wrapper = this.make('div', this.CSS.baseClass);
        this.nodes.container = this.make('div', this.CSS.container); //twitter-embed-tool

        this.nodes.ButtonHolder = this.makeButtonHolder();
        this.nodes.inputHolder = this.makeInputHolder();

        this.nodes.container.appendChild(this.nodes.inputHolder);
        this.nodes.container.appendChild(this.nodes.ButtonHolder);

        if (this.data.link != null) {
            this.nodes.textInput.value = this.data.text;
            this.nodes.linkInput.value = this.data.link;
            this.refreshButton()
        }
        this.nodes.wrapper.appendChild(this.nodes.container);
        return this.nodes.wrapper;
    }

    makeInputHolder() {
        const inputHolder = this.make('div', [this.CSS.inputHolder]);
        this.nodes.textInput = this.make('input', [this.api.styles.input, this.CSS.input, this.CSS.inputText], {
            contentEditable: !this.readOnly,
        });
        this.nodes.textInput.dataset.placeholder = this.api.i18n.t('Button Text');

        this.nodes.linkInput = this.make('input', [this.api.styles.input, this.CSS.input, this.CSS.inputLink], {
            contentEditable: !this.readOnly,
        })
        this.nodes.linkInput.dataset.placeholder = this.api.i18n.t('Link Url');

        
        this.nodes.registButton = this.make('div',[this.api.styles.button, this.CSS.registButton]);
        this.nodes.registButton.textContent = this.api.i18n.t('Set');
        this.nodes.registButton.addEventListener('click', (event) => {
            this.refreshButton();
        });

        inputHolder.appendChild(this.nodes.textInput);
        inputHolder.appendChild(this.nodes.linkInput);
        inputHolder.appendChild(this.nodes.registButton);
        return inputHolder;
    }

    makeButtonHolder() {
        const ButtonHolder = this.make('div', [this.CSS.show, this.CSS.ButtonHolder]);
        this.nodes.Button = this.make('a', [this.CSS.btn, this.CSS.btnColor, 'NotLoad'], {
            target: '_blank',
            rel: 'nofollow noindex noreferrer',
        });
        this.nodes.Button.textContent = this.api.i18n.t("Default Button");
        ButtonHolder.appendChild(this.nodes.Button);
        return ButtonHolder;
    }

    refreshButton() {
        this.data = {
            "link": this.nodes.linkInput.value,
            "text": this.nodes.textInput.value
        }
        this.nodes.Button.textContent = this.data.text;
        this.nodes.Button.setAttribute("href", this.data.link);
    }

    /**
     * @param tagName
     * @param classNames
     * @param attributes
     * @returns {*}
     */
    make(tagName, classNames = null, attributes = {}) {
        const el = document.createElement(tagName);

        if (Array.isArray(classNames)) {
            el.classList.add(...classNames);
        } else if (classNames) {
            el.classList.add(classNames);
        }

        for (const attrName in attributes) {
            el[attrName] = attributes[attrName];
        }

        return el;
    }
}