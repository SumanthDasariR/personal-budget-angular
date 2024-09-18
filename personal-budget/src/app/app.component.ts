import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { HeroComponent } from './hero/hero.component';
import { HomepageComponent } from './homepage/homepage.component';
import { AboutComponent } from './about/about.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { ArticleComponent } from './article/article.component';
import { provideHttpClient, withInterceptorsFromDi,withFetch} from '@angular/common/http';
@Component({
  selector: 'pb-root',
  standalone: true,
  imports: [RouterOutlet,MenuComponent, HeroComponent, HomepageComponent,AboutComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'personal-budget';
}
