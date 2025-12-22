// Function to start listening to the user's voice
function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Set the language to English

    recognition.start(); // Start listening for voice input

    recognition.onresult = function(event) {
        const voiceInput = event.results[0][0].transcript; // Get the speech input
        console.log('You said:', voiceInput);

        // Clear previous result
        document.getElementById('result').innerHTML = '';

        // Send the recognized text to the backend server
        fetch('http://localhost:3000/query', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ text: voiceInput }) // Send the recognized speech
        })
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            console.log(data);
            if (data.message) {
                // If there's no transport data, display "No traveling available"
                document.getElementById('result').innerHTML = `<p>No traveling available</p>`;
            } else {
                // If there's transport data, display it
                document.getElementById('result').innerHTML = `
                    <h2>Available Transport:</h2>
                    <p>Type: ${data.type}</p>
                    <p>Route: ${data.route}</p>
                    <p>Departure: ${data.departure_time}</p>
                    <p>Arrival: ${data.arrival_time}</p>
                `;
            }
        })
        .catch(error => console.error('Error:', error));
    };
}

// Speak Now Button Event Listener
document.getElementById('speakButton').addEventListener('click', () => {
    startListening();  // Start listening when the user clicks the button
});

// Optionally, you can add a mock result after the page refresh
window.onload = () => {
    const result = document.getElementById('result');
    result.innerHTML = `
        <h2>Transport Info for Selected City:</h2>
        <p>Example: Next bus from Hyderabad to Vijayawada departs at 06:00 AM</p>
    `;
};
