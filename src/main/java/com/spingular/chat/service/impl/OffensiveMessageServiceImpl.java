package com.spingular.chat.service.impl;

import com.spingular.chat.service.OffensiveMessageService;
import com.spingular.chat.domain.OffensiveMessage;
import com.spingular.chat.repository.OffensiveMessageRepository;
import com.spingular.chat.service.dto.OffensiveMessageDTO;
import com.spingular.chat.service.mapper.OffensiveMessageMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link OffensiveMessage}.
 */
@Service
@Transactional
public class OffensiveMessageServiceImpl implements OffensiveMessageService {

    private final Logger log = LoggerFactory.getLogger(OffensiveMessageServiceImpl.class);

    private final OffensiveMessageRepository offensiveMessageRepository;

    private final OffensiveMessageMapper offensiveMessageMapper;

    public OffensiveMessageServiceImpl(OffensiveMessageRepository offensiveMessageRepository, OffensiveMessageMapper offensiveMessageMapper) {
        this.offensiveMessageRepository = offensiveMessageRepository;
        this.offensiveMessageMapper = offensiveMessageMapper;
    }

    /**
     * Save a offensiveMessage.
     *
     * @param offensiveMessageDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public OffensiveMessageDTO save(OffensiveMessageDTO offensiveMessageDTO) {
        log.debug("Request to save OffensiveMessage : {}", offensiveMessageDTO);
        OffensiveMessage offensiveMessage = offensiveMessageMapper.toEntity(offensiveMessageDTO);
        offensiveMessage = offensiveMessageRepository.save(offensiveMessage);
        return offensiveMessageMapper.toDto(offensiveMessage);
    }

    /**
     * Get all the offensiveMessages.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<OffensiveMessageDTO> findAll() {
        log.debug("Request to get all OffensiveMessages");
        return offensiveMessageRepository.findAll().stream()
            .map(offensiveMessageMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one offensiveMessage by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<OffensiveMessageDTO> findOne(Long id) {
        log.debug("Request to get OffensiveMessage : {}", id);
        return offensiveMessageRepository.findById(id)
            .map(offensiveMessageMapper::toDto);
    }

    /**
     * Delete the offensiveMessage by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete OffensiveMessage : {}", id);
        offensiveMessageRepository.deleteById(id);
    }
}
