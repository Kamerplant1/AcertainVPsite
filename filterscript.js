document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const listItems = document.querySelectorAll('#list li');

    searchInput.addEventListener('keyup', () => {
        const filter = searchInput.value.toLowerCase();

        listItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(filter)) {
                item.parentElement.style.display = ''; // Show the item
            } else {
                item.parentElement.style.display = 'none'; // Hide the item
            }
        });
    });
});