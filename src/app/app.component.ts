import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import Aos from 'aos';
import { SidebarComponent } from "./sidebar/sidebar.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'recipe';

  constructor() {}

  ngOnInit(): void {
    this.initializeAos();
  }

  private initializeAos() {
    Aos.init();
  }
}
