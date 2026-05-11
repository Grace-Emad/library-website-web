function displayUserBooks(filteredBooks = null) {
  let allBooks = JSON.parse(localStorage.getItem("books")) || [];
  let booksToDisplay = filteredBooks || allBooks;
  let booksContainer = document.getElementById("booksContainer");
  if (!booksContainer) return;
  booksContainer.innerHTML = "";
  if (booksToDisplay.length === 0) {
    booksContainer.innerHTML = "<p>No books found.</p>";
    return;
  }

  booksToDisplay.forEach((book, index) => {
    let statusText = book.status === 'available' ? 'Available' : 'Not Available';
    let statusColor = book.status === 'available' ? 'green' : 'var(--error-color)';
    booksContainer.innerHTML += `
      <article class="book-card">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Category: ${book.category}</p>
        <p>Status: <strong style="color: ${statusColor};">${statusText}</strong></p>
        <button class="btn" onclick="viewDetails(${index})">View Details</button>
      </div>
    `;
  });
}

function setupUserSearch() {
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
    displayUserBooks(filtered);
  });
}

function viewDetails(index) {
  localStorage.setItem("selectedBookIndex", index);
  window.location.href = "book_details.html";
}

document.addEventListener("DOMContentLoaded", () => {
  displayUserBooks();
  setupUserSearch();
});

function loadBookDetails() {
    const selectedBookIndex = localStorage.getItem('selectedBookIndex');

    if (!selectedBookIndex) {
        document.getElementById('book-details-container').innerHTML = `
            <div>
                <h3>No book selected!</h3>
                <button class="btn" onclick="window.location.href='search_books.html'">Back to Search</button>
            </div>
        `;
        return;
    }

    let books = JSON.parse(localStorage.getItem('books')) || [];
    let book = books[parseInt(selectedBookIndex)];

    if (!book) {
        document.getElementById('book-details-container').innerHTML = `
            <div>
                <h3>Book not found!</h3>
                <button class="btn" onclick="window.location.href='search_books.html'">Back to Search</button>
            </div>
        `;
        return;
    }

    let statusText = book.status === 'available' ? 'Available' : 'Not Available (Borrowed)';

    document.getElementById('book-details-container').innerHTML = `
        <div>
            <h1>${book.title}</h1>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <p><strong>Description:</strong> ${book.description || 'No description available.'}</p>
            <p><strong>Status:</strong> <span id="status-value">${statusText}</span></p>
        </div>
    `;

    window.currentBookIndex = parseInt(selectedBookIndex);
    updateBorrowButton(book.status === 'available');
}

function updateBorrowButton(isAvailable) {
    const borrowSection = document.getElementById('borrow-section');
    if (!borrowSection) return;

    if (isAvailable) {
        borrowSection.innerHTML = `<button id="borrowBtn" class="btn">Borrow This Book</button>`;
        document.getElementById('borrowBtn').addEventListener('click', borrowCurrentBook);
    } else {
        borrowSection.innerHTML = `<button class="btn" disabled style="opacity: 0.5; cursor: not-allowed;">Not Available for Borrowing</button>`;
    }
}

function borrowCurrentBook() {
    let currentUser = sessionStorage.getItem('currentUser');

    if (!currentUser) {
        alert('Please login to borrow books.');
        if (confirm('Go to login page?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    currentUser = JSON.parse(currentUser);

    let bookIndex = window.currentBookIndex;
    if (bookIndex === undefined) {
        alert('Error: Book information not found.');
        return;
    }

    let books = JSON.parse(localStorage.getItem('books')) || [];
    let book = books[bookIndex];

    if (!book) {
        alert('Book not found in library database.');
        return;
    }

    if (book.status !== 'available') {
        alert('This book is currently not available for borrowing.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex === -1) {
        alert('User account not found. Please log in again.');
        return;
    }

    if (!users[userIndex].borrowedBooks) {
        users[userIndex].borrowedBooks = [];
    }

    if (users[userIndex].borrowedBooks.includes(book.id)) {
        alert('You have already borrowed this book.');
        return;
    }

    books[bookIndex].status = 'not available';
    users[userIndex].borrowedBooks.push(book.id);

    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

    const statusSpan = document.getElementById('status-value');
    if (statusSpan) {
        statusSpan.textContent = 'Not Available (Borrowed)';
    }

    updateBorrowButton(false);
    alert(`Successfully borrowed "${book.title}"!`);

    if (confirm('Would you like to view your borrowed books?')) {
        window.location.href = 'user_borrowed.html';
    }
}

function displayUserBorrowedBooks() {
    let currentUser = sessionStorage.getItem('currentUser');

    if (!currentUser) {
        document.getElementById('borrowed-list-container').innerHTML = `
            <div>
                <h3>Please login to view your borrowed books</h3>
                <button class="btn" onclick="window.location.href='login.html'">Go to Login</button>
            </div>
        `;
        return;
    }

    currentUser = JSON.parse(currentUser);

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let user = users.find(u => u.username === currentUser.username);

    if (!user || !user.borrowedBooks || user.borrowedBooks.length === 0) {
        document.getElementById('borrowed-list-container').innerHTML = `
            <div>
                <h3>You haven't borrowed any books yet</h3>
                <button class="btn" onclick="window.location.href='search_books.html'">Browse Books</button>
            </div>
        `;
        return;
    }

    let books = JSON.parse(localStorage.getItem('books')) || [];
    let borrowedBookIds = user.borrowedBooks;
    let borrowedBooks = books.filter(book => borrowedBookIds.includes(book.id));

    let html = '';

    borrowedBooks.forEach(book => {
        html += `
            <article>
                <h4>${book.title}</h4>
                <p><strong>ID:</strong> ${book.id}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Due Date:</strong> 14 Days</p>
                <button class="btn" onclick="returnBook(${book.id})">Return Book</button>
            </article>
        `;
    });

    document.getElementById('borrowed-list-container').innerHTML = html;
}

function returnBook(bookId) {
    let currentUser = sessionStorage.getItem('currentUser');

    if (!currentUser) {
        alert('Please login to return books.');
        window.location.href = 'login.html';
        return;
    }

    currentUser = JSON.parse(currentUser);

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userIndex = users.findIndex(u => u.username === currentUser.username);

    if (userIndex === -1) {
        alert('User not found.');
        return;
    }

    let borrowedIndex = users[userIndex].borrowedBooks.indexOf(bookId);
    if (borrowedIndex === -1) {
        alert('You have not borrowed this book.');
        return;
    }

    users[userIndex].borrowedBooks.splice(borrowedIndex, 1);

    let books = JSON.parse(localStorage.getItem('books')) || [];
    let bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex].status = 'available';
        localStorage.setItem('books', JSON.stringify(books));
    }

    localStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('currentUser', JSON.stringify(users[userIndex]));

    alert('Book returned successfully!');
    displayUserBorrowedBooks();
}

if (window.location.pathname.includes('book_details.html')) {
    document.addEventListener('DOMContentLoaded', loadBookDetails);
}

if (window.location.pathname.includes('user_borrowed.html')) {
    document.addEventListener('DOMContentLoaded', displayUserBorrowedBooks);
}
