import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  loading = true;
  error = '';

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading = true;
    this.error = '';
    this.cartService.getMyCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Could not load cart.';
        this.loading = false;
      },
    });
  }

  increaseQty(productId: number) {
    this.cartService.updateQuantity(productId, 'increase').subscribe({
      next: (cart) => (this.cart = cart),
      error: (err) => alert(err.error?.message || 'Failed'),
    });
  }

  decreaseQty(productId: number) {
    this.cartService.updateQuantity(productId, 'delete').subscribe({
      next: (cart) => (this.cart = cart),
      error: (err) => alert(err.error?.message || 'Failed'),
    });
  }

  removeProduct(product: Product) {
    if (!this.cart) return;
    this.cartService.removeProduct(this.cart.cartId, product.productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => alert(err.error?.message || 'Failed to remove'),
    });
  }
}
