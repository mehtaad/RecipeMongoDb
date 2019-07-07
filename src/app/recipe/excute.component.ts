import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { Recipe } from './model';
import { RecipeService } from './recipe.service';
@Component({
  selector: 'app-excute',
  templateUrl: './excute.component.html',
  styleUrls: ['./excute.component.css']
})
export class ExcuteComponent implements OnInit, OnDestroy {
 
  public stepNumber = 0;
  public lastStepNumber = 1;
  errorMessage: string;
  pageTitle = 'Executing Recipe';
  public timerStarted = false;
  public timerValueLeft = 0;
  public timerObj
  toggleTimerStr = "Pause Timer";
  product: Recipe;
  private sub: Subscription;
  
  

  constructor(private route: ActivatedRoute, private router: Router,
    private productService: RecipeService) {

    
  }
  toggleTimer() {
    if(this.timerValueLeft === 0) return;
    if(this.toggleTimerStr === 'Pause Timer' ){
      this.toggleTimerStr = "Resume Timer";
      clearInterval(this.timerObj);
    } else {
      this.toggleTimerStr = "Pause Timer";
      this.startTimer();
    }
  }
  startTimer() {
    this.timerStarted = true;
    this.timerObj = setInterval(()=>{
      this.timerValueLeft--;
      if(this.timerValueLeft===0) {
        clearInterval(this.timerObj);
        this.toggleTimerStr = "Step Finished";
      }
    },1000)
  }
  resetTimer() {
    this.toggleTimerStr = "Pause Timer";
    if(this.timerStarted) {
      clearInterval(this.timerObj);
      this.timerStarted = false;
      
    }
  }
  nextStep() {
    this.resetTimer(); 
    if(this.stepNumber < this.lastStepNumber) 
    { 
      this.stepNumber++;
      if(this.stepNumber>0)
        this.timerValueLeft = this.product.steps[this.stepNumber-1].time;
      
    }

  }
  lastStep() {
    this.resetTimer();  
    this.stepNumber = this.stepNumber-1;
    if(this.stepNumber>0)
      this.timerValueLeft = this.product.steps[this.stepNumber-1].time;
    
  }  
  
  ngOnInit(): void {
    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const _id = +params.get('_id');
        this.getProduct(_id);
      }
    );
    
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    
  }

  ngAfterViewInit(): void {
    
  }
  getProduct(_id: number): void {
    this.productService.getRecipe(_id)
      .subscribe(
        (product: Recipe) => this.displayProduct(product),
        (error: any) => this.errorMessage = <any>error
      );
  }

  displayProduct(product: Recipe): void {
    
    this.product = Object.assign({},product);
     this.pageTitle = `${this.pageTitle}: ${this.product.name}`;
    
    this.lastStepNumber = this.product.steps.length;
    if(this.product.steps) {
      for(let step of this.product.steps){
        
      }
      
    } 
  }
  
}
