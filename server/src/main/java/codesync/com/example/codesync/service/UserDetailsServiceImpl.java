package codesync.com.example.codesync.service;

import codesync.com.example.codesync.model.User;
import codesync.com.example.codesync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
        @Autowired
        UserRepository userRepository;

        @Override
        @Transactional
        public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
                System.out.println("Processing loadUserByUsername for: " + usernameOrEmail);
                User user = userRepository.findByUsername(usernameOrEmail)
                                .or(() -> userRepository.findByEmail(usernameOrEmail))
                                .orElseThrow(() -> {
                                        System.out.println("User not found in DB: " + usernameOrEmail);
                                        return new UsernameNotFoundException(
                                                        "User Not Found with username or email: " + usernameOrEmail);
                                });

                System.out.println(
                                "User found. Password length: "
                                                + (user.getPassword() != null ? user.getPassword().length() : 0));

                java.util.List<org.springframework.security.core.authority.SimpleGrantedAuthority> authorities = Collections
                                .singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority(
                                                "ROLE_USER"));

                return new org.springframework.security.core.userdetails.User(
                                user.getUsername(),
                                user.getPassword(),
                                authorities);
        }
}
