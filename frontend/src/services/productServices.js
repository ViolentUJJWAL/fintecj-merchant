import api from "./api"; // Import the Axios instance
import { toast } from "react-toastify";

const ProductService = {
  // Utility to handle API calls with toast.promise
  async apiCallWithToast(promise, messages) {
    return toast.promise(
      promise,
      {
        pending: messages.pending || "Processing...",
        success: messages.success || "Operation successful!",
        error: {
          render({ data }) {
            // Extract backend error message if available
            return data?.response?.data?.error || "An error occurred!";
          },
        },
      }
    );
  },

  // Fetch all products
  async getAllProducts() {
    try {
      const response = await api.get("/product");
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  },

  // Fetch product by ID
  async getProductById(productId) {
    try {
      console.log(productId)
      const response = await api.get(`/product/${productId}`);
      console.log(response)
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  },

  // Add a new product
  async addProduct(productData) {
    return this.apiCallWithToast(
      api.post("/product", productData, {
        headers: {
          'Content-Type': 'multipart/form-data',
      },
      } ),
      {
        pending: "Adding product...",
        success: "Product added successfully!",
        error: "Failed to add product!",
      }
    ).then(response => response.data.product);
  },

  // Update an existing product
  async updateProduct(productId, productData) {
    return this.apiCallWithToast(
      api.put(`/product/${productId}`, productData),
      {
        pending: "Updating product...",
        success: "Product updated successfully!",
        error: "Failed to update product!",
      }
    ).then(response => response.data);
  },

  // Delete a product
  async deleteProduct(productId) {
    console.log(productId)
    return this.apiCallWithToast(
      api.delete(`/product/${productId}`),
      {
        pending: "Deleting product...",
        success: "Product deleted successfully!",
        error: "Failed to delete product!",
      }
    ).then(response => response.data);
  },
  async getProductStatistics() {
    try {
      const response = await api.get(`product/statistics`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  },
  async getLatestProduct() {
    try {
      const response = await api.get(`product/latest-product`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  },
  

  // Generic error handler
  handleError(error) {
    const errorMessage = error.response?.data?.error || "An unexpected error occurred!";
    toast.error(errorMessage); // Show a toast for generic errors
    throw error; // Re-throw the error for additional handling
  },
};

export default ProductService;
