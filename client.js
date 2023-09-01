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
        // 자신의 메시지인지 여부를 표시하기 위해 isSelf 속성을 추가
        messageHistory.push({ message, time: new Date().toLocaleTimeString(), isSelf: true });
        updateChatHistory();
    }
}

websocket.addEventListener('message', event => {
    const message = event.data;
    // 상대방의 메시지인 경우 isSelf를 false로 설정
    messageHistory.push({ message, time: new Date().toLocaleTimeString(), isSelf: false });
    updateChatHistory();
});

function updateChatHistory() {
    chatOutput.innerHTML = '';
    messageHistory.forEach(entry => {
        const messageElement = document.createElement('li');
        messageElement.textContent = entry.message;
        
        // isSelf 값에 따라 스타일을 설정
        if (entry.isSelf) {
            messageElement.style.textAlign = 'right'; // 자신의 메시지는 오른쪽으로 정렬
            messageElement.style.color = 'blue'; // 자신의 메시지는 파란색
        } else {
            messageElement.style.textAlign = 'left'; // 상대방의 메시지는 왼쪽으로 정렬
            messageElement.style.color = 'black'; // 상대방의 메시지는 검은색
        }

        const timeElement = document.createElement('span');
        timeElement.textContent = `[${entry.time}]`;
        timeElement.style.fontSize = '12px';
        timeElement.style.color = 'gray';
        messageElement.appendChild(timeElement); // 시간은 메시지 안에 추가

        chatOutput.appendChild(messageElement);
    });
}
