// Get DOM elements
const signInBtn = document.getElementById("signInBtn");
const signInModal = document.getElementById("signInModal");
const closeModal = document.getElementById("closeModal");

// Open modal when Sign In button is clicked
signInBtn.addEventListener("click", () => {
    signInModal.style.display = "flex";
});

// Close modal when close button is clicked
closeModal.addEventListener("click", () => {
    signInModal.style.display = "none";
});

// Close modal when clicking outside the modal
window.addEventListener("click", (event) => {
    if (event.target === signInModal) {
        signInModal.style.display = "none";
    }
});

// Handle Google Sign-In Response
function handleCredentialResponse(response) {
    console.log("Google Sign-In Response:", response);

    // Send Google Token to Backend for Verification
    fetch("http://localhost:3000/google/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
    })
    .then(async (res) => {
        const text = await res.text(); // Get raw response
        try {
            return JSON.parse(text); // Parse JSON
        } catch (error) {
            console.error("❌ Failed to parse JSON:", text);
            throw new Error("Invalid JSON response from server");
        }
    })
    .then((data) => {
        console.log("✅ Login Successful:", data);
        
        // Store token in localStorage for future requests
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login Successful! Welcome, " + data.user.name);
        signInModal.style.display = "none"; // Close modal after login

        // Redirect to dashboard or profile page
        window.location.href = "profile.html"; // Change this if needed
    })
    .catch((error) => {
        console.error("❌ Fetch error:", error);
        alert("Login failed. Please try again.");
    });
}

// Add Google Sign-In Button
window.onload = function () {
    google.accounts.id.initialize({
        client_id: "263377282526-qioeb9vm8l6eac3ch59bg9qib2rm8t57.apps.googleusercontent.com", // Replace with your actual Google Client ID
        callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
        document.getElementById("googleSignIn"),
        { theme: "outline", size: "large" }
    );

    google.accounts.id.prompt(); // Show One Tap Sign-in
};
