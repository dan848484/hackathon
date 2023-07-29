import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  menuOpen:boolean = true;
  constructor(private router: Router){
    this.router.events.pipe(
      filter(
        (event:any)=>{
      return event instanceof NavigationEnd
    }
    )
    ).subscribe((event:NavigationEnd)=>{
      
      const currentPage = event.urlAfterRedirects.split("/")[1];
      this.menuOpen = currentPage != "start";
    })
  }
  ngOnInit(): void {}
  title = 'apc';
}
