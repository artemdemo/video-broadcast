class SelfCamera extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `Hi from camera`;
    }
}
window.customElements.define('self-camera', SelfCamera);
