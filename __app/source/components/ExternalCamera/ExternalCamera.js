class ExternalCamera extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            External Camera
        `;
    }
}
window.customElements.define('external-camera', ExternalCamera);
