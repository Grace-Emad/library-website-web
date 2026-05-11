if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify([]));
}

let addForm = document.getElementById("addBookForm");
if (addForm) {
    addForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let name = document.querySelector('[name="bookName"]').value;
        let author = document.querySelector('[name="author"]').value;
        let category = document.querySelector('[name="category"]').value;
        let description = document.querySelector('[name="description"]').value;

        let books = JSON.parse(localStorage.getItem("books"));

        let newBook = {
            id: Date.now(),
            title: name,
            author: author,
            category: category,
            description: description,
            status: "available"
        };

        books.push(newBook);
        localStorage.setItem("books", JSON.stringify(books));

        alert("Book added successfully ✅");
        addForm.reset();
    });
}

let editForm = document.getElementById("editBookForm");
if (editForm) {
    const editIndex = localStorage.getItem("editIndex");
    if (editIndex !== null) {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        let book = books[parseInt(editIndex)];

        if (book) {
            document.getElementById("bookID").value = book.id || '';
            document.getElementById("title").value = book.title || '';
            document.getElementById("author").value = book.author || '';
            document.getElementById("category").value = book.category || '';

            let descArea = document.querySelector('[name="description"]');
            if (descArea && book.description) {
                descArea.value = book.description;
            }
        }
    }

    editForm.addEventListener("submit", function(e) {
        e.preventDefault();

        let editIndex = localStorage.getItem("editIndex");
        if (editIndex === null) {
            alert("No book selected for editing ❌");
            return;
        }

        let books = JSON.parse(localStorage.getItem("books"));
        let index = parseInt(editIndex);

        let newName = document.getElementById("title").value;
        let newAuthor = document.getElementById("author").value;
        let newCategory = document.getElementById("category").value;
        let newDesc = document.querySelector('[name="description"]').value;

        if (books[index]) {
            books[index].title = newName;
            books[index].author = newAuthor;
            books[index].category = newCategory;
            books[index].description = newDesc;

            localStorage.setItem("books", JSON.stringify(books));
            alert("Book updated successfully ✏️");

            window.location.href = "admin_books.html";
        }
    });
}

function displayAdminBooks(filteredBooks = null) {
    let allBooks = JSON.parse(localStorage.getItem("books")) || [];
    let booksToDisplay = filteredBooks || allBooks;
    let tableBody = document.getElementById("tableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    booksToDisplay.forEach((book, index) => {
        let statusDisplay = book.status === 'available' ? 'Available' : 'Not Available';
        tableBody.innerHTML += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${statusDisplay}</td>
                <td>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn" onclick="deleteBook(${index})">Delete</button>
                        <button class="btn" onclick="editBook(${index})">Edit</button>
                    </div>
                </td>
            </tr>
        `;
    });
}

function setupAdminSearch() {
    const searchInput = document.getElementById("searchInput");
    if (!searchInput) return;

    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        let allBooks = JSON.parse(localStorage.getItem("books")) || [];
        const filtered = allBooks.filter(book =>
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.category.toLowerCase().includes(searchTerm)
        );
        displayAdminBooks(filtered);
    });
}

function deleteBook(index) {
    if (confirm("Are you sure you want to delete this book?")) {
        let books = JSON.parse(localStorage.getItem("books")) || [];
        books.splice(index, 1);
        localStorage.setItem("books", JSON.stringify(books));
        displayAdminBooks();
    }
}

function editBook(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "edit_book.html";
}

document.addEventListener("DOMContentLoaded", () => {
    displayAdminBooks();
    setupAdminSearch();
});
