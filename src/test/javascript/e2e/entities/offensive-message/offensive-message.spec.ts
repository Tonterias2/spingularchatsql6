/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OffensiveMessageComponentsPage, OffensiveMessageDeleteDialog, OffensiveMessageUpdatePage } from './offensive-message.page-object';

const expect = chai.expect;

describe('OffensiveMessage e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let offensiveMessageUpdatePage: OffensiveMessageUpdatePage;
  let offensiveMessageComponentsPage: OffensiveMessageComponentsPage;
  let offensiveMessageDeleteDialog: OffensiveMessageDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load OffensiveMessages', async () => {
    await navBarPage.goToEntity('offensive-message');
    offensiveMessageComponentsPage = new OffensiveMessageComponentsPage();
    await browser.wait(ec.visibilityOf(offensiveMessageComponentsPage.title), 5000);
    expect(await offensiveMessageComponentsPage.getTitle()).to.eq('spingularchatsql6App.offensiveMessage.home.title');
  });

  it('should load create OffensiveMessage page', async () => {
    await offensiveMessageComponentsPage.clickOnCreateButton();
    offensiveMessageUpdatePage = new OffensiveMessageUpdatePage();
    expect(await offensiveMessageUpdatePage.getPageTitle()).to.eq('spingularchatsql6App.offensiveMessage.home.createOrEditLabel');
    await offensiveMessageUpdatePage.cancel();
  });

  it('should create and save OffensiveMessages', async () => {
    const nbButtonsBeforeCreate = await offensiveMessageComponentsPage.countDeleteButtons();

    await offensiveMessageComponentsPage.clickOnCreateButton();
    await promise.all([
      offensiveMessageUpdatePage.setCreationDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      offensiveMessageUpdatePage.chatUserSelectLastOption(),
      offensiveMessageUpdatePage.chatMessageSelectLastOption()
    ]);
    expect(await offensiveMessageUpdatePage.getCreationDateInput()).to.contain(
      '2001-01-01T02:30',
      'Expected creationDate value to be equals to 2000-12-31'
    );
    const selectedIsOffensive = offensiveMessageUpdatePage.getIsOffensiveInput();
    if (await selectedIsOffensive.isSelected()) {
      await offensiveMessageUpdatePage.getIsOffensiveInput().click();
      expect(await offensiveMessageUpdatePage.getIsOffensiveInput().isSelected(), 'Expected isOffensive not to be selected').to.be.false;
    } else {
      await offensiveMessageUpdatePage.getIsOffensiveInput().click();
      expect(await offensiveMessageUpdatePage.getIsOffensiveInput().isSelected(), 'Expected isOffensive to be selected').to.be.true;
    }
    await offensiveMessageUpdatePage.save();
    expect(await offensiveMessageUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await offensiveMessageComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last OffensiveMessage', async () => {
    const nbButtonsBeforeDelete = await offensiveMessageComponentsPage.countDeleteButtons();
    await offensiveMessageComponentsPage.clickOnLastDeleteButton();

    offensiveMessageDeleteDialog = new OffensiveMessageDeleteDialog();
    expect(await offensiveMessageDeleteDialog.getDialogTitle()).to.eq('spingularchatsql6App.offensiveMessage.delete.question');
    await offensiveMessageDeleteDialog.clickOnConfirmButton();

    expect(await offensiveMessageComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
