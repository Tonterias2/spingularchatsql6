package com.spingular.chat.web.rest;

import com.spingular.chat.Spingularchatsql6App;
import com.spingular.chat.domain.OffensiveMessage;
import com.spingular.chat.domain.ChatUser;
import com.spingular.chat.domain.ChatMessage;
import com.spingular.chat.repository.OffensiveMessageRepository;
import com.spingular.chat.service.OffensiveMessageService;
import com.spingular.chat.service.dto.OffensiveMessageDTO;
import com.spingular.chat.service.mapper.OffensiveMessageMapper;
import com.spingular.chat.web.rest.errors.ExceptionTranslator;
import com.spingular.chat.service.dto.OffensiveMessageCriteria;
import com.spingular.chat.service.OffensiveMessageQueryService;

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
 * Integration tests for the {@Link OffensiveMessageResource} REST controller.
 */
@SpringBootTest(classes = Spingularchatsql6App.class)
public class OffensiveMessageResourceIT {

    private static final Instant DEFAULT_CREATION_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Boolean DEFAULT_IS_OFFENSIVE = false;
    private static final Boolean UPDATED_IS_OFFENSIVE = true;

    @Autowired
    private OffensiveMessageRepository offensiveMessageRepository;

    @Autowired
    private OffensiveMessageMapper offensiveMessageMapper;

    @Autowired
    private OffensiveMessageService offensiveMessageService;

    @Autowired
    private OffensiveMessageQueryService offensiveMessageQueryService;

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

    private MockMvc restOffensiveMessageMockMvc;

