import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'my-json',
  templateUrl: './json.component.html',
})
export class MyJsonComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}