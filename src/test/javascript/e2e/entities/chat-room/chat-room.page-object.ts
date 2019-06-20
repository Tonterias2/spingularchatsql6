import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class ChatRoomComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-chat-room div table .btn-danger'));
  title = element.all(by.css('jhi-chat-room div h2#page-heading span')).first();

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

export class ChatRoomUpdatePage {
  pageTitle = element(by.id('jhi-chat-room-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  creationDateInput = element(by.id('field_creationDate'));
  roomNameInput = element(by.id('field_roomName'));
  roomDescriptionInput = element(by.id('field_roomDescription'));
  privateRoomInput = element(by.id('field_privateRoom'));
  imageInput = element(by.id('file_image'));
  chatUserSelect = element(by.id('field_chatUser'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setCreationDateInput(creationDate) {
    await this.creationDateInput.sendKeys(creationDate);
  }

  async getCreationDateInput() {
    return await this.creationDateInput.getAttribute('value');
  }

  async setRoomNameInput(roomName) {
    await this.roomNameInput.sendKeys(roomName);
  }

  async getRoomNameInput() {
    return await this.roomNameInput.getAttribute('value');
  }

  async setRoomDescriptionInput(roomDescription) {
    await this.roomDescriptionInput.sendKeys(roomDescription);
  }

  async getRoomDescriptionInput() {
    return await this.roomDescriptionInput.getAttribute('value');
  }

  getPrivateRoomInput(timeout?: number) {
    return this.privateRoomInput;
  }
  async setImageInput(image) {
    await this.imageInput.sendKeys(image);
  }

  async getImageInput() {
    return await this.imageInput.getAttribute('value');
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

export class ChatRoomDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-chatRoom-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-chatRoom'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
