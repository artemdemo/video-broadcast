import '../SelfCamera/SelfCamera';

class AppRoot extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<self-camera></self-camera>`;
    }
}
window.customElements.define('app-root', AppRoot);
