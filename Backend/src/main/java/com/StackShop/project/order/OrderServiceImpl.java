package com.StackShop.project.order;


import com.StackShop.project.Address.Address;
import com.StackShop.project.Address.AddressRepository;
import com.StackShop.project.cart.Cart;
import com.StackShop.project.cart.CartItem;
import com.StackShop.project.cart.CartRepository;
import com.StackShop.project.cart.CartService;
import com.StackShop.project.exceptions.APIException;
import com.StackShop.project.exceptions.ResourceNotFoundException;
import com.StackShop.project.payment.Payment;
import com.StackShop.project.payment.PaymentRepository;
import com.StackShop.project.product.Product;
import com.StackShop.project.product.ProductRepository;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    CartRepository cartRepository;

    @Autowired
    AddressRepository addressRepository;
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public OrderDTO placeOrder(String emailId, String paymentMethod, Integer addressId, String pgName, String pgPaymentId, String pgStatus, String pgResponseMessage) {

        Cart cart = cartRepository.findCartByEmail(emailId);
        if (cart == null) {
            throw new ResourceNotFoundException("Cart", "User Email", emailId);
        }

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "Id", addressId.toString()));

        Order order = new Order();
        order.setEmail(emailId);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalAmount(cart.getTotalPrice());
        order.setOrderStatus("Order Accepted !");
        order.setAddress(address);

        Payment payment = new Payment(paymentMethod, pgName, pgPaymentId, pgStatus, pgResponseMessage);
        payment.setOrder(order);
        payment = paymentRepository.save(payment);
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        List<CartItem> cartItems = cart.getCartItems();
        if (cartItems.isEmpty()) {
            throw new APIException("Cannot place order with empty cart");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setDiscount(cartItem.getDiscount());
            orderItem.setOrderProductPrice(cartItem.getProductPrice());
            orderItem.setOrder(savedOrder);
            orderItems.add(orderItem);
        }

        orderItems = orderItemRepository.saveAll(orderItems);

        cart.getCartItems().forEach(cartItem -> {
            int quantity = cartItem.getQuantity();
            Product product = cartItem.getProduct();
            product.setQuantity(product.getQuantity() - quantity);
            productRepository.save(product);

            cartService.deleteProductFromCart(cart.getCartId(), cartItem.getProduct().getProductId());
        });

        OrderDTO orderDTO = modelMapper.map(savedOrder, OrderDTO.class);
        orderItems.forEach(item ->
                orderDTO.getOrderItems()
                        .add(modelMapper.map(item, OrderItemDTO.class)));

        return orderDTO;
    }
}
