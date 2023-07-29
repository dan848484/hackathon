import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './pages/chat/chat.component';
import { StartComponent } from './pages/start/start.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { SetupGuard } from './guards/setup.guard';

const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  { path: 'chat', component: ChatComponent, canActivate: [SetupGuard] },
  { path: 'start', component: StartComponent },
  { path: 'calendar', component: CalendarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
