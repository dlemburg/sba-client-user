import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'AppHeaderBar',
  templateUrl: './app-header-bar.component.html',
  //styleUrls: ['./app-header-bar.component.css']
})
export class AppHeaderBarComponent implements OnInit {
  @Input() appHeaderBarLogo: string;
  @Input() companyName: string;
  err: boolean = false;

  constructor() { }

  ngOnInit() {
    this.err = false;
    console.log("this.appHeaderBarLogo: ", this.appHeaderBarLogo);
  }


  onAppHeaderBarLogoSrcErr() {
    console.log("app header bar logo src error");
    this.err = true;
  }

}