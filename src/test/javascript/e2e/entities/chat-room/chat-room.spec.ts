/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ChatRoomComponentsPage, ChatRoomDeleteDialog, ChatRoomUpdatePage } from './chat-room.page-object';
import * as path from 'path';

const expect = chai.expect;

describe('ChatRoom e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let chatRoomUpdatePage: ChatRoomUpdatePage;
  let chatRoomComponentsPage: ChatRoomComponentsPage;
  let chatRoomDeleteDialog: ChatRoomDeleteDialog;
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

  it('should load ChatRooms', async () => {
    await navBarPage.goToEntity('chat-room');
    chatRoomComponentsPage = new ChatRoomComponentsPage();
    await browser.wait(ec.visibilityOf(chatRoomComponentsPage.title), 5000);
    expect(await chatRoomComponentsPage.getTitle()).to.eq('spingularchatsql6App.chatRoom.home.title');
  });

  it('should load create ChatRoom page', async () => {
    await chatRoomComponentsPage.clickOnCreateButton();
    chatRoomUpdatePage = new ChatRoomUpdatePage();
    expect(await chatRoomUpdatePage.getPageTitle()).to.eq('spingularchatsql6App.chatRoom.home.createOrEditLabel');
    await chatRoomUpdatePage.cancel();
  });

  it('should create and save ChatRooms', async () => {
    const nbButtonsBeforeCreate = await chatRoomComponentsPage.countDeleteButtons();

    await chatRoomComponentsPage.clickOnCreateButton();
    await promise.all([
      chatRoomUpdatePage.setCreationDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      chatRoomUpdatePage.setRoomNameInput('roomName'),
      chatRoomUpdatePage.setRoomDescriptionInput('roomDescription'),
      chatRoomUpdatePage.setImageInput(absolutePath),
      chatRoomUpdatePage.chatUserSelectLastOption()
    ]);
    expect(await chatRoomUpdatePage.getCreationDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected creationDate value to be equals to 2000-12-31'
    );
    expect(await chatRoomUpdatePage.getRoomNameInput()).to.eq('roomName', 'Expected RoomName value to be equals to roomName');
    expect(await chatRoomUpdatePage.getRoomDescriptionInput()).to.eq(
      'roomDescription',
      'Expected RoomDescription value to be equals to roomDescription'
    );
    const selectedPrivateRoom = chatRoomUpdatePage.getPrivateRoomInput();
    if (await selectedPrivateRoom.isSelected()) {
      await chatRoomUpdatePage.getPrivateRoomInput().click();
      expect(await chatRoomUpdatePage.getPrivateRoomInput().isSelected(), 'Expected privateRoom not to be selected').to.be.false;
    } else {
      await chatRoomUpdatePage.getPrivateRoomInput().click();
      expect(await chatRoomUpdatePage.getPrivateRoomInput().isSelected(), 'Expected privateRoom to be selected').to.be.true;
    }
    expect(await chatRoomUpdatePage.getImageInput()).to.endsWith(
      fileNameToUpload,
      'Expected Image value to be end with ' + fileNameToUpload
    );
    await chatRoomUpdatePage.save();
    expect(await chatRoomUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await chatRoomComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ChatRoom', async () => {
    const nbButtonsBeforeDelete = await chatRoomComponentsPage.countDeleteButtons();
    await chatRoomComponentsPage.clickOnLastDeleteButton();

    chatRoomDeleteDialog = new ChatRoomDeleteDialog();
    expect(await chatRoomDeleteDialog.getDialogTitle()).to.eq('spingularchatsql6App.chatRoom.delete.question');
    await chatRoomDeleteDialog.clickOnConfirmButton();

    expect(await chatRoomComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
