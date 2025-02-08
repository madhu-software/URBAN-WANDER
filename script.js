document.querySelector('.theme-toggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
});

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const hero = document.querySelector('.hero');
    const features = document.querySelector('.features');
    const popularDestinations = document.querySelector('.popular-destinations');

    // Adjust the opacity of the header based on scroll position
    const scrollPosition = window.scrollY;
    header.style.opacity = 1 - scrollPosition / 100;

    // Parallax effect for sections
    hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
    features.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
    popularDestinations.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
});


document.querySelector('.primary').addEventListener('click', function() {
    window.location.href = 'planning.html';
  });

  document.querySelector('.ternary').addEventListener('click', function() {
    window.location.href = 'booking.html';
  });

  document.querySelector('.secondary').addEventListener('click', function() {
    window.location.href = 'chatbot.html';
  });

  document.querySelector('nav ul li:nth-child(1) a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior if you are using <a> tags
    window.location.href = 'planning.html';
});

document.querySelector('nav ul li:nth-child(2) a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior if you are using <a> tags
    window.location.href = 'booking.html'; // Or 'book-stay.html' if you have a separate page
});

document.querySelector('nav ul li:nth-child(2) a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior if you are using <a> tags
    window.location.href = 'booking.html'; // Or 'book-stay.html' if you have a separate page
});

document.querySelector('nav ul li:nth-child(3) a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior if you are using <a> tags
    window.location.href = '#popular-destinations-section';
});
  

  // Function to open the chatbot
  function openChatbot() {
    document.getElementById("chatbot").style.display = "block";
    makeDraggable(document.getElementById("chatbot")); // Make draggable when opened
}

// Function to close the chatbot
function closeChatbot() {
    document.getElementById("chatbot").style.display = "none";
}

// Function to send a message to the chatbot
function sendMessage() {
    const userInput = document.getElementById("user-input").value;
    console.log(userInput);
    if (userInput.trim() === "") {
        return;
    }

    const chatbotBody = document.getElementById("chatbot-body");
    const userMessage = document.createElement("p");
    userMessage.textContent = "You: " + userInput;
    chatbotBody.appendChild(userMessage);

    document.getElementById("user-input").value = "";

    // Send the message to the API (replace with your actual API endpoint)
    fetch('https://ai-chat-8pqk.onrender.com/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userInput })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const botMessage = document.createElement("p");
        botMessage.textContent = "Yathra: " + data.response;
        chatbotBody.appendChild(botMessage);
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Function to make an element draggable
function makeDraggable(element) {
    if (!element) return; // Exit if the element is not found

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = document.querySelector('.chatbot-header'); // Drag from header

    header.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

