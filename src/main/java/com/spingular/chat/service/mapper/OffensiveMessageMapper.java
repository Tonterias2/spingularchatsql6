package com.spingular.chat.service.mapper;

import com.spingular.chat.domain.*;
import com.spingular.chat.service.dto.OffensiveMessageDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link OffensiveMessage} and its DTO {@link OffensiveMessageDTO}.
 */
@Mapper(componentModel = "spring", uses = {ChatUserMapper.class, ChatMessageMapper.class})
public interface OffensiveMessageMapper extends EntityMapper<OffensiveMessageDTO, OffensiveMessage> {

    @Mapping(source = "chatUser.id", target = "chatUserId")
    @Mapping(source = "chatMessage.id", target = "chatMessageId")
    OffensiveMessageDTO toDto(OffensiveMessage offensiveMessage);

    @Mapping(source = "chatUserId", target = "chatUser")
    @Mapping(source = "chatMessageId", target = "chatMessage")
    OffensiveMessage toEntity(OffensiveMessageDTO offensiveMessageDTO);

    default OffensiveMessage fromId(Long id) {
        if (id == null) {
            return null;
        }
        OffensiveMessage offensiveMessage = new OffensiveMessage();
        offensiveMessage.setId(id);
        return offensiveMessage;
    }
}
