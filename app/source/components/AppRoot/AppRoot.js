import '../ExternalCamera/ExternalCamera';
import '../SelfCamera/SelfCamera';

import './AppRoot.pcss';

class AppRoot extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class='mt-3'>
                <div class='container'>
                    <div class='row'>
                        <div class='col-md'>
                            <external-camera></external-camera>
                        </div>
                        <div class='col-md'>
                            <self-camera></self-camera>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}
window.customElements.define('app-root', AppRoot);
