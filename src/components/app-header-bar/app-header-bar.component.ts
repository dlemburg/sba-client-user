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

  /*
  precedence: 1.) placeholder, 2.) appHeaderBarLogo, 3.) companyName

  */

  constructor() { }

  ngOnInit() {
    this.companyName = this.companyName;
    this.err = false;
  }


  onAppHeaderBarLogoSrcErr() {
    this.err = true;
  }

}