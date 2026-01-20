package codesync.com.example.codesync.service;

import codesync.com.example.codesync.model.Participant;
import codesync.com.example.codesync.model.Room;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class RoomService {

    private final Map<String, Room> rooms = new ConcurrentHashMap<>();

    public Room getOrCreateRoom(String roomId) {
        rooms.computeIfAbsent(roomId, id -> {
            log.info("Creating new room :{}", id);
            return new Room(id);
        });
        return rooms.get(roomId);
    }

    public void addParticipant(String roomId, Participant participant) {
        Room room = getOrCreateRoom(roomId);
        // If participant already exists by name, just update their status and session
        // ID
        room.addParticipant(participant);
        log.info("👤 Participant {} joined/reconnected to room {}", participant.getName(), roomId);
    }

    public void removeParticipant(String roomId, String sessionId) {
        Room room = rooms.get(roomId);
        if (room != null) {
            room.removeParticipantBySessionId(sessionId);
            log.info("❌ Participant with session {} went offline in room {}", sessionId, roomId);
        }
    }

    public Room getRoom(String roomId) {
        return rooms.get(roomId);
    }

}
