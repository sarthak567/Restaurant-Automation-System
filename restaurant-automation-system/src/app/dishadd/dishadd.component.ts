import { Component, OnInit, ViewChild} from '@angular/core';
import { DishService } from '../services/dish.service';
import { Dish } from '../models/dish';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { RefreshService } from '../services/refresh.service';
import { ToastrService } from '../services/toastr.service';
import { StockService } from '../services/stock.service';

@Component({
  selector: 'app-dishadd',
  templateUrl: './dishadd.component.html',
  styleUrls: ['./dishadd.component.css']
})
export class DishaddComponent implements OnInit {

  dish: Dish;
  categories: any;
  error: any;
  categoryid: number;
  dishForm: FormGroup;
  dishAdd: boolean;

  @ViewChild('dform') dishAddFormDirective;
   //TODO: Angular Form Validation 

  constructor(private dishService:DishService,private fb:FormBuilder,
              public dialogRef:MatDialogRef<DishaddComponent>,
              private refresh: RefreshService,
              private toastrService:ToastrService,
              private stockService:StockService) { 
    this.createDishItemForm();
    this.getCategories();
  }

  ngOnInit() {
  }
  getCategories() {
    this.dishService.getCategories()
                    .subscribe(categories => {
                      this.categories = categories;
                    },
                    error => {
                      this.error = error;
                    });
  }

  createDishItemForm() {
    this.dishForm = this.fb.group({
      id: [''],
      name: ['',[Validators.required]],
      category:['',[Validators.required]],
      price: ['',[Validators.required,Validators.min(10)]],
      image: ['',[Validators.required]],
      description: ['',[Validators.required,Validators.minLength(20),Validators.maxLength(200)]]
    });
  }

  addNewDish() {
    this.dish = this.dishForm.value;
    this.dishService.addNewDish(this.dish)
                    .subscribe(result => { 
                      this.toastrService.success("New item added successfully");
                      this.toastrService.info("Please update the ingredients required for this dish");
                      this.refresh.sendNotification();
                      this.dialogRef.close();
                    },
                    error => {
                      this.dialogRef.close();
                      this.toastrService.error("Dish insertion failed");
                    });
  }
}
