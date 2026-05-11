document.addEventListener('DOMContentLoaded', () => {

    // 1. Efecto en la barra de navegación al hacer scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Animaciones de Intersección (Aparecer al hacer scroll)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // El elemento aparece cuando el 15% es visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Dejar de observar una vez visible
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
    animatedElements.forEach(el => observer.observe(el));

    // 3. Sistema de Filtrado/Búsqueda (Para Biblioteca y Resistencia)
    // Para usar esto, añade un <input type="text" id="searchInput" class="search-input" placeholder="Buscar norma o ensayo..."> en tu HTML
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            
            // Filtrar en tablas (biblioteca.html)
            const tableRows = document.querySelectorAll('tbody tr');
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });

            // Filtrar en listas de detalles (resistencia.html)
            const listItems = document.querySelectorAll('details li');
            listItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }
});