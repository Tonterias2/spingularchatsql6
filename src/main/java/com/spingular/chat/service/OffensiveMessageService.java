package com.spingular.chat.service;

import com.spingular.chat.service.dto.OffensiveMessageDTO;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link com.spingular.chat.domain.OffensiveMessage}.
 */
public interface OffensiveMessageService {

    /**
     * Save a offensiveMessage.
     *
     * @param offensiveMessageDTO the entity to save.
     * @return the persisted entity.
     */
    OffensiveMessageDTO save(OffensiveMessageDTO offensiveMessageDTO);

    /**
     * Get all the offensiveMessages.
     *
     * @return the list of entities.
     */
    List<OffensiveMessageDTO> findAll();


    /**
     * Get the "id" offensiveMessage.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<OffensiveMessageDTO> findOne(Long id);

    /**
     * Delete the "id" offensiveMessage.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
