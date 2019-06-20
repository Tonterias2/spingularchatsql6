package com.spingular.chat.repository;

import com.spingular.chat.domain.OffensiveMessage;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the OffensiveMessage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OffensiveMessageRepository extends JpaRepository<OffensiveMessage, Long>, JpaSpecificationExecutor<OffensiveMessage> {

}
