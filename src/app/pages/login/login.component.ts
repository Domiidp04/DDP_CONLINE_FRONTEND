import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  public loginUrl: string | null = null;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.getUrl();
    this.getToken();
  }

  public getUrl(): any{
    this.authService.getAuthUrl().subscribe((response:any) => {
      this.loginUrl = response.authURL;
    });
  }

  public getToken(): void{
    this.route.queryParams.subscribe( params => {
      if(params['code'] !== undefined) {
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
