const chatOutput = document.getElementById('chat-output');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const messageHistory = [];

const websocket = new WebSocket('ws://localhost:8765');

sendButton.addEventListener('click', () => {
    sendMessage();
});

chatInput.addEventListener('keyup', event => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

function sendMessage() {
    const message = chatInput.value;
    if (message.trim() !== '') {
        websocket.send(message);
        chatInput.value = '';
    }
}

websocket.addEventListener('message', event => {
    const message = event.data;
    const currentTime = new Date().toLocaleTimeString();
    messageHistory.push({ message, time: currentTime });
    updateChatHistory();
});

function updateChatHistory() {
    chatOutput.innerHTML = '';
    messageHistory.forEach(entry => {
        const messageElement = document.createElement('li');
        messageElement.textContent = `${entry.message}`;
        chatOutput.appendChild(messageElement);

        const timeElement = document.createElement('span');
        timeElement.textContent = `[${entry.time}]`;
        timeElement.style.fontSize = '12px'; // 시간 부분 폰트 크기 조정
        timeElement.style.color = 'gray'; // 시간 부분 색상 변경
        messageElement.insertBefore(timeElement, messageElement.firstChild);
    });
}
