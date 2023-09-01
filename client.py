import asyncio
import websockets

# 사용자 입력을 받아서 웹소켓을 통해 서버로 메시지를 전송하는 비동기 함수
async def user_input():
    async with websockets.connect("ws://localhost:8765") as websocket:
        while True:
            message = input("나: ")  # 사용자로부터 메시지 입력
            await websocket.send(message)  # 웹소켓을 통해 서버로 메시지 전송

# 웹소켓을 통해 서버로부터 메시지를 수신하고 출력하는 비동기 함수
async def receive_messages():
    async with websockets.connect("ws://localhost:8765") as websocket:
        while True:
            message = await websocket.recv()  # 웹소켓을 통해 서버로부터 메시지 수신
            print("상대방:", message)  # 수신한 메시지 출력

# 메인 비동기 함수
async def main():
    # user_input()과 receive_messages() 함수를 동시에 실행
    await asyncio.gather(user_input(), receive_messages())

# asyncio 루프를 생성하고 main() 함수를 실행
asyncio.get_event_loop().run_until_complete(main())
