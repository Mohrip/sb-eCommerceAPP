import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AddressService } from '../../services/address.service';
import { OrderService } from '../../services/order.service';
import { Cart } from '../../models/cart.model';
import { Address } from '../../models/address.model';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  cart: Cart | null = null;
  addresses: Address[] = [];
  selectedAddressId: number | null = null;
  paymentMethod = 'COD';
  loading = true;
  placing = false;
  error = '';
  success = '';

  constructor(
    private cartService: CartService,
    private addressService: AddressService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getMyCart().subscribe({
      next: (cart) => {
        this.cart = cart;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
    this.addressService.getMyAddresses().subscribe({
      next: (addrs) => {
        this.addresses = addrs;
        if (addrs.length > 0) this.selectedAddressId = addrs[0].addressId;
      },
    });
  }

  placeOrder() {
    if (!this.selectedAddressId) {
      this.error = 'Please select an address.';
      return;
    }
    this.placing = true;
    this.error = '';
    this.orderService.placeOrder(this.paymentMethod, {
      addressId: this.selectedAddressId,
      paymentMethod: this.paymentMethod,
      pgName: this.paymentMethod,
      pgPaymentId: '',
      pgStatus: 'Pending',
      pgResponseMessage: '',
    }).subscribe({
      next: (order) => {
        this.placing = false;
        this.success = `Order #${order.orderId} placed successfully!`;
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (err) => {
        this.placing = false;
        this.error = err.error?.message || 'Failed to place order.';
      },
    });
  }
}
