/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ChatNotificationComponentsPage, ChatNotificationDeleteDialog, ChatNotificationUpdatePage } from './chat-notification.page-object';

const expect = chai.expect;

describe('ChatNotification e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let chatNotificationUpdatePage: ChatNotificationUpdatePage;
  let chatNotificationComponentsPage: ChatNotificationComponentsPage;
  let chatNotificationDeleteDialog: ChatNotificationDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ChatNotifications', async () => {
    await navBarPage.goToEntity('chat-notification');
    chatNotificationComponentsPage = new ChatNotificationComponentsPage();
    await browser.wait(ec.visibilityOf(chatNotificationComponentsPage.title), 5000);
    expect(await chatNotificationComponentsPage.getTitle()).to.eq('spingularchatsql6App.chatNotification.home.title');
  });

  it('should load create ChatNotification page', async () => {
    await chatNotificationComponentsPage.clickOnCreateButton();
    chatNotificationUpdatePage = new ChatNotificationUpdatePage();
    expect(await chatNotificationUpdatePage.getPageTitle()).to.eq('spingularchatsql6App.chatNotification.home.createOrEditLabel');
    await chatNotificationUpdatePage.cancel();
  });

  it('should create and save ChatNotifications', async () => {
    const nbButtonsBeforeCreate = await chatNotificationComponentsPage.countDeleteButtons();

    await chatNotificationComponentsPage.clickOnCreateButton();
    await promise.all([
      chatNotificationUpdatePage.setCreationDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      chatNotificationUpdatePage.chatUserSelectLastOption(),
      chatNotificationUpdatePage.chatMessageSelectLastOption(),
      chatNotificationUpdatePage.chatRoomSelectLastOption()
    ]);
    expect(await chatNotificationUpdatePage.getCreationDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected creationDate value to be equals to 2000-12-31'
    );
    await chatNotificationUpdatePage.save();
    expect(await chatNotificationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await chatNotificationComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ChatNotification', async () => {
    const nbButtonsBeforeDelete = await chatNotificationComponentsPage.countDeleteButtons();
    await chatNotificationComponentsPage.clickOnLastDeleteButton();

    chatNotificationDeleteDialog = new ChatNotificationDeleteDialog();
    expect(await chatNotificationDeleteDialog.getDialogTitle()).to.eq('spingularchatsql6App.chatNotification.delete.question');
    await chatNotificationDeleteDialog.clickOnConfirmButton();

    expect(await chatNotificationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
