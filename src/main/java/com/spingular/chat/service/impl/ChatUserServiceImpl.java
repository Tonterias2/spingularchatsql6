package com.spingular.chat.service.impl;

import com.spingular.chat.service.ChatUserService;
import com.spingular.chat.domain.ChatUser;
import com.spingular.chat.repository.ChatUserRepository;
import com.spingular.chat.service.dto.ChatUserDTO;
import com.spingular.chat.service.mapper.ChatUserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link ChatUser}.
 */
@Service
@Transactional
public class ChatUserServiceImpl implements ChatUserService {

    private final Logger log = LoggerFactory.getLogger(ChatUserServiceImpl.class);

    private final ChatUserRepository chatUserRepository;

    private final ChatUserMapper chatUserMapper;

    public ChatUserServiceImpl(ChatUserRepository chatUserRepository, ChatUserMapper chatUserMapper) {
        this.chatUserRepository = chatUserRepository;
        this.chatUserMapper = chatUserMapper;
    }

    /**
     * Save a chatUser.
     *
     * @param chatUserDTO the entity to save.
     * @return the persisted entity.
     */
    @Override
    public ChatUserDTO save(ChatUserDTO chatUserDTO) {
        log.debug("Request to save ChatUser : {}", chatUserDTO);
        ChatUser chatUser = chatUserMapper.toEntity(chatUserDTO);
        chatUser = chatUserRepository.save(chatUser);
        return chatUserMapper.toDto(chatUser);
    }

    /**
     * Get all the chatUsers.
     *
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public List<ChatUserDTO> findAll() {
        log.debug("Request to get all ChatUsers");
        return chatUserRepository.findAll().stream()
            .map(chatUserMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }


    /**
     * Get one chatUser by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<ChatUserDTO> findOne(Long id) {
        log.debug("Request to get ChatUser : {}", id);
        return chatUserRepository.findById(id)
            .map(chatUserMapper::toDto);
    }

    /**
     * Delete the chatUser by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete ChatUser : {}", id);
        chatUserRepository.deleteById(id);
    }
}
