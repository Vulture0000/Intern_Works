```javascript
// =========================
// MOBILE MENU
// =========================

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {

    menuBtn.addEventListener("click", function () {

        navLinks.classList.toggle("active");

    });

}


// =========================
// CONTACT FORM
// =========================

const contactForm =
    document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const name =
                document.getElementById(
                    "contactName"
                ).value;

            const message =
                document.getElementById(
                    "contactMessage"
                );

            message.textContent =
                "Thank you, " +
                name +
                "! Your message has been received.";

            contactForm.reset();

        }
    );

}


// =========================
// LOGIN
// =========================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();

            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const loginMessage =
                document.getElementById(
                    "loginMessage"
                );


            // Dummy login credentials

            const correctEmail =
                "admin@novatech.com";

            const correctPassword =
                "123456";


            if (
                email === correctEmail &&
                password === correctPassword
            ) {

                loginMessage.textContent =
                    "Login successful!";

                loginMessage.style.color =
                    "#16a34a";


                // Save login status
                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                // Redirect to home
                setTimeout(function () {

                    window.location.href =
                        "index.html";

                }, 1000);

            } else {

                loginMessage.textContent =
                    "Invalid email or password.";

                loginMessage.style.color =
                    "#dc2626";

            }

        }
    );

}
```
