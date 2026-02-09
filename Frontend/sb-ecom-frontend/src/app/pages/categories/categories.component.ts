import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  imports: [FormsModule],
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  newCategoryName = '';
  editingId: number | null = null;
  editName = '';

  constructor(
    private categoryService: CategoryService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories = res.content || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  createCategory() {
    if (!this.newCategoryName.trim()) return;
    this.categoryService.create({ categoryName: this.newCategoryName }).subscribe({
      next: () => {
        this.newCategoryName = '';
        this.loadCategories();
      },
      error: (err) => alert(err.error?.message || 'Failed to create category'),
    });
  }

  startEdit(cat: Category) {
    this.editingId = cat.categoryId;
    this.editName = cat.categoryName;
  }

  cancelEdit() {
    this.editingId = null;
    this.editName = '';
  }

  saveEdit(categoryId: number) {
    this.categoryService.update(categoryId, { categoryName: this.editName }).subscribe({
      next: () => {
        this.editingId = null;
        this.loadCategories();
      },
      error: (err) => alert(err.error?.message || 'Failed to update'),
    });
  }

  deleteCategory(categoryId: number) {
    if (!confirm('Delete this category?')) return;
    this.categoryService.delete(categoryId).subscribe({
      next: () => this.loadCategories(),
      error: (err) => alert(err.error?.message || 'Failed to delete'),
    });
  }
}
