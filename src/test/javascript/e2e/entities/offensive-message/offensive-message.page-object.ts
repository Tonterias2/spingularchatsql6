import { browser, ExpectedConditions, element, by, ElementFinder } from 'protractor';

export class OffensiveMessageComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-offensive-message div table .btn-danger'));
  title = element.all(by.css('jhi-offensive-message div h2#page-heading span')).first();

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

export class OffensiveMessageUpdatePage {
  pageTitle = element(by.id('jhi-offensive-message-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));
  creationDateInput = element(by.id('field_creationDate'));
  isOffensiveInput = element(by.id('field_isOffensive'));
  chatUserSelect = element(by.id('field_chatUser'));
  chatMessageSelect = element(by.id('field_chatMessage'));

  async getPageTitle() {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setCreationDateInput(creationDate) {
    await this.creationDateInput.sendKeys(creationDate);
  }

  async getCreationDateInput() {
    return await this.creationDateInput.getAttribute('value');
  }

  getIsOffensiveInput(timeout?: number) {
    return this.isOffensiveInput;
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

  async chatMessageSelectLastOption(timeout?: number) {
    await this.chatMessageSelect
      .all(by.tagName('option'))
      .last()
      .click();
  }

  async chatMessageSelectOption(option) {
    await this.chatMessageSelect.sendKeys(option);
  }

  getChatMessageSelect(): ElementFinder {
    return this.chatMessageSelect;
  }

  async getChatMessageSelectedOption() {
    return await this.chatMessageSelect.element(by.css('option:checked')).getText();
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

export class OffensiveMessageDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-offensiveMessage-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-offensiveMessage'));

  async getDialogTitle() {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(timeout?: number) {
    await this.confirmButton.click();
  }
}
