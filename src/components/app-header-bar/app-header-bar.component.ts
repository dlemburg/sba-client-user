import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'AppHeaderBar',
  templateUrl: './app-header-bar.component.html',
  //styleUrls: ['./app-header-bar.component.css']
})
export class AppHeaderBarComponent implements OnInit {
  @Input() appHeaderBarLogo: string;
  @Input() companyName: string;
  @Input() placeholder: string;
  err: boolean = false;
  default: boolean =  false;

  /*
  precedence: 1.) placeholder, 2.) appHeaderBarLogo (not default), 3.) companyName
  */

  constructor() { }

  ngOnInit() {
    this.companyName = this.companyName;
    this.err = false;
    this.default = this.appHeaderBarLogo.indexOf("default") > -1 ? true : false;
  }


  onAppHeaderBarLogoSrcErr() {
    this.err = true;
  }

}