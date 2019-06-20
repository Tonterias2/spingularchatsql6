package com.spingular.chat.repository;

import com.spingular.chat.domain.ChatNotification;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the ChatNotification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChatNotificationRepository extends JpaRepository<ChatNotification, Long>, JpaSpecificationExecutor<ChatNotification> {

}
