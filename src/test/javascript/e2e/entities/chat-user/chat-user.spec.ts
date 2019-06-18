/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ChatUserComponentsPage, ChatUserDeleteDialog, ChatUserUpdatePage } from './chat-user.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('ChatUser e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let chatUserUpdatePage: ChatUserUpdatePage;
  let chatUserComponentsPage: ChatUserComponentsPage;
  let chatUserDeleteDialog: ChatUserDeleteDialog;
  const fileNameToUpload = 'logo-jhipster.png';
  const fileToUpload = '../../../../../../src/main/webapp/content/images/' + fileNameToUpload;
  const absolutePath = path.resolve(__dirname, fileToUpload);

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ChatUsers', async () => {
    await navBarPage.goToEntity('chat-user');
    chatUserComponentsPage = new ChatUserComponentsPage();
    await browser.wait(ec.visibilityOf(chatUserComponentsPage.title), 5000);
    expect(await chatUserComponentsPage.getTitle()).to.eq('spingularchatsql6App.chatUser.home.title');
  });

  it('should load create ChatUser page', async () => {
    await chatUserComponentsPage.clickOnCreateButton();
    chatUserUpdatePage = new ChatUserUpdatePage();
    expect(await chatUserUpdatePage.getPageTitle()).to.eq('spingularchatsql6App.chatUser.home.createOrEditLabel');
    await chatUserUpdatePage.cancel();
  });

  it('should create and save ChatUsers', async () => {
    const nbButtonsBeforeCreate = await chatUserComponentsPage.countDeleteButtons();

    await chatUserComponentsPage.clickOnCreateButton();
    await promise.all([
      chatUserUpdatePage.setCreationDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      chatUserUpdatePage.setImageInput(absolutePath),
      chatUserUpdatePage.userSelectLastOption()
    ]);
    expect(await chatUserUpdatePage.getCreationDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected creationDate value to be equals to 2000-12-31'
    );
    const selectedBannedUser = chatUserUpdatePage.getBannedUserInput();
    if (await selectedBannedUser.isSelected()) {
      await chatUserUpdatePage.getBannedUserInput().click();
      expect(await chatUserUpdatePage.getBannedUserInput().isSelected(), 'Expected bannedUser not to be selected').to.be.false;
    } else {
      await chatUserUpdatePage.getBannedUserInput().click();
      expect(await chatUserUpdatePage.getBannedUserInput().isSelected(), 'Expected bannedUser to be selected').to.be.true;
    }
    expect(await chatUserUpdatePage.getImageInput()).to.endsWith(
      fileNameToUpload,
      'Expected Image value to be end with ' + fileNameToUpload
    );
    await chatUserUpdatePage.save();
    expect(await chatUserUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await chatUserComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ChatUser', async () => {
    const nbButtonsBeforeDelete = await chatUserComponentsPage.countDeleteButtons();
    await chatUserComponentsPage.clickOnLastDeleteButton();

    chatUserDeleteDialog = new ChatUserDeleteDialog();
    expect(await chatUserDeleteDialog.getDialogTitle()).to.eq('spingularchatsql6App.chatUser.delete.question');
    await chatUserDeleteDialog.clickOnConfirmButton();

    expect(await chatUserComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
