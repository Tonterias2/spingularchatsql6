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
 * Criteria class for the {@link com.spingular.chat.domain.ChatUser} entity. This class is used
 * in {@link com.spingular.chat.web.rest.ChatUserResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /chat-users?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
public class ChatUserCriteria implements Serializable, Criteria {

    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private InstantFilter creationDate;

    private BooleanFilter bannedUser;

    private LongFilter userId;

    private LongFilter chatRoomId;

    private LongFilter chatMessageId;

    private LongFilter chatRoomAllowedUserId;

    private LongFilter offensiveMessageId;

    public ChatUserCriteria(){
    }

    public ChatUserCriteria(ChatUserCriteria other){
        this.id = other.id == null ? null : other.id.copy();
        this.creationDate = other.creationDate == null ? null : other.creationDate.copy();
        this.bannedUser = other.bannedUser == null ? null : other.bannedUser.copy();
        this.userId = other.userId == null ? null : other.userId.copy();
        this.chatRoomId = other.chatRoomId == null ? null : other.chatRoomId.copy();
        this.chatMessageId = other.chatMessageId == null ? null : other.chatMessageId.copy();
        this.chatRoomAllowedUserId = other.chatRoomAllowedUserId == null ? null : other.chatRoomAllowedUserId.copy();
        this.offensiveMessageId = other.offensiveMessageId == null ? null : other.offensiveMessageId.copy();
    }

    @Override
    public ChatUserCriteria copy() {
        return new ChatUserCriteria(this);
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

    public BooleanFilter getBannedUser() {
        return bannedUser;
    }

    public void setBannedUser(BooleanFilter bannedUser) {
        this.bannedUser = bannedUser;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    public LongFilter getChatRoomId() {
        return chatRoomId;
    }

    public void setChatRoomId(LongFilter chatRoomId) {
        this.chatRoomId = chatRoomId;
    }

    public LongFilter getChatMessageId() {
        return chatMessageId;
    }

    public void setChatMessageId(LongFilter chatMessageId) {
        this.chatMessageId = chatMessageId;
    }

    public LongFilter getChatRoomAllowedUserId() {
        return chatRoomAllowedUserId;
    }

    public void setChatRoomAllowedUserId(LongFilter chatRoomAllowedUserId) {
        this.chatRoomAllowedUserId = chatRoomAllowedUserId;
    }

    public LongFilter getOffensiveMessageId() {
        return offensiveMessageId;
    }

    public void setOffensiveMessageId(LongFilter offensiveMessageId) {
        this.offensiveMessageId = offensiveMessageId;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final ChatUserCriteria that = (ChatUserCriteria) o;
        return
            Objects.equals(id, that.id) &&
            Objects.equals(creationDate, that.creationDate) &&
            Objects.equals(bannedUser, that.bannedUser) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(chatRoomId, that.chatRoomId) &&
            Objects.equals(chatMessageId, that.chatMessageId) &&
            Objects.equals(chatRoomAllowedUserId, that.chatRoomAllowedUserId) &&
            Objects.equals(offensiveMessageId, that.offensiveMessageId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(
        id,
        creationDate,
        bannedUser,
        userId,
        chatRoomId,
        chatMessageId,
        chatRoomAllowedUserId,
        offensiveMessageId
        );
    }

    @Override
    public String toString() {
        return "ChatUserCriteria{" +
                (id != null ? "id=" + id + ", " : "") +
                (creationDate != null ? "creationDate=" + creationDate + ", " : "") +
                (bannedUser != null ? "bannedUser=" + bannedUser + ", " : "") +
                (userId != null ? "userId=" + userId + ", " : "") +
                (chatRoomId != null ? "chatRoomId=" + chatRoomId + ", " : "") +
                (chatMessageId != null ? "chatMessageId=" + chatMessageId + ", " : "") +
                (chatRoomAllowedUserId != null ? "chatRoomAllowedUserId=" + chatRoomAllowedUserId + ", " : "") +
                (offensiveMessageId != null ? "offensiveMessageId=" + offensiveMessageId + ", " : "") +
            "}";
    }

}
