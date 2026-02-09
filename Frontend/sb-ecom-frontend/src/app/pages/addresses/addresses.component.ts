import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AddressService } from '../../services/address.service';
import { Address } from '../../models/address.model';

@Component({
  selector: 'app-addresses',
  imports: [FormsModule],
  templateUrl: './addresses.component.html',
})
export class AddressesComponent implements OnInit {
  addresses: Address[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;

  form: Partial<Address> = {
    street: '', buildingName: '', city: '', state: '', zipCode: '', country: ''
  };

  constructor(private addressService: AddressService) {}

  ngOnInit() {
    this.loadAddresses();
  }

  loadAddresses() {
    this.loading = true;
    this.addressService.getMyAddresses().subscribe({
      next: (addresses) => {
        this.addresses = addresses;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openForm(address?: Address) {
    if (address) {
      this.editingId = address.addressId;
      this.form = { ...address };
    } else {
      this.editingId = null;
      this.form = { street: '', buildingName: '', city: '', state: '', zipCode: '', country: '' };
    }
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingId = null;
  }

  saveAddress() {
    if (this.editingId) {
      this.addressService.update(this.editingId, this.form).subscribe({
        next: () => { this.closeForm(); this.loadAddresses(); },
        error: (err) => alert(err.error?.message || 'Failed to update'),
      });
    } else {
      this.addressService.create(this.form).subscribe({
        next: () => { this.closeForm(); this.loadAddresses(); },
        error: (err) => alert(err.error?.message || 'Failed to create'),
      });
    }
  }

  deleteAddress(addressId: number) {
    if (!confirm('Delete this address?')) return;
    this.addressService.delete(addressId).subscribe({
      next: () => this.loadAddresses(),
      error: (err) => alert(err.error?.message || 'Failed to delete'),
    });
  }
}
