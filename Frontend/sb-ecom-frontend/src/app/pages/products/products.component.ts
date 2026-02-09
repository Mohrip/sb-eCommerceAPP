import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-products',
  imports: [FormsModule],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  selectedCategory = 0;
  searchKeyword = '';
  loading = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cartService: CartService,
    public auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categoryService.getAll().subscribe({
      next: (res) => (this.categories = res.content || []),
    });

    this.route.queryParams.subscribe(params => {
      const catId = params['category'];
      if (catId) {
        this.selectedCategory = +catId;
        this.loadByCategory(this.selectedCategory);
      } else {
        this.loadAll();
      }
    });
  }

  loadAll() {
    this.loading = true;
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res.content || [];
        this.filteredProducts = this.products;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  loadByCategory(categoryId: number) {
    this.loading = true;
    this.productService.getByCategory(categoryId).subscribe({
      next: (res) => {
        this.products = res.content || [];
        this.filteredProducts = this.products;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onCategoryChange() {
    if (this.selectedCategory === 0) {
      this.loadAll();
    } else {
      this.loadByCategory(this.selectedCategory);
    }
  }

  onSearch() {
    if (!this.searchKeyword.trim()) {
      this.filteredProducts = this.products;
      return;
    }
    this.loading = true;
    this.productService.searchByKeyword(this.searchKeyword).subscribe({
      next: (res) => {
        this.filteredProducts = res.content || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  addToCart(productId: number) {
    this.cartService.addProduct(productId, 1).subscribe({
      next: () => alert('Added to cart!'),
      error: (err) => alert(err.error?.message || 'Failed to add to cart'),
    });
  }
}
