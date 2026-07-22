# Comzilo Enterprise Backend API Documentation

Welcome to the Comzilo Backend API Documentation.

---

## 1. Authentication & Security Headers

All protected API routes require HTTP Bearer JWT token authentication and Tenant context headers:

```http
Authorization: Bearer <JWT_ACCESS_TOKEN>
X-Tenant-UUID: <TENANT_UUID>
X-Store-ID: <STORE_DATABASE_ID> (Optional for Store-specific isolation)
```

---

## 2. Standardized API Response Format

### Success Response (`200 OK`, `201 Created`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response (`400`, `401`, `403`, `404`, `422`, `500`)
```json
{
  "success": false,
  "message": "Error description message",
  "error": {
    "code": "VALIDATION_ERROR",
    "statusCode": 400,
    "details": null
  }
}
```

---

## 3. Global Query Parameters

List endpoints across all modules support standardized pagination, sorting, filtering, and search query parameters:

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | Integer | `1` | Page number |
| `limit` | Integer | `20` | Items per page (Max: `100`) |
| `sortBy` | String | `'createdAt'` | Column field to sort by |
| `sortOrder` | String | `'DESC'` | Sort direction (`ASC` or `DESC`) |
| `search` | String | `null` | Full-text query string |

---

## 4. Modules Endpoint Reference

- **Auth**: `/api/v1/auth` (`login`, `register`, `refresh`, `logout`, `profile`)
- **Tenants & Stores**: `/api/v1/tenants`, `/api/v1/stores`
- **Catalog**: `/api/v1/products`, `/api/v1/categories`, `/api/v1/brands`, `/api/v1/collections`, `/api/v1/tags`
- **Inventory**: `/api/v1/inventory`, `/api/v1/warehouses`, `/api/v1/stock-movements`, `/api/v1/stock-adjustments`, `/api/v1/stock-transfers`, `/api/v1/stock-reservations`
- **Customers**: `/api/v1/customers`, `/api/v1/customer-addresses`, `/api/v1/customer-documents`
- **Orders**: `/api/v1/orders`, `/api/v1/invoices`
- **Payments**: `/api/v1/payments`, `/api/v1/refunds`
- **POS**: `/api/v1/pos`, `/api/v1/receipts`
- **Reporting**: `/api/v1/reports`
- **Notifications**: `/api/v1/notifications`, `/api/v1/notification-templates`, `/api/v1/notification-preferences`
- **Settings & Config**: `/api/v1/settings`, `/api/v1/tenant-settings`, `/api/v1/store-settings`, `/api/v1/configuration`
- **Webhooks & Integrations**: `/api/v1/webhooks`, `/api/v1/integrations`
- **Swagger Interactive UI**: `/api/v1/docs` or `/docs`
