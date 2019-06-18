package com.spingular.chat.web.rest;

import com.spingular.chat.Spingularchatsql6App;
import com.spingular.chat.domain.ChatNotification;
import com.spingular.chat.domain.User;
import com.spingular.chat.domain.ChatMessage;
import com.spingular.chat.domain.ChatRoom;
import com.spingular.chat.repository.ChatNotificationRepository;
import com.spingular.chat.service.ChatNotificationService;
import com.spingular.chat.service.dto.ChatNotificationDTO;
import com.spingular.chat.service.mapper.ChatNotificationMapper;
import com.spingular.chat.web.rest.errors.ExceptionTranslator;
import com.spingular.chat.service.dto.ChatNotificationCriteria;
import com.spingular.chat.service.ChatNotificationQueryService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static com.spingular.chat.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link ChatNotificationResource} REST controller.
 */
@SpringBootTest(classes = Spingularchatsql6App.class)
public class ChatNotificationResourceIT {

    private static final Instant DEFAULT_CREATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private ChatNotificationRepository chatNotificationRepository;

    @Autowired
    private ChatNotificationMapper chatNotificationMapper;

    @Autowired
    private ChatNotificationService chatNotificationService;

    @Autowired
    private ChatNotificationQueryService chatNotificationQueryService;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restChatNotificationMockMvc;

