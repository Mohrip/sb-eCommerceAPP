import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  tab: 'products' | 'add' = 'products';

  // Add product form
  form: Partial<Product> = {
    productName: '', description: '', price: 0, discount: 0, quantity: 0,
  };
  selectedCategoryId: number | null = null;
  formLoading = false;
  formMessage = '';

  // Edit product
  editingProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.categoryService.getAll().subscribe({
      next: (res) => (this.categories = res.content || []),
    });
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res.content || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  addProduct() {
    if (!this.selectedCategoryId) {
      this.formMessage = 'Please select a category.';
      return;
    }
    this.formLoading = true;
    this.formMessage = '';
    this.productService.create(this.selectedCategoryId, this.form).subscribe({
      next: () => {
        this.formLoading = false;
        this.formMessage = 'Product added!';
        this.form = { productName: '', description: '', price: 0, discount: 0, quantity: 0 };
        this.loadProducts();
      },
      error: (err) => {
        this.formLoading = false;
        this.formMessage = err.error?.message || 'Failed to add product.';
      },
    });
  }

  startEdit(product: Product) {
    this.editingProduct = { ...product };
  }

  cancelEdit() {
    this.editingProduct = null;
  }

  saveEdit() {
    if (!this.editingProduct) return;
    this.productService.update(this.editingProduct.productId, this.editingProduct).subscribe({
      next: () => {
        this.editingProduct = null;
        this.loadProducts();
      },
      error: (err) => alert(err.error?.message || 'Failed to update'),
    });
  }

  deleteProduct(productId: number) {
    if (!confirm('Delete this product?')) return;
    this.productService.delete(productId).subscribe({
      next: () => this.loadProducts(),
      error: (err) => alert(err.error?.message || 'Failed to delete'),
    });
  }

  onImageSelected(event: Event, productId: number) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.productService.updateImage(productId, input.files[0]).subscribe({
      next: () => this.loadProducts(),
      error: (err) => alert(err.error?.message || 'Failed to upload image'),
    });
  }
}
