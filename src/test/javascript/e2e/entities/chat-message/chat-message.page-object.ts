import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class ChatMessageComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-chat-message div table .btn-danger'));
  title = element.all(by.css('jhi-chat-message div h2#page-heading span')).first();

  async clickOnCreateButton(timeout?: number) {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(timeout?: number) {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons() {
    return this.deleteButtons.count();
  }

  async getTitle() {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class ChatMessageUpdatePage {
  pageTitle = element(by.id('jhi-chat-message-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  messageSentAtInput = element(by.id('field_messageSentAt'));
  messageInput = element(by.id('field_message'));
  isRecievedInput = element(by.id('field_isRecieved'));
  isDeliveredInput = element(by.id('field_isDelivered'));
  chatRoomSelect = element(by.id('field_chatRoom'));
  chatUserSelect = element(by.id('field_chatUser'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setMessageSentAtInput(messageSentAt) {
    await this.messageSentAtInput.sendKeys(messageSentAt);
  }

  async getMessageSentAtInput() {
    return await this.messageSentAtInput.getAttribute('value');
  }

  async setMessageInput(message) {
    await this.messageInput.sendKeys(message);
  }

  async getMessageInput() {
    return await this.messageInput.getAttribute('value');
  }

  getIsRecievedInput(timeout?: number) {
    return this.isRecievedInput;
  }
  getIsDeliveredInput(timeout?: number) {
    return this.isDeliveredInput;
  }

  async chatRoomSelectLastOption(timeout?: number) {
    await this.chatRoomSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async chatRoomSelectOption(option) {
    await this.chatRoomSelect.sendKeys(option);
  }

  getChatRoomSelect(): ElementFinder {
    return this.chatRoomSelect;
  }

  async getChatRoomSelectedOption() {
    return await this.chatRoomSelect.element(by.css('option:checked')).getText();
  }

  async chatUserSelectLastOption(timeout?: number) {
    await this.chatUserSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async chatUserSelectOption(option) {
    await this.chatUserSelect.sendKeys(option);
  }

  getChatUserSelect(): ElementFinder {
    return this.chatUserSelect;
  }

  async getChatUserSelectedOption() {
    return await this.chatUserSelect.element(by.css('option:checked')).getText();
  }

  async save(timeout?: number) {
    await this.saveButton.click();
  }

  async cancel(timeout?: number) {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class ChatMessageDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-chatMessage-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-chatMessage'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