    private OffensiveMessage offensiveMessage;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final OffensiveMessageResource offensiveMessageResource = new OffensiveMessageResource(offensiveMessageService, offensiveMessageQueryService);
        this.restOffensiveMessageMockMvc = MockMvcBuilders.standaloneSetup(offensiveMessageResource)
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
    public static OffensiveMessage createEntity(EntityManager em) {
        OffensiveMessage offensiveMessage = new OffensiveMessage()
            .creationDate(DEFAULT_CREATION_DATE)
            .isOffensive(DEFAULT_IS_OFFENSIVE);
        return offensiveMessage;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static OffensiveMessage createUpdatedEntity(EntityManager em) {
        OffensiveMessage offensiveMessage = new OffensiveMessage()
            .creationDate(UPDATED_CREATION_DATE)
            .isOffensive(UPDATED_IS_OFFENSIVE);
        return offensiveMessage;
    }

    @BeforeEach
    public void initTest() {
        offensiveMessage = createEntity(em);
    }

    @Test
    @Transactional
    public void createOffensiveMessage() throws Exception {
        int databaseSizeBeforeCreate = offensiveMessageRepository.findAll().size();

        // Create the OffensiveMessage
        OffensiveMessageDTO offensiveMessageDTO = offensiveMessageMapper.toDto(offensiveMessage);
        restOffensiveMessageMockMvc.perform(post("/api/offensive-messages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offensiveMessageDTO)))
            .andExpect(status().isCreated());

        // Validate the OffensiveMessage in the database
        List<OffensiveMessage> offensiveMessageList = offensiveMessageRepository.findAll();
        assertThat(offensiveMessageList).hasSize(databaseSizeBeforeCreate + 1);
        OffensiveMessage testOffensiveMessage = offensiveMessageList.get(offensiveMessageList.size() - 1);
        assertThat(testOffensiveMessage.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
        assertThat(testOffensiveMessage.isIsOffensive()).isEqualTo(DEFAULT_IS_OFFENSIVE);
    }

    @Test
    @Transactional
    public void createOffensiveMessageWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = offensiveMessageRepository.findAll().size();

        // Create the OffensiveMessage with an existing ID
        offensiveMessage.setId(1L);
        OffensiveMessageDTO offensiveMessageDTO = offensiveMessageMapper.toDto(offensiveMessage);

        // An entity with an existing ID cannot be created, so this API call must fail
        restOffensiveMessageMockMvc.perform(post("/api/offensive-messages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offensiveMessageDTO)))
            .andExpect(status().isBadRequest());

        // Validate the OffensiveMessage in the database
        List<OffensiveMessage> offensiveMessageList = offensiveMessageRepository.findAll();
        assertThat(offensiveMessageList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void checkCreationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = offensiveMessageRepository.findAll().size();
        // set the field null
        offensiveMessage.setCreationDate(null);

        // Create the OffensiveMessage, which fails.
        OffensiveMessageDTO offensiveMessageDTO = offensiveMessageMapper.toDto(offensiveMessage);

        restOffensiveMessageMockMvc.perform(post("/api/offensive-messages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offensiveMessageDTO)))
            .andExpect(status().isBadRequest());

        List<OffensiveMessage> offensiveMessageList = offensiveMessageRepository.findAll();
        assertThat(offensiveMessageList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllOffensiveMessages() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        // Get all the offensiveMessageList
        restOffensiveMessageMockMvc.perform(get("/api/offensive-messages?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offensiveMessage.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].isOffensive").value(hasItem(DEFAULT_IS_OFFENSIVE.booleanValue())));
    }
    
    @Test
    @Transactional
    public void getOffensiveMessage() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        // Get the offensiveMessage
        restOffensiveMessageMockMvc.perform(get("/api/offensive-messages/{id}", offensiveMessage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(offensiveMessage.getId().intValue()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()))
            .andExpect(jsonPath("$.isOffensive").value(DEFAULT_IS_OFFENSIVE.booleanValue()));
    }

    @Test
    @Transactional
    public void getAllOffensiveMessagesByCreationDateIsEqualToSomething() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        // Get all the offensiveMessageList where creationDate equals to DEFAULT_CREATION_DATE
        defaultOffensiveMessageShouldBeFound("creationDate.equals=" + DEFAULT_CREATION_DATE);

        // Get all the offensiveMessageList where creationDate equals to UPDATED_CREATION_DATE
        defaultOffensiveMessageShouldNotBeFound("creationDate.equals=" + UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void getAllOffensiveMessagesByCreationDateIsInShouldWork() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        // Get all the offensiveMessageList where creationDate in DEFAULT_CREATION_DATE or UPDATED_CREATION_DATE
        defaultOffensiveMessageShouldBeFound("creationDate.in=" + DEFAULT_CREATION_DATE + "," + UPDATED_CREATION_DATE);

        // Get all the offensiveMessageList where creationDate equals to UPDATED_CREATION_DATE
        defaultOffensiveMessageShouldNotBeFound("creationDate.in=" + UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void getAllOffensiveMessagesByCreationDateIsNullOrNotNull() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        // Get all the offensiveMessageList where creationDate is not null
        defaultOffensiveMessageShouldBeFound("creationDate.specified=true");

        // Get all the offensiveMessageList where creationDate is null
        defaultOffensiveMessageShouldNotBeFound("creationDate.specified=false");
    }

    @Test
    @Transactional
    public void getAllOffensiveMessagesByIsOffensiveIsEqualToSomething() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        // Get all the offensiveMessageList where isOffensive equals to DEFAULT_IS_OFFENSIVE
        defaultOffensiveMessageShouldBeFound("isOffensive.equals=" + DEFAULT_IS_OFFENSIVE);

        // Get all the offensiveMessageList where isOffensive equals to UPDATED_IS_OFFENSIVE
        defaultOffensiveMessageShouldNotBeFound("isOffensive.equals=" + UPDATED_IS_OFFENSIVE);
    }

    @Test
    @Transactional
    public void getAllOffensiveMessagesByIsOffensiveIsInShouldWork() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        // Get all the offensiveMessageList where isOffensive in DEFAULT_IS_OFFENSIVE or UPDATED_IS_OFFENSIVE
        defaultOffensiveMessageShouldBeFound("isOffensive.in=" + DEFAULT_IS_OFFENSIVE + "," + UPDATED_IS_OFFENSIVE);

        // Get all the offensiveMessageList where isOffensive equals to UPDATED_IS_OFFENSIVE
        defaultOffensiveMessageShouldNotBeFound("isOffensive.in=" + UPDATED_IS_OFFENSIVE);
    }

    @Test
    @Transactional
    public void getAllOffensiveMessagesByIsOffensiveIsNullOrNotNull() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        // Get all the offensiveMessageList where isOffensive is not null
        defaultOffensiveMessageShouldBeFound("isOffensive.specified=true");

        // Get all the offensiveMessageList where isOffensive is null
        defaultOffensiveMessageShouldNotBeFound("isOffensive.specified=false");
    }

    @Test
    @Transactional
    public void getAllOffensiveMessagesByChatUserIsEqualToSomething() throws Exception {
        // Initialize the database
        ChatUser chatUser = ChatUserResourceIT.createEntity(em);
        em.persist(chatUser);
        em.flush();
        offensiveMessage.setChatUser(chatUser);
        offensiveMessageRepository.saveAndFlush(offensiveMessage);
        Long chatUserId = chatUser.getId();

        // Get all the offensiveMessageList where chatUser equals to chatUserId
        defaultOffensiveMessageShouldBeFound("chatUserId.equals=" + chatUserId);

        // Get all the offensiveMessageList where chatUser equals to chatUserId + 1
        defaultOffensiveMessageShouldNotBeFound("chatUserId.equals=" + (chatUserId + 1));
    }


    @Test
    @Transactional
    public void getAllOffensiveMessagesByChatMessageIsEqualToSomething() throws Exception {
        // Initialize the database
        ChatMessage chatMessage = ChatMessageResourceIT.createEntity(em);
        em.persist(chatMessage);
        em.flush();
        offensiveMessage.setChatMessage(chatMessage);
        offensiveMessageRepository.saveAndFlush(offensiveMessage);
        Long chatMessageId = chatMessage.getId();

        // Get all the offensiveMessageList where chatMessage equals to chatMessageId
        defaultOffensiveMessageShouldBeFound("chatMessageId.equals=" + chatMessageId);

        // Get all the offensiveMessageList where chatMessage equals to chatMessageId + 1
        defaultOffensiveMessageShouldNotBeFound("chatMessageId.equals=" + (chatMessageId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultOffensiveMessageShouldBeFound(String filter) throws Exception {
        restOffensiveMessageMockMvc.perform(get("/api/offensive-messages?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(offensiveMessage.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())))
            .andExpect(jsonPath("$.[*].isOffensive").value(hasItem(DEFAULT_IS_OFFENSIVE.booleanValue())));

        // Check, that the count call also returns 1
        restOffensiveMessageMockMvc.perform(get("/api/offensive-messages/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultOffensiveMessageShouldNotBeFound(String filter) throws Exception {
        restOffensiveMessageMockMvc.perform(get("/api/offensive-messages?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restOffensiveMessageMockMvc.perform(get("/api/offensive-messages/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(content().string("0"));
    }


    @Test
    @Transactional
    public void getNonExistingOffensiveMessage() throws Exception {
        // Get the offensiveMessage
        restOffensiveMessageMockMvc.perform(get("/api/offensive-messages/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateOffensiveMessage() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        int databaseSizeBeforeUpdate = offensiveMessageRepository.findAll().size();

        // Update the offensiveMessage
        OffensiveMessage updatedOffensiveMessage = offensiveMessageRepository.findById(offensiveMessage.getId()).get();
        // Disconnect from session so that the updates on updatedOffensiveMessage are not directly saved in db
        em.detach(updatedOffensiveMessage);
        updatedOffensiveMessage
            .creationDate(UPDATED_CREATION_DATE)
            .isOffensive(UPDATED_IS_OFFENSIVE);
        OffensiveMessageDTO offensiveMessageDTO = offensiveMessageMapper.toDto(updatedOffensiveMessage);

        restOffensiveMessageMockMvc.perform(put("/api/offensive-messages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offensiveMessageDTO)))
            .andExpect(status().isOk());

        // Validate the OffensiveMessage in the database
        List<OffensiveMessage> offensiveMessageList = offensiveMessageRepository.findAll();
        assertThat(offensiveMessageList).hasSize(databaseSizeBeforeUpdate);
        OffensiveMessage testOffensiveMessage = offensiveMessageList.get(offensiveMessageList.size() - 1);
        assertThat(testOffensiveMessage.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
        assertThat(testOffensiveMessage.isIsOffensive()).isEqualTo(UPDATED_IS_OFFENSIVE);
    }

    @Test
    @Transactional
    public void updateNonExistingOffensiveMessage() throws Exception {
        int databaseSizeBeforeUpdate = offensiveMessageRepository.findAll().size();

        // Create the OffensiveMessage
        OffensiveMessageDTO offensiveMessageDTO = offensiveMessageMapper.toDto(offensiveMessage);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOffensiveMessageMockMvc.perform(put("/api/offensive-messages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(offensiveMessageDTO)))
            .andExpect(status().isBadRequest());

        // Validate the OffensiveMessage in the database
        List<OffensiveMessage> offensiveMessageList = offensiveMessageRepository.findAll();
        assertThat(offensiveMessageList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteOffensiveMessage() throws Exception {
        // Initialize the database
        offensiveMessageRepository.saveAndFlush(offensiveMessage);

        int databaseSizeBeforeDelete = offensiveMessageRepository.findAll().size();

        // Delete the offensiveMessage
        restOffensiveMessageMockMvc.perform(delete("/api/offensive-messages/{id}", offensiveMessage.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database is empty
        List<OffensiveMessage> offensiveMessageList = offensiveMessageRepository.findAll();
        assertThat(offensiveMessageList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(OffensiveMessage.class);
        OffensiveMessage offensiveMessage1 = new OffensiveMessage();
        offensiveMessage1.setId(1L);
        OffensiveMessage offensiveMessage2 = new OffensiveMessage();
        offensiveMessage2.setId(offensiveMessage1.getId());
        assertThat(offensiveMessage1).isEqualTo(offensiveMessage2);
        offensiveMessage2.setId(2L);
        assertThat(offensiveMessage1).isNotEqualTo(offensiveMessage2);
        offensiveMessage1.setId(null);
        assertThat(offensiveMessage1).isNotEqualTo(offensiveMessage2);
    }

    @Test
    @Transactional
    public void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(OffensiveMessageDTO.class);
        OffensiveMessageDTO offensiveMessageDTO1 = new OffensiveMessageDTO();
        offensiveMessageDTO1.setId(1L);
        OffensiveMessageDTO offensiveMessageDTO2 = new OffensiveMessageDTO();
        assertThat(offensiveMessageDTO1).isNotEqualTo(offensiveMessageDTO2);
        offensiveMessageDTO2.setId(offensiveMessageDTO1.getId());
        assertThat(offensiveMessageDTO1).isEqualTo(offensiveMessageDTO2);
        offensiveMessageDTO2.setId(2L);
        assertThat(offensiveMessageDTO1).isNotEqualTo(offensiveMessageDTO2);
        offensiveMessageDTO1.setId(null);
        assertThat(offensiveMessageDTO1).isNotEqualTo(offensiveMessageDTO2);
    }

    @Test
    @Transactional
    public void testEntityFromId() {
        assertThat(offensiveMessageMapper.fromId(42L).getId()).isEqualTo(42);
        assertThat(offensiveMessageMapper.fromId(null)).isNull();
    }
}
