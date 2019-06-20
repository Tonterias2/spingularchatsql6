import { Moment } from 'moment';

export interface IOffensiveMessage {
  id?: number;
  creationDate?: Moment;
  isOffensive?: boolean;
  chatUserId?: number;
  chatMessageId?: number;
}

export class OffensiveMessage implements IOffensiveMessage {
  constructor(
    public id?: number,
    public creationDate?: Moment,
    public isOffensive?: boolean,
    public chatUserId?: number,
    public chatMessageId?: number
  ) {
    this.isOffensive = this.isOffensive || false;
  }
}
