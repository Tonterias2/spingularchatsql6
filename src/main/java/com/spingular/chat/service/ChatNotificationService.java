package com.spingular.chat.service;

import com.spingular.chat.service.dto.ChatNotificationDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.spingular.chat.domain.ChatNotification}.
 */
public interface ChatNotificationService {

    /**
     * Save a chatNotification.
     *
     * @param chatNotificationDTO the entity to save.
     * @return the persisted entity.
     */
    ChatNotificationDTO save(ChatNotificationDTO chatNotificationDTO);

    /**
     * Get all the chatNotifications.
     *
     * @return the list of entities.
     */
    List<ChatNotificationDTO> findAll();


    /**
     * Get the "id" chatNotification.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<ChatNotificationDTO> findOne(Long id);

    /**
     * Delete the "id" chatNotification.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
