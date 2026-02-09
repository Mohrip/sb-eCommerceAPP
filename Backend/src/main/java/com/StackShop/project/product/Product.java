package com.StackShop.project.product;

import com.StackShop.project.cart.CartItem;
import com.StackShop.project.category.Category;
import com.StackShop.project.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products", indexes = {
    @Index(name = "idx_product_name", columnList = "productName"),
    @Index(name = "idx_product_category", columnList = "category_id")
})
@ToString(exclude = {"products", "user", "category"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long productId;

    @NotBlank
    @Size(min = 3, message = "Product name must be at least 3 characters long")
    private String productName;
    private String image;

    @NotBlank
    @Size(min = 6, message = "Description must be at least 6 characters long")
    private String description;
    private Integer quantity;
    private double price;
    private double discount;
    private double specialPrice;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private User user;

    @OneToMany(mappedBy = "product", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<CartItem> products = new ArrayList<>();

    public Double getspecialPrice() {
        return specialPrice;

    }
}
