import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'empty-message',
  templateUrl: './empty-message.component.html',
  //styleUrls: ['./empty-message.component.css']
})
export class EmptyMessageComponent implements OnInit {
  @Input() message: string;
  @Input() longMessage: string;
  constructor() { }

  ngOnInit() {
  }


}