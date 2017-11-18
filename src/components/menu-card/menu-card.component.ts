import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'menu-card',
  templateUrl: './menu-card.component.html',
  // styleUrls: ['./menu-card.component.css']
})
export class MenuCardComponent implements OnInit {
  @Input() imgSrc: string;
  @Input() name: string;

  constructor() { }

  ngOnInit() {}

}
