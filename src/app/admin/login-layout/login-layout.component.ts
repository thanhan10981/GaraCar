import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";

// login-layout.component.ts
@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterModule],
  template: `<router-outlet></router-outlet>`
})
export class LoginLayoutComponent {}
