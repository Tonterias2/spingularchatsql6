import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'chat-user',
        loadChildren: './chat-user/chat-user.module#Spingularchatsql6ChatUserModule'
      },
      {
        path: 'chat-room',
        loadChildren: './chat-room/chat-room.module#Spingularchatsql6ChatRoomModule'
      },
      {
        path: 'chat-room-allowed-user',
        loadChildren: './chat-room-allowed-user/chat-room-allowed-user.module#Spingularchatsql6ChatRoomAllowedUserModule'
      },
      {
        path: 'chat-message',
        loadChildren: './chat-message/chat-message.module#Spingularchatsql6ChatMessageModule'
      },
      {
        path: 'offensive-message',
        loadChildren: './offensive-message/offensive-message.module#Spingularchatsql6OffensiveMessageModule'
      },
      {
        path: 'chat-notification',
        loadChildren: './chat-notification/chat-notification.module#Spingularchatsql6ChatNotificationModule'
      }
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ])
  ],
  declarations: [],
  entryComponents: [],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Spingularchatsql6EntityModule {}
