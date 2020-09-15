import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Important
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
import { DatePipe } from '@angular/common';
import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';
import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { ServerApiService } from './servises/server-api.service';
import { PersonService } from './servises/person.service';
import { LeadStatusService } from './servises/leadstatus.service';
import { ChatService } from './servises/chat.service';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent
  ],
  imports: [
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(AppRoutes,{
      useHash: true
    }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
  ],
  providers: [    
    ServerApiService,
    PersonService,
    LeadStatusService,
    DatePipe,
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
