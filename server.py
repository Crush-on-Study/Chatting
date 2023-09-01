import asyncio
import websockets

clients = set()  # 클라이언트 웹소켓 연결을 저장하는 집합

# 메시지를 모든 클라이언트에게 전달하는 함수
async def broadcast(message):
    if clients:
        # 모든 클라이언트에게 메시지 전송을 병렬로 실행
        tasks = [client.send(message) for client in clients]
        await asyncio.gather(*tasks)

# 각 클라이언트와의 연결을 관리하는 함수
async def client_handler(websocket, path):
    clients.add(websocket)  # 새로운 클라이언트 연결을 집합에 추가
    try:
        async for message in websocket:  # 클라이언트로부터 메시지 수신 대기
            await broadcast(message)  # 받은 메시지를 모든 클라이언트에게 전달
            
    finally:
        clients.remove(websocket)  # 클라이언트 연결이 종료되면 집합에서 제거

# 웹소켓 서버를 시작하고 클라이언트 연결을 처리하는 메인 함수
async def main():
    start_server = await websockets.serve(client_handler, "localhost", 8765)
    await start_server.wait_closed()  # 서버 종료 대기

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(main())  # 메인 함수 실행