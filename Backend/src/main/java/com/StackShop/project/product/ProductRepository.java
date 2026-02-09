package com.StackShop.project.product;

import com.StackShop.project.category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Use JOIN FETCH to load category eagerly and avoid N+1 problem
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category")
    List<Product> findAllWithCategory();

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category WHERE p.category = :category ORDER BY p.price ASC")
    List<Product> findByCategoryOrderByPriceAsc(@Param("category") Category category);

    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.category WHERE LOWER(p.productName) LIKE LOWER(:keyword)")
    List<Product> findByProductNameLikeIgnoreCase(@Param("keyword") String keyword);
}
