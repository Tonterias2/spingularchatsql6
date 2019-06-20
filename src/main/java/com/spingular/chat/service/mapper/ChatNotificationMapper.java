package com.spingular.chat.service.mapper;

import com.spingular.chat.domain.*;
import com.spingular.chat.service.dto.ChatNotificationDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link ChatNotification} and its DTO {@link ChatNotificationDTO}.
 */
@Mapper(componentModel = "spring", uses = {ChatUserMapper.class, ChatMessageMapper.class, ChatRoomMapper.class})
public interface ChatNotificationMapper extends EntityMapper<ChatNotificationDTO, ChatNotification> {

    @Mapping(source = "chatUser.id", target = "chatUserId")
    @Mapping(source = "chatMessage.id", target = "chatMessageId")
    @Mapping(source = "chatRoom.id", target = "chatRoomId")
    ChatNotificationDTO toDto(ChatNotification chatNotification);

    @Mapping(source = "chatUserId", target = "chatUser")
    @Mapping(source = "chatMessageId", target = "chatMessage")
    @Mapping(source = "chatRoomId", target = "chatRoom")
    ChatNotification toEntity(ChatNotificationDTO chatNotificationDTO);

    default ChatNotification fromId(Long id) {
        if (id == null) {
            return null;
        }
        ChatNotification chatNotification = new ChatNotification();
        chatNotification.setId(id);
        return chatNotification;
    }
}
