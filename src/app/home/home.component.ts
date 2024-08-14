import { HttpClient } from '@angular/common/http';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { AuthService } from '../Service/AuthService';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../Entities/book.entity';
import { Observable, tap } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule, CommonModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

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

  // Books form
  booksForm: FormGroup;
  selectedBook: any;
  constructor(private fb: FormBuilder) {
    this.booksForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      author: ['', Validators.required],
      publishingDate: [null, Validators.required]
    });
  }

  books$ = this.getBooks();

  // Add book
  onFormSubmit() {
    if (this.booksForm.invalid) {
      this.errorMessage = 'Fields must not be empty';
      alert("Fields must not be empty");
      this.books$ = this.getBooks();
      this.booksForm.reset();
      return;
    }

    let publishingDate = this.booksForm.value.publishingDate;
    if (publishingDate) {
      const date = new Date(publishingDate);
      date.setHours(0, 0, 0, 0); 
      publishingDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
    }
    
    const addBookRequest = {
      title: this.booksForm.value.title,
      description: this.booksForm.value.description,
      author: this.booksForm.value.author,
      publishingDate: publishingDate
    }
    console.log(publishingDate);

    this.http.post("https://book-api-reset20240814170746.azurewebsites.net/api/Book", addBookRequest)
      .subscribe({
        next: (value) => {
          console.log(value);
          this.books$ = this.getBooks();
          this.booksForm.reset();
        }
      })
  }

  // Delete book
  selectedBookForDeletion: Book | null = null;

  openDeleteModal(item: Book) {
    this.selectedBookForDeletion = item;
  }

  onDelete() {
    if (this.selectedBookForDeletion) {
      const id = this.selectedBookForDeletion.id;
      this.http.delete(`https://book-api-reset20240814170746.azurewebsites.net/api/Book/${id}`)
        .subscribe({
          next: (value) => {
            alert("Item deleted");
            this.books$ = this.getBooks();
            this.selectedBookForDeletion = null;
          },
          error: (err) => {
            console.error("Delete error:", err);
          }
        });
    }
  }

  // Get all books
  private getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>("https://book-api-reset20240814170746.azurewebsites.net/api/Book").pipe(
      tap(books => console.log("Books received:", books))
    );
  }

  // Edit book
  onEditFormSubmit() {

    if (this.booksForm.invalid) {
      this.errorMessage = 'Fields must not be empty';
      alert("Fields must not be empty");
      this.books$ = this.getBooks();
      this.booksForm.reset();
      return;
    }

    let publishingDate = this.booksForm.value.publishingDate;
    if (publishingDate) {
      const date = new Date(publishingDate);
      date.setHours(0, 0, 0, 0);
      publishingDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString();
    }

    if (this.selectedBook) {
      const editBookRequest = {
        id: this.selectedBook.id,
        title: this.booksForm.value.title,
        description: this.booksForm.value.description,
        author: this.booksForm.value.author,
        publishingDate: publishingDate
      };

      console.log("Submitting update for book:", editBookRequest);

      this.http.put(`https://book-api-reset20240814170746.azurewebsites.net/api/Book`, editBookRequest)
        .subscribe({
          next: (value) => {
            console.log("Update successful:", value);
            this.books$ = this.getBooks();
            this.booksForm.reset();
            this.selectedBook = null;

          },
          error: (err) => {
            console.error("Update error:", err);
          }
        });
    } else {
      console.error("No book selected for editing.");
    }

  }

  // Auto fill edit form 
  openEditModal(item: Book) {
    this.selectedBook = item;


    this.booksForm.patchValue({
      title: item.title,
      description: item.description,
      author: item.author,
      publishingDate: item.publishingDate ? new Date(item.publishingDate) : null,
    });
  }

  // Logout
  logout() {
    this.authService.logout();
  }

}
