const beforeAuth = document.getElementById("beforeAuth");
const afterAuth = document.getElementById("afterAuth");
const navLinks = document.getElementById("navLinks");
const logOutBtn = document.getElementById("logOutBtn");
const userGreeting = document.getElementById("userGreeting");

function renderNavigation() {
    const currentUser = sessionStorage.getItem("currentUser");

    const isRoot = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
    const pagesPrefix = isRoot ? "pages/" : "";

    if (currentUser) {
        const parsedUser = JSON.parse(currentUser);

        if (beforeAuth) beforeAuth.classList.add("hidden");
        if (afterAuth) afterAuth.classList.remove("hidden");

        if (userGreeting) {
            userGreeting.innerText = `Hello, ${parsedUser.username}`;
        }

        if (navLinks) {
            navLinks.innerHTML = "";
            if (parsedUser.role === 'admin' || parsedUser.isAdmin) {
                navLinks.innerHTML += `<li><a href="${pagesPrefix}admin_books.html">Manage Books</a></li>`;
                navLinks.innerHTML += `<li><a href="${pagesPrefix}add_book.html">Add Book</a></li>`;
            } else {
                navLinks.innerHTML += `<li><a href="${pagesPrefix}search_books.html">Search for Books</a></li>`;
                navLinks.innerHTML += `<li><a href="${pagesPrefix}user_borrowed.html">My Borrowed Books</a></li>`;
            }
        }
    } else {
        if (beforeAuth) beforeAuth.classList.remove("hidden");
        if (afterAuth) afterAuth.classList.add("hidden");

        if (navLinks) {
            navLinks.innerHTML = `<li><a href="${pagesPrefix}search_books.html">Explore Catalog</a></li>`;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderNavigation();
});

if (logOutBtn) {
    logOutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("currentUser");

        const isRoot = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
        window.location.href = isRoot ? "index.html" : "../index.html";
    });
}
