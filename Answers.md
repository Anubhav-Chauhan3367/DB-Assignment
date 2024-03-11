## 1. Explain the relationship between the "Product" and "Product_Category" entities from the above diagram.
**Ans:** "Product_Category" and "Product" entities have a one-to-many relationship.<br/>
 - **One product can belong to one category:** A product can only be categorized under a single category at a time. This is enforced by the foreign key category_id in the "Product" table. This foreign key references the primary key (id) of the "Product_Category" table.<br/>
 - **One category can have many products:** A single category can have multiple products associated with it.

## 2. How could you ensure that each product in the "Product" table has a valid category assigned to it?

**Ans:** There are some ways to ensure that each product in the "Product" table has a valid category assigned to it:


#### **1. Database Constraints:**

-   **Foreign Key Constraint:** The existing foreign key `category_id` in the "Product" table can be set as a `FOREIGN KEY REFERENCES product_category(id) ON DELETE RESTRICT`. This enforces referential integrity.
    
    -   `ON DELETE RESTRICT`  clause prevents deleting a category from the "Product_Category" table if there are products referencing it. This ensures products with invalid category IDs won't be created.
-   **Check Constraint:** We can add a check constraint on the `category_id` column in the "Product" table. This constraint would verify if the referenced category ID exists in the "Product_Category" table. This can be done using CHECK constraint in SQL.
    

#### **2. Application Logic:**

-   **Validation on Product Creation:** During product creation within in the application, we can implement validation to ensure a valid category ID is chosen before saving the product. This could involve displaying a dropdown list with only valid categories or checking the entered category ID against existing categories before creating the product entry.
    
-   **Default Category:** Define a default category (e.g., "Uncategorized") in the "Product_Category" table. If a product is created without a specified category ID, set the `category_id` to the default category's ID by default. This prevents products from being completely without a category assignment.



#### **3. Mongoose Schema Validation:**

-   We can define validation rules for the  `category_id`  field in the product schema. 

For example:

JavaScript

```
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // ... other product fields
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'ProductCategory' // reference the ProductCategory model name
  }
});

// Validation using custom function
productSchema.pre('save', async function(next) {
  const ProductCategory = mongoose.model('ProductCategory');
  const validCategory = await ProductCategory.findById(this.category_id);
  if (!validCategory) {
    throw new Error('Invalid category ID');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
```
