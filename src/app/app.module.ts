import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AppComponent } from './app.component';
import { WelcomeComponent } from './home/welcome.component';
import { RecipeService, 
  RecipeListComponent, 
  ProductEditComponent, 
  DisableControlDirective, 
  ProductEditGuard, 
  ExcuteComponent 
} from './recipe/index'

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    RecipeListComponent,
    ProductEditComponent,
    DisableControlDirective,
    ExcuteComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot([
      { path: 'welcome', component: WelcomeComponent },
      {path: 'recipe', component: RecipeListComponent},
      {path: 'recipe/:_id', component: ProductEditComponent, canDeactivate: [ProductEditGuard]},
      {path: 'excute/:_id', component: ExcuteComponent},
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: '**', redirectTo: 'welcome', pathMatch: 'full' }
    ])
    //,InMemoryWebApiModule.forRoot(RecipeData)
  ],
  providers:[RecipeService, ProductEditGuard], 		
  bootstrap: [AppComponent]
})
export class AppModule { }
