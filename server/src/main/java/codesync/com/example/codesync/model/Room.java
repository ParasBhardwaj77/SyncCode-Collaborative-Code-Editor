package codesync.com.example.codesync.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Getter
@RequiredArgsConstructor
public class Room {

    private final String roomId;
    // Track by name (username) instead of sessionId to maintain status
    private final Map<String, Participant> participants = new ConcurrentHashMap<>();

    public void addParticipant(Participant participant) {
        participants.put(participant.getName(), participant);
    }

    public void removeParticipantBySessionId(String sessionId) {
        participants.values().stream()
                .filter(p -> sessionId.equals(p.getSessionId()))
                .findFirst()
                .ifPresent(p -> p.setOnline(false));
    }

    public Collection<Participant> getParticipants() {
        return participants.values();
    }

}
