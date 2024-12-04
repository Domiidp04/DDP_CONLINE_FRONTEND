import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  public loginUrl: string | null;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUrl();
    this.getToken();
  }

  private getUrl(): void {
    this.authService.getAuthUrl().subscribe((response: any) => this.loginUrl = response.authURL);
  }

  private getToken(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code'] !== undefined) {
        this.authService.getToken(params['code']).subscribe(
          () => this.router.navigate(['/home'])
        );
      }
    })
  }

  public redirectToLogin(): void {
    if (this.loginUrl) {
      window.location.href = this.loginUrl;
    }
  }

}
