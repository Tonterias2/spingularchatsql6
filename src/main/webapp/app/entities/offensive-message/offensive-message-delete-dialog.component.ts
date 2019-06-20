import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IOffensiveMessage } from 'app/shared/model/offensive-message.model';
import { OffensiveMessageService } from './offensive-message.service';

@Component({
  selector: 'jhi-offensive-message-delete-dialog',
  templateUrl: './offensive-message-delete-dialog.component.html'
})
export class OffensiveMessageDeleteDialogComponent {
  offensiveMessage: IOffensiveMessage;

  constructor(
    protected offensiveMessageService: OffensiveMessageService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  clear() {
    this.activeModal.dismiss('cancel');
  }

  confirmDelete(id: number) {
    this.offensiveMessageService.delete(id).subscribe(response => {
      this.eventManager.broadcast({
        name: 'offensiveMessageListModification',
        content: 'Deleted an offensiveMessage'
      });
      this.activeModal.dismiss(true);
    });
  }
}

@Component({
  selector: 'jhi-offensive-message-delete-popup',
  template: ''
})
export class OffensiveMessageDeletePopupComponent implements OnInit, OnDestroy {
  protected ngbModalRef: NgbModalRef;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ offensiveMessage }) => {
      setTimeout(() => {
        this.ngbModalRef = this.modalService.open(OffensiveMessageDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
        this.ngbModalRef.componentInstance.offensiveMessage = offensiveMessage;
        this.ngbModalRef.result.then(
          result => {
            this.router.navigate(['/offensive-message', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          },
          reason => {
            this.router.navigate(['/offensive-message', { outlets: { popup: null } }]);
            this.ngbModalRef = null;
          }
        );
      }, 0);
    });
  }

  ngOnDestroy() {
    this.ngbModalRef = null;
  }
}
