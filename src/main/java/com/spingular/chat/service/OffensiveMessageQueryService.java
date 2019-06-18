package com.spingular.chat.service;

import java.util.List;

import javax.persistence.criteria.JoinType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.github.jhipster.service.QueryService;

import com.spingular.chat.domain.OffensiveMessage;
import com.spingular.chat.domain.*; // for static metamodels
import com.spingular.chat.repository.OffensiveMessageRepository;
import com.spingular.chat.service.dto.OffensiveMessageCriteria;
import com.spingular.chat.service.dto.OffensiveMessageDTO;
import com.spingular.chat.service.mapper.OffensiveMessageMapper;

/**
 * Service for executing complex queries for {@link OffensiveMessage} entities in the database.
 * The main input is a {@link OffensiveMessageCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link OffensiveMessageDTO} or a {@link Page} of {@link OffensiveMessageDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class OffensiveMessageQueryService extends QueryService<OffensiveMessage> {

    private final Logger log = LoggerFactory.getLogger(OffensiveMessageQueryService.class);

    private final OffensiveMessageRepository offensiveMessageRepository;

    private final OffensiveMessageMapper offensiveMessageMapper;

    public OffensiveMessageQueryService(OffensiveMessageRepository offensiveMessageRepository, OffensiveMessageMapper offensiveMessageMapper) {
        this.offensiveMessageRepository = offensiveMessageRepository;
        this.offensiveMessageMapper = offensiveMessageMapper;
    }

    /**
     * Return a {@link List} of {@link OffensiveMessageDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<OffensiveMessageDTO> findByCriteria(OffensiveMessageCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<OffensiveMessage> specification = createSpecification(criteria);
        return offensiveMessageMapper.toDto(offensiveMessageRepository.findAll(specification));
    }

    /**
     * Return a {@link Page} of {@link OffensiveMessageDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<OffensiveMessageDTO> findByCriteria(OffensiveMessageCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<OffensiveMessage> specification = createSpecification(criteria);
        return offensiveMessageRepository.findAll(specification, page)
            .map(offensiveMessageMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(OffensiveMessageCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<OffensiveMessage> specification = createSpecification(criteria);
        return offensiveMessageRepository.count(specification);
    }

    /**
     * Function to convert OffensiveMessageCriteria to a {@link Specification}.
     */
    private Specification<OffensiveMessage> createSpecification(OffensiveMessageCriteria criteria) {
        Specification<OffensiveMessage> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildSpecification(criteria.getId(), OffensiveMessage_.id));
            }
            if (criteria.getCreationDate() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getCreationDate(), OffensiveMessage_.creationDate));
            }
            if (criteria.getIsOffensive() != null) {
                specification = specification.and(buildSpecification(criteria.getIsOffensive(), OffensiveMessage_.isOffensive));
            }
            if (criteria.getChatUserId() != null) {
                specification = specification.and(buildSpecification(criteria.getChatUserId(),
                    root -> root.join(OffensiveMessage_.chatUser, JoinType.LEFT).get(ChatUser_.id)));
            }
            if (criteria.getChatMessageId() != null) {
                specification = specification.and(buildSpecification(criteria.getChatMessageId(),
                    root -> root.join(OffensiveMessage_.chatMessage, JoinType.LEFT).get(ChatMessage_.id)));
            }
        }
        return specification;
    }
}