    private ChatNotification chatNotification;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ChatNotificationResource chatNotificationResource = new ChatNotificationResource(chatNotificationService, chatNotificationQueryService);
        this.restChatNotificationMockMvc = MockMvcBuilders.standaloneSetup(chatNotificationResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChatNotification createEntity(EntityManager em) {
        ChatNotification chatNotification = new ChatNotification()
            .creationDate(DEFAULT_CREATION_DATE);
        return chatNotification;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ChatNotification createUpdatedEntity(EntityManager em) {
        ChatNotification chatNotification = new ChatNotification()
            .creationDate(UPDATED_CREATION_DATE);
        return chatNotification;
    }

    @BeforeEach
    public void initTest() {
        chatNotification = createEntity(em);
    }

    @Test
    @Transactional
    public void createChatNotification() throws Exception {
        int databaseSizeBeforeCreate = chatNotificationRepository.findAll().size();

        // Create the ChatNotification
        ChatNotificationDTO chatNotificationDTO = chatNotificationMapper.toDto(chatNotification);
        restChatNotificationMockMvc.perform(post("/api/chat-notifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chatNotificationDTO)))
            .andExpect(status().isCreated());

        // Validate the ChatNotification in the database
        List<ChatNotification> chatNotificationList = chatNotificationRepository.findAll();
        assertThat(chatNotificationList).hasSize(databaseSizeBeforeCreate + 1);
        ChatNotification testChatNotification = chatNotificationList.get(chatNotificationList.size() - 1);
        assertThat(testChatNotification.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    public void createChatNotificationWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = chatNotificationRepository.findAll().size();

        // Create the ChatNotification with an existing ID
        chatNotification.setId(1L);
        ChatNotificationDTO chatNotificationDTO = chatNotificationMapper.toDto(chatNotification);

        // An entity with an existing ID cannot be created, so this API call must fail
        restChatNotificationMockMvc.perform(post("/api/chat-notifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chatNotificationDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ChatNotification in the database
        List<ChatNotification> chatNotificationList = chatNotificationRepository.findAll();
        assertThat(chatNotificationList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkCreationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = chatNotificationRepository.findAll().size();
        // set the field null
        chatNotification.setCreationDate(null);

        // Create the ChatNotification, which fails.
        ChatNotificationDTO chatNotificationDTO = chatNotificationMapper.toDto(chatNotification);

        restChatNotificationMockMvc.perform(post("/api/chat-notifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chatNotificationDTO)))
            .andExpect(status().isBadRequest());

        List<ChatNotification> chatNotificationList = chatNotificationRepository.findAll();
        assertThat(chatNotificationList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllChatNotifications() throws Exception {
        // Initialize the database
        chatNotificationRepository.saveAndFlush(chatNotification);

        // Get all the chatNotificationList
        restChatNotificationMockMvc.perform(get("/api/chat-notifications?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chatNotification.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getChatNotification() throws Exception {
        // Initialize the database
        chatNotificationRepository.saveAndFlush(chatNotification);

        // Get the chatNotification
        restChatNotificationMockMvc.perform(get("/api/chat-notifications/{id}", chatNotification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(chatNotification.getId().intValue()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    public void getAllChatNotificationsByCreationDateIsEqualToSomething() throws Exception {
        // Initialize the database
        chatNotificationRepository.saveAndFlush(chatNotification);

        // Get all the chatNotificationList where creationDate equals to DEFAULT_CREATION_DATE
        defaultChatNotificationShouldBeFound("creationDate.equals=" + DEFAULT_CREATION_DATE);

        // Get all the chatNotificationList where creationDate equals to UPDATED_CREATION_DATE
        defaultChatNotificationShouldNotBeFound("creationDate.equals=" + UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void getAllChatNotificationsByCreationDateIsInShouldWork() throws Exception {
        // Initialize the database
        chatNotificationRepository.saveAndFlush(chatNotification);

        // Get all the chatNotificationList where creationDate in DEFAULT_CREATION_DATE or UPDATED_CREATION_DATE
        defaultChatNotificationShouldBeFound("creationDate.in=" + DEFAULT_CREATION_DATE + "," + UPDATED_CREATION_DATE);

        // Get all the chatNotificationList where creationDate equals to UPDATED_CREATION_DATE
        defaultChatNotificationShouldNotBeFound("creationDate.in=" + UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void getAllChatNotificationsByCreationDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        chatNotificationRepository.saveAndFlush(chatNotification);

        // Get all the chatNotificationList where creationDate is not null
        defaultChatNotificationShouldBeFound("creationDate.specified=true");

        // Get all the chatNotificationList where creationDate is null
        defaultChatNotificationShouldNotBeFound("creationDate.specified=false");
    }

    @Test
    @Transactional
    public void getAllChatNotificationsByUserIsEqualToSomething() throws Exception {
        // Initialize the database
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        chatNotification.setUser(user);
        chatNotificationRepository.saveAndFlush(chatNotification);
        Long userId = user.getId();

        // Get all the chatNotificationList where user equals to userId
        defaultChatNotificationShouldBeFound("userId.equals=" + userId);

        // Get all the chatNotificationList where user equals to userId + 1
        defaultChatNotificationShouldNotBeFound("userId.equals=" + (userId + 1));
    }


    @Test
    @Transactional
    public void getAllChatNotificationsByChatMessageIsEqualToSomething() throws Exception {
        // Initialize the database
        ChatMessage chatMessage = ChatMessageResourceIT.createEntity(em);
        em.persist(chatMessage);
        em.flush();
        chatNotification.setChatMessage(chatMessage);
        chatNotificationRepository.saveAndFlush(chatNotification);
        Long chatMessageId = chatMessage.getId();

        // Get all the chatNotificationList where chatMessage equals to chatMessageId
        defaultChatNotificationShouldBeFound("chatMessageId.equals=" + chatMessageId);

        // Get all the chatNotificationList where chatMessage equals to chatMessageId + 1
        defaultChatNotificationShouldNotBeFound("chatMessageId.equals=" + (chatMessageId + 1));
    }


    @Test
    @Transactional
    public void getAllChatNotificationsByChatRoomIsEqualToSomething() throws Exception {
        // Initialize the database
        ChatRoom chatRoom = ChatRoomResourceIT.createEntity(em);
        em.persist(chatRoom);
        em.flush();
        chatNotification.setChatRoom(chatRoom);
        chatNotificationRepository.saveAndFlush(chatNotification);
        Long chatRoomId = chatRoom.getId();

        // Get all the chatNotificationList where chatRoom equals to chatRoomId
        defaultChatNotificationShouldBeFound("chatRoomId.equals=" + chatRoomId);

        // Get all the chatNotificationList where chatRoom equals to chatRoomId + 1
        defaultChatNotificationShouldNotBeFound("chatRoomId.equals=" + (chatRoomId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultChatNotificationShouldBeFound(String filter) throws Exception {
        restChatNotificationMockMvc.perform(get("/api/chat-notifications?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(chatNotification.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));

        // Check, that the count call also returns 1
        restChatNotificationMockMvc.perform(get("/api/chat-notifications/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultChatNotificationShouldNotBeFound(String filter) throws Exception {
        restChatNotificationMockMvc.perform(get("/api/chat-notifications?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restChatNotificationMockMvc.perform(get("/api/chat-notifications/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingChatNotification() throws Exception {
        // Get the chatNotification
        restChatNotificationMockMvc.perform(get("/api/chat-notifications/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateChatNotification() throws Exception {
        // Initialize the database
        chatNotificationRepository.saveAndFlush(chatNotification);

        int databaseSizeBeforeUpdate = chatNotificationRepository.findAll().size();

        // Update the chatNotification
        ChatNotification updatedChatNotification = chatNotificationRepository.findById(chatNotification.getId()).get();
        // Disconnect from session so that the updates on updatedChatNotification are not directly saved in db
        em.detach(updatedChatNotification);
        updatedChatNotification
            .creationDate(UPDATED_CREATION_DATE);
        ChatNotificationDTO chatNotificationDTO = chatNotificationMapper.toDto(updatedChatNotification);

        restChatNotificationMockMvc.perform(put("/api/chat-notifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chatNotificationDTO)))
            .andExpect(status().isOk());

        // Validate the ChatNotification in the database
        List<ChatNotification> chatNotificationList = chatNotificationRepository.findAll();
        assertThat(chatNotificationList).hasSize(databaseSizeBeforeUpdate);
        ChatNotification testChatNotification = chatNotificationList.get(chatNotificationList.size() - 1);
        assertThat(testChatNotification.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingChatNotification() throws Exception {
        int databaseSizeBeforeUpdate = chatNotificationRepository.findAll().size();

        // Create the ChatNotification
        ChatNotificationDTO chatNotificationDTO = chatNotificationMapper.toDto(chatNotification);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restChatNotificationMockMvc.perform(put("/api/chat-notifications")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(chatNotificationDTO)))
            .andExpect(status().isBadRequest());

        // Validate the ChatNotification in the database
        List<ChatNotification> chatNotificationList = chatNotificationRepository.findAll();
        assertThat(chatNotificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteChatNotification() throws Exception {
        // Initialize the database
        chatNotificationRepository.saveAndFlush(chatNotification);

        int databaseSizeBeforeDelete = chatNotificationRepository.findAll().size();

        // Delete the chatNotification
        restChatNotificationMockMvc.perform(delete("/api/chat-notifications/{id}", chatNotification.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<ChatNotification> chatNotificationList = chatNotificationRepository.findAll();
        assertThat(chatNotificationList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChatNotification.class);
        ChatNotification chatNotification1 = new ChatNotification();
        chatNotification1.setId(1L);
        ChatNotification chatNotification2 = new ChatNotification();
        chatNotification2.setId(chatNotification1.getId());
        assertThat(chatNotification1).isEqualTo(chatNotification2);
        chatNotification2.setId(2L);
        assertThat(chatNotification1).isNotEqualTo(chatNotification2);
        chatNotification1.setId(null);
        assertThat(chatNotification1).isNotEqualTo(chatNotification2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(ChatNotificationDTO.class);
        ChatNotificationDTO chatNotificationDTO1 = new ChatNotificationDTO();
        chatNotificationDTO1.setId(1L);
        ChatNotificationDTO chatNotificationDTO2 = new ChatNotificationDTO();
        assertThat(chatNotificationDTO1).isNotEqualTo(chatNotificationDTO2);
        chatNotificationDTO2.setId(chatNotificationDTO1.getId());
        assertThat(chatNotificationDTO1).isEqualTo(chatNotificationDTO2);
        chatNotificationDTO2.setId(2L);
        assertThat(chatNotificationDTO1).isNotEqualTo(chatNotificationDTO2);
        chatNotificationDTO1.setId(null);
        assertThat(chatNotificationDTO1).isNotEqualTo(chatNotificationDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(chatNotificationMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(chatNotificationMapper.fromId(null)).isNull();
    }
}
