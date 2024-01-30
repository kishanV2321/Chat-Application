const socket = io('http://192.168.5.42:3000');
// const socket = io('http://localhost:3000');


const form = document.getElementById('message-send');
const messageInput = document.getElementById('message-box');
const messageContainer = document.getElementById('message-container');

let name = prompt("Enter Your Name");
socket.emit('new-user-joined', name);

let audio = new Audio('incoming-message.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add("my-2", "bg-danger-subtle", "p-2", "border", "border-2", "border-danger-subtle", "rounded-4", "message");
    messageElement.classList.add(position);
    messageElement.style.width = "10rem";
    messageContainer.appendChild(messageElement);
    if(position === 'left'){
    audio.play();
    }

}

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
})

socket.on('left', name => {
    append(`${name} left the chat`, 'right');
})


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = ''; 
});
