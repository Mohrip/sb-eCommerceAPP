package com.StackShop.project.product;


import com.StackShop.project.category.Category;
import com.StackShop.project.category.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

@Autowired
private ProductRepository productRepository;

@Autowired
private CategoryRepository categoryRepository;

@Autowired
private ModelMapper modelMapper;

    @Override
    public ProductDTO addProduct(Long categoryId, ProductDTO productDTO) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Category not found with id: " + categoryId));

        // I used this modelmapper because I used Product everywhere else it will give error
        Product product = modelMapper.map(productDTO, Product.class);
        product.setImage("default.png");
        product.setCategory(category);
        double specialPrice = product.getPrice() - (product.getPrice() * product.getDiscount() / 100);
        product.setSpecialPrice(specialPrice);
        Product savedProduct = productRepository.save(product);
        return modelMapper.map(savedProduct, ProductDTO.class);
    }

    @Override
    public ProductResponse getAllProducts() {
        // Use optimized query with JOIN FETCH to avoid N+1 problem
        List<Product> products = productRepository.findAllWithCategory();
        List<ProductDTO> productDTOs = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOs);
        return productResponse;

    }

    @Override
    public ProductResponse searchByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Category not found with id: " + categoryId));

       List<Product> products = productRepository.findByCategoryOrderByPriceAsc(category);
         List<ProductDTO> productDTOs = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();
        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOs);
        return productResponse;

    }

    @Override
    public ProductResponse searchProductByKeyword(String keyword) {

        List<Product> products = productRepository.findByProductNameLikeIgnoreCase('%' + keyword + '%');
        List<ProductDTO> productDTOs = products.stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .toList();
        ProductResponse productResponse = new ProductResponse();
        productResponse.setContent(productDTOs);
        return productResponse;    }

    @Override
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        // Get the existing product from the database
        // then update its details and save it back to the database
        Product existingProduct = productRepository.findById(productId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Product not found with id: " + productId));

        Product product = modelMapper.map(productDTO, Product.class);
        existingProduct.setProductName(product.getProductName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setQuantity(product.getQuantity());
        existingProduct.setDiscount(product.getDiscount());
        existingProduct.setPrice(product.getPrice());
        double specialPrice = product.getPrice() - (product.getPrice() * product.getDiscount() / 100);
        existingProduct.setSpecialPrice(specialPrice);

        Product updatedProduct = productRepository.save(existingProduct);

        return modelMapper.map(updatedProduct, ProductDTO.class);
    }

    @Override
    public void deleteProduct(Long productId) {
        Product existingProduct = productRepository.findById(productId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Product not found with id: " + productId));
        productRepository.delete(existingProduct);

    }


    @Override
    public ProductDTO updateProductImage(Long productId, MultipartFile image) throws IOException {
        Product ProductFromDb = productRepository.findById(productId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Product not found with id: " + productId));
        String path = "images/";
        String fileName = uploadImage(path, image);
        ProductFromDb.setImage(fileName);
        Product updatedProduct = productRepository.save(ProductFromDb);

        return modelMapper.map(updatedProduct, ProductDTO.class);
    }

    private String uploadImage(String path, MultipartFile file) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String randomId = UUID.randomUUID().toString();
        String fileName = randomId.concat(originalFileName.substring(originalFileName.lastIndexOf(".")));
        String filePath = path + File.separator + fileName;


        File folder = new File(path);
        if (!folder.exists()) {
            folder.mkdirs();
        }

            Files.copy(file.getInputStream(), Paths.get(filePath));

        return fileName;

    }
}
