package com.spingular.chat.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;

/**
 * A OffensiveMessage.
 */
@Entity
@Table(name = "offensive_message")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class OffensiveMessage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "creation_date", nullable = false)
    private Instant creationDate;

    @Column(name = "is_offensive")
    private Boolean isOffensive;

    @ManyToOne
    @JsonIgnoreProperties("offensiveMessages")
    private ChatUser chatUser;

    @ManyToOne
    @JsonIgnoreProperties("offensiveMessages")
    private ChatMessage chatMessage;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreationDate() {
        return creationDate;
    }

    public OffensiveMessage creationDate(Instant creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(Instant creationDate) {
        this.creationDate = creationDate;
    }

    public Boolean isIsOffensive() {
        return isOffensive;
    }

    public OffensiveMessage isOffensive(Boolean isOffensive) {
        this.isOffensive = isOffensive;
        return this;
    }

    public void setIsOffensive(Boolean isOffensive) {
        this.isOffensive = isOffensive;
    }

    public ChatUser getChatUser() {
        return chatUser;
    }

    public OffensiveMessage chatUser(ChatUser chatUser) {
        this.chatUser = chatUser;
        return this;
    }

    public void setChatUser(ChatUser chatUser) {
        this.chatUser = chatUser;
    }

    public ChatMessage getChatMessage() {
        return chatMessage;
    }

    public OffensiveMessage chatMessage(ChatMessage chatMessage) {
        this.chatMessage = chatMessage;
        return this;
    }

    public void setChatMessage(ChatMessage chatMessage) {
        this.chatMessage = chatMessage;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OffensiveMessage)) {
            return false;
        }
        return id != null && id.equals(((OffensiveMessage) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "OffensiveMessage{" +
            "id=" + getId() +
            ", creationDate='" + getCreationDate() + "'" +
            ", isOffensive='" + isIsOffensive() + "'" +
            "}";
    }
}
