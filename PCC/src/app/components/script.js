document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll('.fondo');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.add('flip');
        });
    });
});