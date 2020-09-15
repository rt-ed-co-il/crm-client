import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { DataTablesModule } from 'angular-datatables';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { ModalModule } from '../../modal/modal.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgxDocViewerModule} from 'ngx-doc-viewer';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { FileComponent }            from '../../pages/file/file.component';
import { TypographyComponent }      from '../../pages/typography/typography.component';
import { ActionsComponent }         from '../../pages/person/actions.component';
import { ActionCreateComponent }    from '../../pages/person/actioncreate.component';
import { ActionTypeComponent }      from '../../pages/person/actiontype.component';
import { ActionStatusComponent }    from '../../pages/person/actionstatus.component';
import { ContractNewComponent }     from '../../pages/actionnew/contractnew.component';
import { ApointmentComponent }      from '../../pages/actionnew/apointment.component';
import { TaskComponent }            from '../../pages/actionnew/task.component';
import { MessageComponent }         from '../../pages/actionnew/message.component';
import { NotRelevantComponent }     from '../../pages/actionnew/notrelevant.component';
import { ActionComponent }          from '../../pages/action/action.component';
import { CalendarComponent }        from '../../pages/calendar/calendar.component';
import { LoginComponent }           from '../../pages/login/login.component';
import { UsersComponent }           from '../../pages/users/users.component';
import { FullCalComponent }         from '../../pages/fullcal/fullcal.component';
import { CalStyleDirective }        from '../../directives/cal-style.directive';
import { NoCallDirective }          from '../../pages/person/no-call.directive';
import { UserNewComponent  }        from '../../pages/usernew/usernew.component';
import { PersonComponent  }         from '../../pages/person/person.component';
import { FindComponent  }           from '../../pages/persons/find.component';
import { PriceComponent  }          from '../../pages/price/price.component';
import { StatisticComponent  }      from '../../pages/statistic/statistic.component';
import { PersonNewComponent  }      from '../../pages/personnew/personnew.component';
import { PersonsComponent  }        from '../../pages/persons/persons.component';
import { NotificationsComponent }   from '../../pages/notifications/notifications.component';
import { ConsultantComponent }      from '../../pages/consultant/consultant.component';
import { ThisDayDirective }         from '../../directives/thisday.directive';
import { ChatComponent }            from '../../pages/chat/chat.component';
import { LeadsReportComponent }     from '../../pages/leadsreport/leadsreport.component';
import { JobMasterComponent }       from '../../pages/jobmaster/jobmaster';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    ModalModule,
    MDBBootstrapModule.forRoot(),
    FullCalendarModule,
    DataTablesModule,
    PdfViewerModule,
    NgxDocViewerModule,
    CKEditorModule
  ],
  declarations: [ 
    DashboardComponent,
    UserComponent,
    FileComponent,
    TypographyComponent,
    ActionComponent,
    ActionsComponent,
    ContractNewComponent,
    TaskComponent,
    ApointmentComponent,
    MessageComponent,
    NotRelevantComponent,
    ActionCreateComponent,
    ActionTypeComponent,
    ActionStatusComponent,
    CalendarComponent,
    LoginComponent,
    UsersComponent,
    FullCalComponent,
    CalStyleDirective,
    ThisDayDirective,
    NoCallDirective,
    UserNewComponent,
    PersonComponent,
    PersonNewComponent,
    PersonsComponent,
    FindComponent,
    PriceComponent,
    StatisticComponent,
    NotificationsComponent,
    ConsultantComponent,
    ChatComponent,
    LeadsReportComponent,
    JobMasterComponent,
  ]
})

export class AdminLayoutModule {}
