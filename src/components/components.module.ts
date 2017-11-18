import { NgModule } from '@angular/core';
import {IonicModule}  from 'ionic-angular';

import { AppHeaderBarComponent } from './app-header-bar/app-header-bar.component';
import { CompanyLogoComponent } from './company-logo/company-logo.component';
import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { CustomValidatorComponent } from './custom-validator/custom-validator.component';
import { DollarIconComponent } from './dollar-icon/dollar-icon.component';
import { EmptyMessageComponent } from './empty-message/empty-message.component';
import { MyJsonComponent } from './json/json.component';
import { SearchComponent } from './search/search.component';
import { MenuCardComponent } from './menu-card/menu-card.component';


@NgModule({
  declarations: [AppHeaderBarComponent, CompanyLogoComponent, ControlMessagesComponent, CustomValidatorComponent, DollarIconComponent, EmptyMessageComponent,
    MyJsonComponent, SearchComponent, MenuCardComponent],
  imports: [IonicModule],
  exports: [AppHeaderBarComponent, CompanyLogoComponent, ControlMessagesComponent, CustomValidatorComponent, DollarIconComponent, EmptyMessageComponent,
    MyJsonComponent, SearchComponent, MenuCardComponent]
})
export class ComponentsModule { }