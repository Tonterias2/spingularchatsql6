package com.spingular.chat.web.websocket.dto;

import java.util.StringJoiner;

/**
 * DTO for storing a user's message.
 */
public class MessageDTO {

    private String userLogin;
    
    private Long chatRoomId;
    
    private Long chatUserId;

	private String message;

    private String time;

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    public Long getChatRoomId() {
		return chatRoomId;
	}

	public void setChatRoomId(Long chatRoomId) {
		this.chatRoomId = chatRoomId;
	}
	
    public Long getChatUserId() {
		return chatUserId;
	}

	public void setChatUserId(Long chatUserId) {
		this.chatUserId = chatUserId;
	}

	public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return new StringJoiner(", ", MessageDTO.class.getSimpleName() + "[", "]")
                .add("userLogin='" + userLogin + "'")
                .add("chatUserId='" + chatUserId + "'")
                .add("chatRoomId='" + chatRoomId + "'")
                .add("message='" + message + "'")
                .add("time='" + time + "'")
                .toString();
    }
}

