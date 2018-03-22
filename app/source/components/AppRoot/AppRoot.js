import '../SelfCamera/SelfCamera';

import './AppRoot.pcss';

class AppRoot extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<self-camera></self-camera>`;
    }
}
window.customElements.define('app-root', AppRoot);
