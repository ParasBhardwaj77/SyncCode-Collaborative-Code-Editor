package codesync.com.example.codesync.controller;

import codesync.com.example.codesync.model.ExecutionRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ExecutionController {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

    private static final Map<String, String> LANGUAGE_VERSIONS = new HashMap<>();

    static {
        LANGUAGE_VERSIONS.put("javascript", "18.15.0");
    }

    @PostMapping("/execute")
    public ResponseEntity<?> executeCode(@RequestBody ExecutionRequest request) {
        String version = LANGUAGE_VERSIONS.getOrDefault(request.getLanguage(), "*");

        Map<String, Object> pistonRequest = new HashMap<>();
        pistonRequest.put("language", request.getLanguage());
        pistonRequest.put("version", version);

        Map<String, String> file = new HashMap<>();
        file.put("content", request.getContent());
        pistonRequest.put("files", Collections.singletonList(file));

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(pistonRequest, headers);

            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(PISTON_API_URL, entity, Map.class);
            @SuppressWarnings("unchecked")
            Map<String, Object> body = (Map<String, Object>) response.getBody();
            return ResponseEntity.status(response.getStatusCode()).body(body);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Execution failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
