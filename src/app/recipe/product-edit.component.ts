import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { Recipe } from './model';
import { RecipeService } from './recipe.service';


import { GenericValidator } from '../shared/generic-validator';
const urlRegex = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$','i');

@Component({
  templateUrl: './product-edit.component.html'
})
export class ProductEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  public readOnly=false;
  pageTitle = 'Recipe Edit';
  errorMessage: string;
  productForm: FormGroup;
  product: Recipe;
  private sub: Subscription;
  private sub1: Subscription;
  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private productService: RecipeService) {

    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      name: {
        required: 'Recipe name is required.',
        minlength: 'Recipe name must be at least three characters.',
        maxlength: 'Recipe name cannot exceed 50 characters.'
      }
    };

    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }
  get ingrediants(): FormArray {
    return <FormArray>this.productForm.get('ingrediants');
  }
  get steps(): FormArray {
    return <FormArray>this.productForm.get('steps');
  }
  initNewForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)]],
      overview: '',
      ingrediants: this.fb.array([]),
      steps: this.fb.array([]),
    });
  }
  ngOnInit(): void {
    this.initNewForm();
    
    // Read the product Id from the route parameter
    this.sub = this.route.paramMap.subscribe(
      params => {
        const _id = +params.get('_id');
        this.getProduct(_id);
      }
    );
    this.sub1 = this.route.queryParams    
      .subscribe(params => {
        console.log(params.readonly); 
        if(params.readonly) {
          this.readOnly=params.readonly==='true'?true:false;
        }
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.sub1.unsubscribe();
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.productForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.productForm);
    });
  }
  getProduct(_id: number): void {
    this.productService.getRecipe(_id)
      .subscribe(
        (product: Recipe) => this.displayProduct(product),
        (error: any) => this.errorMessage = <any>error
      );
  }

  displayProduct(product: Recipe): void {
    if (this.productForm) {
      this.productForm.reset();
      this.initNewForm();
    }
    this.product = product;

    if (this.product._id === 0) {
      this.pageTitle = 'Add Recipe';
      this.initNewForm();
    } else {
      this.pageTitle = `Edit Recipe: ${this.product.name}`;
    }
    if(this.readOnly) {
      this.pageTitle = `Read Only Mode Recipe: ${this.product.name}`;
    }

    // Update the data on the form
    this.productForm.patchValue({
      name: this.product.name,
      overview: this.product.overview
    });
    if(this.product.ingrediants) {
      for(let ing of this.product.ingrediants){
        this.ingrediants.push(
        this.fb.group({
          ingrediantname: [ing.ingrediantname, Validators.required],
        }));
      }
      
    } else {
      this.addIngrediant();
    }
    if(this.steps) {
      for(let step of this.product.steps){
        this.steps.push(
        this.fb.group({
          description: [step.description, Validators.required],
          time: [step.time],
          photo: [''],
          photoData: [step.photoData?step.photoData:''],
          video: [step.video?step.video:'', Validators.pattern(urlRegex)]
        }));
      }
      
    } else {
      this.addStep();
    }
    console.log(this);
  }
  addIngrediant(): void {
    this.ingrediants.push(this.buildAddress());
  }
  addStep(): void {
    this.steps.push(this.buildStep());
  }
  deleteIngrediant(index:number) {
  	this.ingrediants.controls.splice(index,1);
  	this.ingrediants.controls[this.ingrediants.controls.length-1].updateValueAndValidity();
  }
  buildStep(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      time: [''],
      photo: [''],
      photoData: [''],
      video: ['', Validators.pattern(urlRegex)]
    });
  }
  buildAddress(): FormGroup {
    return this.fb.group({
      ingrediantname: ['', Validators.required],
    });
  }
  deleteProduct(): void {
    if (this.product._id === 0) {
      // Don't delete, it was never saved.
      this.onSaveComplete();
    } else {
      if (confirm(`Really delete the product: ${this.product.name}?`)) {
        this.productService.deleteRecipe(this.product._id)
          .subscribe(
            () => this.onSaveComplete(),
            (error: any) => this.errorMessage = <any>error
          );
      }
    }
  }

  saveProduct(): void {
    if (this.productForm.valid) {
      if (this.productForm.dirty) {
        const p = { ...this.product, ...this.productForm.value };

        if (p._id === 0) {
          this.productService.createRecipe(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        } else {
          this.productService.updateRecipe(p)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
            );
        }
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage = 'Please correct the validation errors.';
    }
  }

  onSaveComplete(): void {
    // Reset the form to clear the flags
    this.productForm.reset();
    this.router.navigate(['/recipe']);
  }
  
  preview(file:any, index:string) 
  {
    let files = file.files;
    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      //this.addresses.controls[index].controls.street1photoData.valid=false;
      //message = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    //imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      /* this.imgURL[index] = reader.result; 
      console.log(this.imgURL); */
      
      this.steps.controls[index].patchValue({
        photoData:reader.result
      });
      
    }
  }
  isURLReal(fullyQualifiedURL:string, index:number) {
    var video1 = document.createElement('video');
    video1.onloadeddata = ()=> {
      this.steps.controls[index].patchValue({
        video:fullyQualifiedURL
      })}
    video1.onerror = () =>{
      this.steps.controls[index].patchValue({
        video:''
      })
    }
    video1.src = fullyQualifiedURL;
  }
  clearValue(index:number, prop:string) {
    this.steps.controls[index+''].controls[prop].reset();
  }  
  deleteStep(index:number) {
    this.steps.controls.splice(index,1);
    this.steps.controls[this.steps.controls.length-1].updateValueAndValidity();
  }
}
