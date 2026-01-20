package codesync.com.example.codesync.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Participant {

    private String sessionId;
    private String name;
    private String avatar;
    private String color;
    @Builder.Default
    @JsonProperty("isOnline")
    private boolean isOnline = true;

}
