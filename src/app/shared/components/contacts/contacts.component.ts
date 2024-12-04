import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css'
})
export class ContactsComponent {

  @Input() avatarUrl: string = '';
  @Input() contactName: string = '';
  @Input() lastMessage: string = '';
  @Input() time: string;
}
