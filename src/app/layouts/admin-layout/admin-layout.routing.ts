import { Routes } from '@angular/router';
import { AuthGuard } from '../../auth.guard';

import { DashboardComponent }       from '../../pages/dashboard/dashboard.component';
import { UserComponent }            from '../../pages/user/user.component';
import { FileComponent }            from '../../pages/file/file.component';
import { TypographyComponent }      from '../../pages/typography/typography.component';
import { CalendarComponent }        from '../../pages/calendar/calendar.component';
import { FullCalComponent }         from '../../pages/fullcal/fullcal.component';
import { LoginComponent }           from '../../pages/login/login.component';
import { NotificationsComponent }   from '../../pages/notifications/notifications.component';
import { ContractNewComponent }     from '../../pages/actionnew/contractnew.component';
import { ApointmentComponent }      from '../../pages/actionnew/apointment.component';
import { TaskComponent }            from '../../pages/actionnew/task.component';
import { MessageComponent }         from '../../pages/actionnew/message.component';
import { NotRelevantComponent }     from '../../pages/actionnew/notrelevant.component';
import { ActionComponent }          from '../../pages/action/action.component';
import { UsersComponent }           from '../../pages/users/users.component';
import { UserNewComponent  }        from '../../pages/usernew/usernew.component';
import { PersonComponent  }         from '../../pages/person/person.component';
import { PersonNewComponent  }      from '../../pages/personnew/personnew.component';
import { PersonsComponent  }        from '../../pages/persons/persons.component';
import { ConsultantComponent }      from '../../pages/consultant/consultant.component';
import { ChatComponent }            from '../../pages/chat/chat.component';
import { LeadsReportComponent }     from '../../pages/leadsreport/leadsreport.component';
import { JobMasterComponent }       from '../../pages/jobmaster/jobmaster';


export const AdminLayoutRoutes: Routes = [
    { 
        path: 'jobmaster',      
        component: JobMasterComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'leadsreport',      
        component: LeadsReportComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'chat',      
        component: ChatComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'consultant',      
        component: ConsultantComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'dashboard',      
        component: DashboardComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'action',      
        component: ActionComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'contractnnew',      
        component: ContractNewComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'apointment',      
        component: ApointmentComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'task',      
        component: TaskComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'message',      
        component: MessageComponent , 
        canActivate: [AuthGuard]
    },    
    { 
        path: 'notrelevant',      
        component: NotRelevantComponent , 
        canActivate: [AuthGuard]
    },    
    { 
        path: 'calendar',       
        component: CalendarComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'login',          
        component: LoginComponent 
    },
    { 
        path: 'fullcal',        
        component: FullCalComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'users',          
        component: UsersComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'user',           
        component: UserComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'file',           
        component: FileComponent , 
        canActivate: [AuthGuard]
    },    { 
        path: 'person',           
        component: PersonComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'personnew',           
        component: PersonNewComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'persons',           
        component: PersonsComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'usernew',           
        component: UserNewComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'notifications',           
        component: NotificationsComponent , 
        canActivate: [AuthGuard]
    },
    { 
        path: 'typography',  
        component: TypographyComponent , 
        canActivate: [AuthGuard]
    }
];
