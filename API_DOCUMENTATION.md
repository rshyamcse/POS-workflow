# 🛠️ Internal API & State Management Documentation

This project operates as a highly resilient **Offline-First Application**. Because a restaurant cannot afford to halt operations if the internet goes down, there is no reliance on an external REST API or remote database (like PostgreSQL/MongoDB) for core operations. 

Instead, the entire application state is managed by a robust internal API built using **React Context (`POSContext`)** and synchronized securely with the browser's **LocalStorage API**.

---

## 📦 Data Models

### `Order`
Represents a customer's transaction.
- `id` (string): Unique identifier.
- `orderNumber` (string): Human-readable reference (e.g., `#152932`).
- `items` (OrderItem[]): Array of items ordered.
- `status` (OrderStatus): `NEW` | `PREPARING` | `READY` | `DELIVERED`
- `createdAt` (number): Unix timestamp.
- `deliveredAt?` (number): Optional Unix timestamp when completed.

### `MenuItem`
Represents a product in the restaurant.
- `id` (string)
- `categoryId` (string)
- `name` (string)
- `price` (number)
- `image` (string): URL or path to image.

---

## 🔌 The `usePOS()` Hook (Internal API)

Components across the application consume the `usePOS()` hook to interact with the central data store. Here are the available methods and properties:

### 📖 State Properties
- **`orders: Order[]`**
  Retrieves the list of all active and historical orders.
- **`menu: MenuItem[]`**
  Retrieves the full restaurant menu.
- **`categories: Category[]`**
  Retrieves the menu categories.
- **`settings: RestaurantSettings`**
  Retrieves restaurant configurations (name, tax rate, currency, etc.).
- **`theme: 'dark' | 'light'`**
  Retrieves the current application UI theme.
- **`globalSearchQuery: string`**
  Retrieves the active search query originating from the Navbar.

### ⚡ Action Methods (Mutations)

#### `createOrder(items: Omit<OrderItem, 'id'>[]) => void`
Creates a new order, calculates totals, generates a unique `#` order number, sets the status to `NEW`, and saves it to LocalStorage.

#### `updateOrderStatus(orderId: string, status: OrderStatus) => void`
Mutates the status of an existing order. If the status is changed to `DELIVERED`, it automatically records the `deliveredAt` timestamp.

#### `setGlobalSearchQuery(query: string) => void`
Updates the global search string. This instantly triggers a reactive re-render of the `Dashboard` and `Orders` pages to filter the visible orders.

#### `toggleTheme() => void`
Switches the UI between Dark and Light mode and persists the preference.

---

## 💾 Storage Layer (LocalStorage)

The internal API automatically synchronizes with the following LocalStorage keys to ensure data persistence across page reloads:
- `qsw_orders`
- `qsw_menu`
- `qsw_categories`
- `qsw_settings`
- `qsw_theme`

## 📡 Future Remote API Integration

If you plan to connect this to a remote backend (e.g., Node.js/Express or Firebase) in the future, the architecture is already perfectly structured. You will simply swap the LocalStorage logic inside `POSContext.tsx` with standard `fetch()` or `axios` calls to your backend endpoints, and the rest of the UI will continue to work identically without any changes.
