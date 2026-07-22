'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create product_types table
    await queryInterface.createTable('product_types', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      supports_inventory: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      supports_shipping: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      supports_variants: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      supports_downloads: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      supports_virtual: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      supports_print_on_demand: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'active',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    // Seed default product types
    const now = new Date();
    await queryInterface.bulkInsert('product_types', [
      {
        code: 'physical',
        name: 'Physical Product',
        description: 'Tangible item requiring shipping and inventory management',
        supports_inventory: true,
        supports_shipping: true,
        supports_variants: false,
        supports_downloads: false,
        supports_virtual: false,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        code: 'variable',
        name: 'Variable Product',
        description: 'Product with configurable options (e.g. Size, Color)',
        supports_inventory: true,
        supports_shipping: true,
        supports_variants: true,
        supports_downloads: false,
        supports_virtual: false,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        code: 'virtual',
        name: 'Virtual Product',
        description: 'Service, subscription, meeting link, or software license',
        supports_inventory: false,
        supports_shipping: false,
        supports_variants: false,
        supports_downloads: false,
        supports_virtual: true,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        code: 'downloadable',
        name: 'Downloadable Product',
        description: 'Digital file download (PDF, ZIP, MP4, MP3)',
        supports_inventory: false,
        supports_shipping: false,
        supports_variants: false,
        supports_downloads: true,
        supports_virtual: false,
        supports_print_on_demand: false,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        code: 'print_on_demand',
        name: 'Print on Demand Product',
        description: 'Customizable canvas template with print area preview',
        supports_inventory: false,
        supports_shipping: true,
        supports_variants: false,
        supports_downloads: false,
        supports_virtual: false,
        supports_print_on_demand: true,
        status: 'active',
        created_at: now,
        updated_at: now,
      },
    ]);

    // 2. Alter products table
    await queryInterface.addColumn('products', 'product_type_id', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
      references: { model: 'product_types', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
    await queryInterface.addColumn('products', 'featured', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('products', 'cost_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'profit_margin', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'currency', {
      type: Sequelize.STRING(10),
      allowNull: false,
      defaultValue: 'USD',
    });
    await queryInterface.addColumn('products', 'track_inventory', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
    await queryInterface.addColumn('products', 'stock_status', {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: 'in_stock',
    });
    await queryInterface.addColumn('products', 'min_quantity', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'max_quantity', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'low_stock_threshold', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn('products', 'allow_backorders', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });

    // 3. product_attributes table
    await queryInterface.createTable('product_attributes', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 4. product_attribute_values table
    await queryInterface.createTable('product_attribute_values', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      attribute_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'product_attributes', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      value: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 5. product_option_sets table
    await queryInterface.createTable('product_option_sets', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      tenant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      store_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 6. product_option_values table
    await queryInterface.createTable('product_option_values', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      option_set_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'product_option_sets', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      value: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 7. product_variants table (NO STOCK COLUMN)
    await queryInterface.createTable('product_variants', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      sku: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      barcode: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      image_url: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 8. product_variant_attributes table
    await queryInterface.createTable('product_variant_attributes', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      variant_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'product_variants', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      option_value_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'product_option_values', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 9. product_prices table
    await queryInterface.createTable('product_prices', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      regular_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      sale_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      cost_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'USD',
      },
      effective_from: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      effective_to: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 10. product_media table
    await queryInterface.createTable('product_media', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      media_type: {
        type: Sequelize.ENUM('image', 'video', '360'),
        allowNull: false,
        defaultValue: 'image',
      },
      url: {
        type: Sequelize.STRING(1024),
        allowNull: false,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 11. product_downloads table
    await queryInterface.createTable('product_downloads', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      url: {
        type: Sequelize.STRING(1024),
        allowNull: false,
      },
      filename: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      file_size: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      version: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      download_limit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 12. product_seo table
    await queryInterface.createTable('product_seo', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      meta_title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      meta_description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      meta_keywords: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      og_image: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      canonical_url: {
        type: Sequelize.STRING(2048),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 13. product_shipping table
    await queryInterface.createTable('product_shipping', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      weight: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      length: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      width: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      height: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      shipping_class: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      package_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 14. product_virtuals table
    await queryInterface.createTable('product_virtuals', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      license_key: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      subscription_details: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      meeting_link: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      service_duration: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      activation_instructions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 15. product_pod_templates table
    await queryInterface.createTable('product_pod_templates', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      canvas_size: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      layers_json: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      mockup_preview_url: {
        type: Sequelize.STRING(1024),
        allowNull: true,
      },
      print_area: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    // 16. product_versions table
    await queryInterface.createTable('product_versions', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      product_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: { model: 'products', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      version_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      changed_by: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
      },
      change_summary: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('product_versions');
    await queryInterface.dropTable('product_pod_templates');
    await queryInterface.dropTable('product_virtuals');
    await queryInterface.dropTable('product_shipping');
    await queryInterface.dropTable('product_seo');
    await queryInterface.dropTable('product_downloads');
    await queryInterface.dropTable('product_media');
    await queryInterface.dropTable('product_prices');
    await queryInterface.dropTable('product_variant_attributes');
    await queryInterface.dropTable('product_variants');
    await queryInterface.dropTable('product_option_values');
    await queryInterface.dropTable('product_option_sets');
    await queryInterface.dropTable('product_attribute_values');
    await queryInterface.dropTable('product_attributes');

    await queryInterface.removeColumn('products', 'product_type_id');
    await queryInterface.removeColumn('products', 'featured');
    await queryInterface.removeColumn('products', 'cost_price');
    await queryInterface.removeColumn('products', 'profit_margin');
    await queryInterface.removeColumn('products', 'currency');
    await queryInterface.removeColumn('products', 'track_inventory');
    await queryInterface.removeColumn('products', 'stock_status');
    await queryInterface.removeColumn('products', 'min_quantity');
    await queryInterface.removeColumn('products', 'max_quantity');
    await queryInterface.removeColumn('products', 'low_stock_threshold');
    await queryInterface.removeColumn('products', 'allow_backorders');

    await queryInterface.dropTable('product_types');
  },
};
