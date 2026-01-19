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
    private final Map<String, Participant> participants = new ConcurrentHashMap<>();

    public void addParticipant(Participant participant) {
        participants.put(participant.getSessionId(),participant);
    }

    public void removeParticipant(String sessionId){
        participants.remove(sessionId);
    }

    public Collection<Participant> getParticipants() {
        return participants.values();
    }



}
