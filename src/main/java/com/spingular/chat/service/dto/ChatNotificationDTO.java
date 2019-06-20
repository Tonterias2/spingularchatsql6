package com.spingular.chat.service.dto;
import java.time.Instant;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.spingular.chat.domain.ChatNotification} entity.
 */
public class ChatNotificationDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant creationDate;


    private Long chatUserId;

    private Long chatMessageId;

    private Long chatRoomId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Long getChatUserId() {
        return chatUserId;
    }

    public void setChatUserId(Long chatUserId) {
        this.chatUserId = chatUserId;
    }

    public Long getChatMessageId() {
        return chatMessageId;
    }

    public void setChatMessageId(Long chatMessageId) {
        this.chatMessageId = chatMessageId;
    }

    public Long getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(Long chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        ChatNotificationDTO chatNotificationDTO = (ChatNotificationDTO) o;
        if (chatNotificationDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), chatNotificationDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "ChatNotificationDTO{" +
            "id=" + getId() +
            ", creationDate='" + getCreationDate() + "'" +
            ", chatUser=" + getChatUserId() +
            ", chatMessage=" + getChatMessageId() +
            ", chatRoom=" + getChatRoomId() +
            "}";
    }
}
