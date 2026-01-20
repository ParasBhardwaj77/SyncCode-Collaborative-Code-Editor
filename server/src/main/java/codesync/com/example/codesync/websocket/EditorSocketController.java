package codesync.com.example.codesync.websocket;

import codesync.com.example.codesync.model.MessageType;
import codesync.com.example.codesync.model.Participant;
import codesync.com.example.codesync.model.Room;
import codesync.com.example.codesync.model.SocketMessage;
import codesync.com.example.codesync.service.RoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Slf4j
@Controller
@RequiredArgsConstructor
public class EditorSocketController {

        private final RoomService roomService;
        private final SimpMessagingTemplate messagingTemplate;

        /* ---------------- JOIN ROOM ---------------- */

        @MessageMapping("/room.join")
        public void joinRoom(
                        @Payload SocketMessage message,
                        org.springframework.messaging.Message<?> stompMessage) {

                String roomId = message.getRoomId();

                String sessionId = (String) stompMessage
                                .getHeaders()
                                .get("simpSessionId");

                @SuppressWarnings("unchecked")
                Map<String, Object> payload = (Map<String, Object>) message.getPayload();

                String name = payload.getOrDefault("name", "Anonymous").toString().trim();
                String avatar = payload
                                .getOrDefault("avatar", "https://api.dicebear.com/7.x/avataaars/svg?seed=" + name)
                                .toString();

                Participant participant = Participant.builder()
                                .sessionId(sessionId)
                                .name(name)
                                .avatar(avatar)
                                .color(generateColor())
                                .isOnline(true)
                                .build();

                roomService.addParticipant(roomId, participant);

                messagingTemplate.convertAndSend(
                                "/topic/room/" + roomId,
                                buildParticipantsUpdate(roomId));

                // Send current code to the joining user (broadcast to everyone, but client
                // filters by targetName)
                Room room = roomService.getRoom(roomId);
                if (room.getCurrentCode() != null) {
                        SocketMessage syncMessage = new SocketMessage();
                        syncMessage.setType(MessageType.CODE_SYNC);
                        syncMessage.setRoomId(roomId);
                        Map<String, Object> syncPayload = Map.of(
                                        "code", room.getCurrentCode(),
                                        "language", room.getCurrentLanguage(),
                                        "targetName", name);
                        syncMessage.setPayload(syncPayload);
                        messagingTemplate.convertAndSend("/topic/room/" + roomId, syncMessage);
                }

                log.info("✅ {} joined room {}", name, roomId);
        }

        /* ---------------- LEAVE ROOM ---------------- */

        @MessageMapping("/room.leave")
        public void leaveRoom(
                        @Payload SocketMessage message,
                        org.springframework.messaging.Message<?> stompMessage) {

                String roomId = message.getRoomId();
                String sessionId = (String) stompMessage
                                .getHeaders()
                                .get("simpSessionId");

                roomService.removeParticipant(roomId, sessionId);

                messagingTemplate.convertAndSend(
                                "/topic/room/" + roomId,
                                buildParticipantsUpdate(roomId));

                log.info("❌ Session {} left room {}", sessionId, roomId);
        }

        /* ---------------- CODE CHANGE ---------------- */

        @MessageMapping("/code.change")
        public void codeChange(
                        @Payload SocketMessage message,
                        org.springframework.messaging.Message<?> stompMessage) {

                String sessionId = (String) stompMessage
                                .getHeaders()
                                .get("simpSessionId");

                Map<String, Object> payload = (Map<String, Object>) message.getPayload();
                payload.put("senderSessionId", sessionId);

                // Update room state
                Room room = roomService.getRoom(message.getRoomId());
                if (room != null) {
                        if (payload.containsKey("code")) {
                                room.setCurrentCode(payload.get("code").toString());
                        }
                        if (payload.containsKey("language")) {
                                room.setCurrentLanguage(payload.get("language").toString());
                        }
                }

                messagingTemplate.convertAndSend(
                                "/topic/room/" + message.getRoomId(),
                                message);

                log.debug("⌨️ CODE_CHANGE [{}] from {}", message.getRoomId(), sessionId);
        }

        /* ---------------- CURSOR MOVE ---------------- */

        @MessageMapping("/cursor.move")
        public void cursorMove(@Payload SocketMessage message) {

                messagingTemplate.convertAndSend(
                                "/topic/room/" + message.getRoomId(),
                                message);

                log.debug("🖱️ CURSOR_MOVE [{}]", message.getRoomId());
        }

        /* ---------------- HELPERS ---------------- */

        private SocketMessage buildParticipantsUpdate(String roomId) {

                Room room = roomService.getRoom(roomId);

                SocketMessage response = new SocketMessage();
                response.setType(MessageType.PARTICIPANTS_UPDATE);
                response.setRoomId(roomId);
                response.setPayload(room.getParticipants());

                log.info("📢 Broadcasting participants update for room {}", roomId);

                return response;
        }

        private String generateColor() {
                return "#" + Integer.toHexString((int) (Math.random() * 0xffffff));
        }
}
