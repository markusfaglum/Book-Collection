import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { AuthService } from '../Service/AuthService';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Quote } from '../../Entities/quote.entity';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, CommonModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.css',
  encapsulation: ViewEncapsulation.None
})
export class QuotesComponent {

  http = inject(HttpClient);

  authService = inject(AuthService);

  errorMessage: string = '';

  isDarkMode = true;

  appComp = inject(AppComponent);

  // Dark/light mode
  ngOnInit(): void {
    this.initializeSwitchState(); 
  }

  initializeSwitchState(): void {
    
    this.isDarkMode = this.appComp.getIsDark('isDarkMode');
    if (this.isDarkMode === true) {
      this.appComp.darkTheme();
      console.log("It's dark");
    } else {
      this.appComp.lightTheme();
      console.log("It's light");
    }
    this.appComp.setIsDark(this.isDarkMode);

  }

  toggleTheme() {
    this.appComp.toggleTheme();
    this.isDarkMode = !this.isDarkMode;
  }

  // Quotes form
  quotesForm: FormGroup;
  selectedQuote: any;
  constructor(private fb: FormBuilder) {
    this.quotesForm = this.fb.group({
      quotation: ['', Validators.required],
      attributed: ['', Validators.required],
      dateOfQuote: [null, Validators.required]
    });
  }

  quotes$ = this.getQuotes();


  // Add quote
  onFormSubmit() {
    if (this.quotesForm.invalid) {
      this.errorMessage = 'Fields must not be empty';
      alert("Fields must not be empty");
      this.quotes$ = this.getQuotes();
      this.quotesForm.reset();
      return;
    }
    const addQuoteRequest = {
      quotation: this.quotesForm.value.quotation,
      attributed: this.quotesForm.value.attributed,
      dateOfQuote: this.quotesForm.value.dateOfQuote ? this.quotesForm.value.dateOfQuote.toISOString() : null
    };
    this.http.post("https://book-api-reset20240814170746.azurewebsites.net/api/Quote", addQuoteRequest)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.quotes$ = this.getQuotes();
          this.quotesForm.reset();
        }
      })
  }

  // Delete quote
  selectedQuoteForDeletion: Quote | null = null;

  openDeleteModal(item: Quote) {
    this.selectedQuoteForDeletion = item;
  }

  onDelete() {
    if (this.selectedQuoteForDeletion) {
      const id = this.selectedQuoteForDeletion.id;
      this.http.delete(`https://book-api-reset20240814170746.azurewebsites.net/api/Quote/${id}`)
        .subscribe({
          next: (value) => {
            alert("Item deleted");
            this.quotes$ = this.getQuotes();
            this.selectedQuoteForDeletion = null;
          },
          error: (err) => {
            console.error("Delete error:", err);
          }
        });
    }
  }

  // Get all quotes
  private getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>("https://book-api-reset20240814170746.azurewebsites.net/api/Quote").pipe(
      tap(quotes => console.log("Quotes received:", quotes))
    );
  }

  // Edit quote
  onEditFormSubmit() {

    if (this.quotesForm.invalid) {
      this.errorMessage = 'Fields must not be empty';
      alert("Fields must not be empty");
      this.quotes$ = this.getQuotes();
      this.quotesForm.reset();
      return;
    }

    if (this.selectedQuote) {
      const editQuoteRequest = {
        id: this.selectedQuote.id,
        quotation: this.quotesForm.value.quotation,
        attributed: this.quotesForm.value.attributed,
        dateOfQuote: this.quotesForm.value.dateOfQuote
      };

      console.log("Submitting update for quote:", editQuoteRequest);

      this.http.put(`https://book-api-reset20240814170746.azurewebsites.net/api/Quote`, editQuoteRequest)
        .subscribe({
          next: (value) => {
            console.log("Update successful:", value);
            this.quotes$ = this.getQuotes();
            this.quotesForm.reset();
            this.selectedQuote = null;

          },
          error: (err) => {
            console.error("Update error:", err);
          }
        });
    } else {
      console.error("No quote selected for editing.");
    }

  }

  // Auto fill edit form
  openEditModal(item: Quote) {
    this.selectedQuote = item;


    this.quotesForm.patchValue({
      quotation: item.quotation,
      attributed: item.attributed,
      dateOfQuote: item.dateOfQuote ? new Date(item.dateOfQuote) : null,
    });
  }

  // Logout
  logout() {
    this.authService.logout();
  }
}
