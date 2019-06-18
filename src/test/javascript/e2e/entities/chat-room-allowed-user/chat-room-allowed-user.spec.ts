/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ChatRoomAllowedUserComponentsPage,
  ChatRoomAllowedUserDeleteDialog,
  ChatRoomAllowedUserUpdatePage
} from './chat-room-allowed-user.page-object';

const expect = chai.expect;

describe('ChatRoomAllowedUser e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let chatRoomAllowedUserUpdatePage: ChatRoomAllowedUserUpdatePage;
  let chatRoomAllowedUserComponentsPage: ChatRoomAllowedUserComponentsPage;
  let chatRoomAllowedUserDeleteDialog: ChatRoomAllowedUserDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ChatRoomAllowedUsers', async () => {
    await navBarPage.goToEntity('chat-room-allowed-user');
    chatRoomAllowedUserComponentsPage = new ChatRoomAllowedUserComponentsPage();
    await browser.wait(ec.visibilityOf(chatRoomAllowedUserComponentsPage.title), 5000);
    expect(await chatRoomAllowedUserComponentsPage.getTitle()).to.eq('spingularchatsql6App.chatRoomAllowedUser.home.title');
  });

  it('should load create ChatRoomAllowedUser page', async () => {
    await chatRoomAllowedUserComponentsPage.clickOnCreateButton();
    chatRoomAllowedUserUpdatePage = new ChatRoomAllowedUserUpdatePage();
    expect(await chatRoomAllowedUserUpdatePage.getPageTitle()).to.eq('spingularchatsql6App.chatRoomAllowedUser.home.createOrEditLabel');
    await chatRoomAllowedUserUpdatePage.cancel();
  });

  it('should create and save ChatRoomAllowedUsers', async () => {
    const nbButtonsBeforeCreate = await chatRoomAllowedUserComponentsPage.countDeleteButtons();

    await chatRoomAllowedUserComponentsPage.clickOnCreateButton();
    await promise.all([
      chatRoomAllowedUserUpdatePage.setCreationDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      chatRoomAllowedUserUpdatePage.setBannedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      chatRoomAllowedUserUpdatePage.chatRoomSelectLastOption(),
      chatRoomAllowedUserUpdatePage.chatUserSelectLastOption()
    ]);
    expect(await chatRoomAllowedUserUpdatePage.getCreationDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected creationDate value to be equals to 2000-12-31'
    );
    const selectedBannedUser = chatRoomAllowedUserUpdatePage.getBannedUserInput();
    if (await selectedBannedUser.isSelected()) {
      await chatRoomAllowedUserUpdatePage.getBannedUserInput().click();
      expect(await chatRoomAllowedUserUpdatePage.getBannedUserInput().isSelected(), 'Expected bannedUser not to be selected').to.be.false;
    } else {
      await chatRoomAllowedUserUpdatePage.getBannedUserInput().click();
      expect(await chatRoomAllowedUserUpdatePage.getBannedUserInput().isSelected(), 'Expected bannedUser to be selected').to.be.true;
    }
    expect(await chatRoomAllowedUserUpdatePage.getBannedDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected bannedDate value to be equals to 2000-12-31'
    );
    await chatRoomAllowedUserUpdatePage.save();
    expect(await chatRoomAllowedUserUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await chatRoomAllowedUserComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ChatRoomAllowedUser', async () => {
    const nbButtonsBeforeDelete = await chatRoomAllowedUserComponentsPage.countDeleteButtons();
    await chatRoomAllowedUserComponentsPage.clickOnLastDeleteButton();

    chatRoomAllowedUserDeleteDialog = new ChatRoomAllowedUserDeleteDialog();
    expect(await chatRoomAllowedUserDeleteDialog.getDialogTitle()).to.eq('spingularchatsql6App.chatRoomAllowedUser.delete.question');
    await chatRoomAllowedUserDeleteDialog.clickOnConfirmButton();

    expect(await chatRoomAllowedUserComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
