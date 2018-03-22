class SelfCamera extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            Self Camera
        `;
    }
}
window.customElements.define('self-camera', SelfCamera);
