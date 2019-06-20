package com.spingular.chat.service.dto;

import java.io.Serializable;
import java.util.Objects;
import io.github.jhipster.service.Criteria;
import io.github.jhipster.service.filter.BooleanFilter;
import io.github.jhipster.service.filter.DoubleFilter;
import io.github.jhipster.service.filter.Filter;
import io.github.jhipster.service.filter.FloatFilter;
import io.github.jhipster.service.filter.IntegerFilter;
import io.github.jhipster.service.filter.LongFilter;
import io.github.jhipster.service.filter.StringFilter;
import io.github.jhipster.service.filter.InstantFilter;

/**
 * Criteria class for the {@link com.spingular.chat.domain.ChatNotification} entity. This class is used
 * in {@link com.spingular.chat.web.rest.ChatNotificationResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /chat-notifications?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ChatNotificationCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private InstantFilter creationDate;

    private LongFilter chatUserId;

    private LongFilter chatMessageId;

    private LongFilter chatRoomId;

    public ChatNotificationCriteria(){
    }

    public ChatNotificationCriteria(ChatNotificationCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.creationDate = other.creationDate == null ? null : other.creationDate.copy();
        this.chatUserId = other.chatUserId == null ? null : other.chatUserId.copy();
        this.chatMessageId = other.chatMessageId == null ? null : other.chatMessageId.copy();
        this.chatRoomId = other.chatRoomId == null ? null : other.chatRoomId.copy();
    }

    @Override
    public ChatNotificationCriteria copy() {
        return new ChatNotificationCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public InstantFilter getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(InstantFilter creationDate) {
        this.creationDate = creationDate;
    }

    public LongFilter getChatUserId() {
        return chatUserId;
    }

    public void setChatUserId(LongFilter chatUserId) {
        this.chatUserId = chatUserId;
    }

    public LongFilter getChatMessageId() {
        return chatMessageId;
    }

    public void setChatMessageId(LongFilter chatMessageId) {
        this.chatMessageId = chatMessageId;
    }

    public LongFilter getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(LongFilter chatRoomId) {
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
        final ChatNotificationCriteria that = (ChatNotificationCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(creationDate, that.creationDate) &&
            Objects.equals(chatUserId, that.chatUserId) &&
            Objects.equals(chatMessageId, that.chatMessageId) &&
            Objects.equals(chatRoomId, that.chatRoomId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        creationDate,
        chatUserId,
        chatMessageId,
        chatRoomId
        );
    }

    @Override
    public String toString() {
        return "ChatNotificationCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (creationDate != null ? "creationDate=" + creationDate + ", " : "") +
                (chatUserId != null ? "chatUserId=" + chatUserId + ", " : "") +
                (chatMessageId != null ? "chatMessageId=" + chatMessageId + ", " : "") +
                (chatRoomId != null ? "chatRoomId=" + chatRoomId + ", " : "") +
            "}";
    }

}
