import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../shared/header/header.component";
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from "@angular/router";
import { FooterComponent } from "../../shared/footer/footer.component";
import { MatList } from "@angular/material/list";
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, FooterComponent, MatList, RouterLink, RouterLinkActive],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit {
  isAdminDashboard = false;
  isAdminIncidents = false;
  isAdminSessions = false;
  isAdminSession = false;
  isAdminIncident = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkRoute(this.router.url);
    
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkRoute(event.url);
    });
  }

  private checkRoute(url: string) {
    this.isAdminDashboard = url.includes('admin-dashboard');
    this.isAdminIncidents = url.includes('admin-incidents');
    this.isAdminSessions = url.includes('admin-sessions');
    this.isAdminSession = url.includes('admin-session');
    this.isAdminIncident = url.includes('admin-incident');
  }
}
