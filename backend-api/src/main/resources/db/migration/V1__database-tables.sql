CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE categories (
    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    category_name VARCHAR(200) NOT NULL,
    category_slug VARCHAR(200) NOT NULL,
    category_description VARCHAR(3000) NOT NULL,
    category_image_url VARCHAR(300) NOT NULL,
    category_total_products INTEGER NOT NULL,
    category_active BOOL NOT NULL
);

CREATE TABLE users (
    user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL
);


CREATE TABLE ingredients (
    ingredient_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    ingredient_name VARCHAR(50)
);

CREATE TABLE sub_categories (
    sub_category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sub_category_name VARCHAR(50),
    sub_category_category_id INT,
    FOREIGN KEY (sub_category_category_id) REFERENCES categories(category_id)
);

CREATE TABLE products (
    product_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_type VARCHAR(20),
    product_category INT,
    product_sub_category INT,
    product_slug VARCHAR(100) NOT NULL,
    product_image VARCHAR(300) NOT NULL,
    product_price DECIMAL NOT NULL,
    product_discount_price DECIMAL NOT NULL,
    product_description VARCHAR(1000),
    product_complete_description VARCHAR(3000) NOT NULL,
    product_how_to_use VARCHAR(3000) NOT NULL,
    product_active BOOL NOT NULL,
    product_create_at TIMESTAMP,
    product_update_at TIMESTAMP,
    FOREIGN KEY (product_category) REFERENCES categories(category_id),
    FOREIGN KEY (product_sub_category) REFERENCES sub_categories(sub_category_id)
);

CREATE TABLE product_attributes (
  product_id   INT NOT NULL,
  attr_key     VARCHAR(255) NOT NULL,
  attr_value   VARCHAR(2000),
  PRIMARY KEY (product_id, attr_key),
  CONSTRAINT fk_product_attrs_product
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);
CREATE INDEX idx_product_attrs_key ON product_attributes (attr_key);
CREATE INDEX idx_product_attrs_val_gin ON product_attributes USING gin (attr_value gin_trgm_ops); -- opcional (extensão pg_trgm)


CREATE TABLE tags (
    tag_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tag_name VARCHAR(50)
);

CREATE TABLE product_ingredient (
    product_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    PRIMARY KEY (product_id, ingredient_id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_ingredient FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE
);

CREATE TABLE product_tag (
    product_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT fk_tag FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

