async function fetchProducts() {
    const res = await fetch('https://dummyjson.com/products');
    const data = await res.json();
    return data.products.slice(0, 30);
}

function renderTable(products) {
    const main = document.querySelector('.main-container');
    main.innerHTML = "";
    const table = document.createElement('table');
    table.border = "1";
    table.style.borderCollapse = "collapse";
    const header = table.insertRow();
    ['Zdjęcie', 'Tytuł', 'Opis'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        th.style.padding = "5px";
        header.appendChild(th);
    });
    products.forEach(p => {
        const row = table.insertRow();
        const tdImg = row.insertCell();
        const img = document.createElement('img');
        img.src = p.thumbnail;
        img.alt = p.title;
        img.width = 100;
        tdImg.appendChild(img);
        const tdTitle = row.insertCell();
        tdTitle.textContent = p.title;
        const tdDesc = row.insertCell();
        tdDesc.textContent = p.description;
    });
    main.appendChild(table);
}

function updateTable() {
    let filtered = originalProducts.filter(p =>
        p.title.toLowerCase().includes(filterInput.value.toLowerCase())
    );
    const sortValue = sortSelect.value;
    if (sortValue == 'asc')
        filtered.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortValue == 'desc')
        filtered.sort((a, b) => b.title.localeCompare(a.title));
    renderTable(filtered);
}

async function main() {
    originalProducts = await fetchProducts();
    renderTable(originalProducts);
    filterInput.addEventListener('input', updateTable);
    sortSelect.addEventListener('change', updateTable);
}

let originalProducts = [];
const filterInput = document.getElementById('filter');
const sortSelect = document.getElementById('sort');
main();