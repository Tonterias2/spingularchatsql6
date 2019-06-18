import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IOffensiveMessage } from 'app/shared/model/offensive-message.model';

@Component({
  selector: 'jhi-offensive-message-detail',
  templateUrl: './offensive-message-detail.component.html'
})
export class OffensiveMessageDetailComponent implements OnInit {
  offensiveMessage: IOffensiveMessage;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ offensiveMessage }) => {
      this.offensiveMessage = offensiveMessage;
    });
  }

  previousState() {
    window.history.back();
  }
}
