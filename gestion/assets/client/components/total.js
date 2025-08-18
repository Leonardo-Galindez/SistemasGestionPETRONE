export function renderTotal() {
    const total = `
    <div class="box has-text-centered" style="min-width: 200px; margin: 0rem; max-height: 100px; display: flex; align-items: center; justify-content: center;">
        <div style="line-height: 1.2; text-align: center;">
            <h2 class="title is-4" style="margin-bottom: 0.5rem;font-weight: bold;">Total</h2>
            <span id="total" style="font-size: 1.6rem; font-weight: bold; color:rgb(97, 97, 97);">$</span>
        </div>
    </div>
    `;
    const container = document.querySelector('.gestion');
    if (container) {
        container.insertAdjacentHTML('beforeend', total);
    }
}
