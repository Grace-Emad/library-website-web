// const loginForm = document.getElementById("loginForm");
// const signUpForm = document.getElementById("signUpForm");
// const loginButton = document.getElementById("loginSubmit");
// const signUpButton = document.getElementById("signUpSubmit");
// const loginError = document.getElementById("loginError");
// const confirmPassError = document.getElementById("confPassError");
// const emailError = document.getElementById("emailError");
// const signUpError = document.getElementById("signUpError");
//
// if (!localStorage.getItem("users")) {
//     localStorage.setItem("users", JSON.stringify([]));
// }
//
// if (loginButton && loginForm) {
//     loginForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         const username = loginForm.username.value;
//         const password = loginForm.password.value;
//
//         let users = JSON.parse(localStorage.getItem("users")) || [];
//         const user = users.find(u => u.username === username);
//
//         if (user) {
//             if (user.password === password) {
//                 sessionStorage.setItem('currentUser', JSON.stringify(user));
//                 if (user.role === 'admin' || user.isAdmin) {
//                     window.location.href = "admin_books.html";
//                 } else {
//                     window.location.href = "search_books.html";
//                 }
//             } else {
//                 loginError.innerText = "Incorrect password! try again.";
//             }
//         } else {
//             loginError.innerText = "User not found! try again or sign up.";
//         }
//     });
// }
//
// if (signUpButton && signUpForm) {
//     signUpForm.addEventListener("submit", (e) => {
//         e.preventDefault();
//         const password = signUpForm.password.value;
//         const confirmPass = signUpForm.confPass.value;
//         const username = signUpForm.username.value;
//         const email = signUpForm.email.value;
//
//         let users = JSON.parse(localStorage.getItem("users")) || [];
//
//         if (confirmPass !== password) {
//             confirmPassError.style.display = "block";
//             confirmPassError.innerText = "Passwords aren't the same!";
//             return;
//         }
//
//         const emailExists = users.some(u => u.email === email);
//         if (emailExists) {
//             emailError.style.display = "block";
//             emailError.innerText = "Email already exists! try again";
//             return;
//         }
//
//         const usernameExists = users.some(u => u.username === username);
//         if (usernameExists) {
//             signUpError.style.display = "block";
//             signUpError.innerText = "Username already exists! try again";
//             return;
//         }
//
//         const isAdminChecked = document.getElementById("isAdmin") ? document.getElementById("isAdmin").checked : false;
//
//         const newUser = {
//             username: username,
//             password: password,
//             email: email,
//             isAdmin: isAdminChecked,
//             role: isAdminChecked ? 'admin' : 'user',
//             borrowedBooks: []
//         };
//
//         users.push(newUser);
//         localStorage.setItem("users", JSON.stringify(users));
//         sessionStorage.setItem('currentUser', JSON.stringify(newUser));
//
//         if (newUser.role === 'admin' || newUser.isAdmin) {
//             window.location.href = "admin_books.html";
//         } else {
//             window.location.href = "search_books.html";
//         }
//     });
// }
