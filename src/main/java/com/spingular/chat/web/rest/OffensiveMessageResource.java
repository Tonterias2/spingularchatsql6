package com.spingular.chat.web.rest;

import com.spingular.chat.service.OffensiveMessageService;
import com.spingular.chat.web.rest.errors.BadRequestAlertException;
import com.spingular.chat.service.dto.OffensiveMessageDTO;
import com.spingular.chat.service.dto.OffensiveMessageCriteria;
import com.spingular.chat.service.OffensiveMessageQueryService;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.spingular.chat.domain.OffensiveMessage}.
 */
@RestController
@RequestMapping("/api")
public class OffensiveMessageResource {

    private final Logger log = LoggerFactory.getLogger(OffensiveMessageResource.class);

    private static final String ENTITY_NAME = "offensiveMessage";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OffensiveMessageService offensiveMessageService;

    private final OffensiveMessageQueryService offensiveMessageQueryService;

    public OffensiveMessageResource(OffensiveMessageService offensiveMessageService, OffensiveMessageQueryService offensiveMessageQueryService) {
        this.offensiveMessageService = offensiveMessageService;
        this.offensiveMessageQueryService = offensiveMessageQueryService;
    }

    /**
     * {@code POST  /offensive-messages} : Create a new offensiveMessage.
     *
     * @param offensiveMessageDTO the offensiveMessageDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new offensiveMessageDTO, or with status {@code 400 (Bad Request)} if the offensiveMessage has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/offensive-messages")
    public ResponseEntity<OffensiveMessageDTO> createOffensiveMessage(@Valid @RequestBody OffensiveMessageDTO offensiveMessageDTO) throws URISyntaxException {
        log.debug("REST request to save OffensiveMessage : {}", offensiveMessageDTO);
        if (offensiveMessageDTO.getId() != null) {
            throw new BadRequestAlertException("A new offensiveMessage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        OffensiveMessageDTO result = offensiveMessageService.save(offensiveMessageDTO);
        return ResponseEntity.created(new URI("/api/offensive-messages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /offensive-messages} : Updates an existing offensiveMessage.
     *
     * @param offensiveMessageDTO the offensiveMessageDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated offensiveMessageDTO,
     * or with status {@code 400 (Bad Request)} if the offensiveMessageDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the offensiveMessageDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/offensive-messages")
    public ResponseEntity<OffensiveMessageDTO> updateOffensiveMessage(@Valid @RequestBody OffensiveMessageDTO offensiveMessageDTO) throws URISyntaxException {
        log.debug("REST request to update OffensiveMessage : {}", offensiveMessageDTO);
        if (offensiveMessageDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        OffensiveMessageDTO result = offensiveMessageService.save(offensiveMessageDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, offensiveMessageDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /offensive-messages} : get all the offensiveMessages.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of offensiveMessages in body.
     */
    @GetMapping("/offensive-messages")
    public ResponseEntity<List<OffensiveMessageDTO>> getAllOffensiveMessages(OffensiveMessageCriteria criteria) {
        log.debug("REST request to get OffensiveMessages by criteria: {}", criteria);
        List<OffensiveMessageDTO> entityList = offensiveMessageQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(entityList);
    }

    /**
    * {@code GET  /offensive-messages/count} : count all the offensiveMessages.
    *
    * @param criteria the criteria which the requested entities should match.
    * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
    */
    @GetMapping("/offensive-messages/count")
    public ResponseEntity<Long> countOffensiveMessages(OffensiveMessageCriteria criteria) {
        log.debug("REST request to count OffensiveMessages by criteria: {}", criteria);
        return ResponseEntity.ok().body(offensiveMessageQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /offensive-messages/:id} : get the "id" offensiveMessage.
     *
     * @param id the id of the offensiveMessageDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the offensiveMessageDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/offensive-messages/{id}")
    public ResponseEntity<OffensiveMessageDTO> getOffensiveMessage(@PathVariable Long id) {
        log.debug("REST request to get OffensiveMessage : {}", id);
        Optional<OffensiveMessageDTO> offensiveMessageDTO = offensiveMessageService.findOne(id);
        return ResponseUtil.wrapOrNotFound(offensiveMessageDTO);
    }

    /**
     * {@code DELETE  /offensive-messages/:id} : delete the "id" offensiveMessage.
     *
     * @param id the id of the offensiveMessageDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/offensive-messages/{id}")
    public ResponseEntity<Void> deleteOffensiveMessage(@PathVariable Long id) {
        log.debug("REST request to delete OffensiveMessage : {}", id);
        offensiveMessageService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
