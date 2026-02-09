import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public auth: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (res) => {
        this.products = res.content?.slice(0, 8) || [];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
    this.categoryService.getAll().subscribe({
      next: (res) => (this.categories = res.content || []),
    });
  }

  addToCart(productId: number) {
    this.cartService.addProduct(productId, 1).subscribe({
      next: () => alert('Added to cart!'),
      error: (err) => alert(err.error?.message || 'Failed to add to cart'),
    });
  }
}
