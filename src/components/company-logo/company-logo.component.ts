import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'company-logo',
  templateUrl: './company-logo.component.html',
  //styleUrls: ['./company-logo.component.scss']
})
export class CompanyLogoComponent implements OnInit {
  @Input() logo: string; 

  constructor() { }

  ngOnInit() {

  }

}