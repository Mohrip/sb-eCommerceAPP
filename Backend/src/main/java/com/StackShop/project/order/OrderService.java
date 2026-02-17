package com.StackShop.project.order;

import jakarta.transaction.Transactional;

public interface OrderService {

    @Transactional
    OrderDTO placeOrder(String emailId, String paymentMethod, Integer addressId, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage);

}
