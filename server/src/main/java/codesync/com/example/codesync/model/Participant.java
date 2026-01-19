package codesync.com.example.codesync.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class Participant {

    private String sessionId;
    private String name;
    private String color;

}
