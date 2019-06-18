package com.spingular.chat.repository;

import com.spingular.chat.domain.ChatNotification;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the ChatNotification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatNotificationRepository extends JpaRepository<ChatNotification, Long>, JpaSpecificationExecutor<ChatNotification> {

    @Query("select chatNotification from ChatNotification chatNotification where chatNotification.user.login = ?#{principal.username}")
    List<ChatNotification> findByUserIsCurrentUser();

}
