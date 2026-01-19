package codesync.com.example.codesync.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SocketMessage {

    private MessageType type;
    private String roomId;
    private Object payload;

}
