import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBWFMD3kAiX3t3rQrA845lo5dV55skmkLc",
  authDomain: "pos-flow-f023e.firebaseapp.com",
  projectId: "pos-flow-f023e",
  storageBucket: "pos-flow-f023e.firebasestorage.app",
  messagingSenderId: "1031986051012",
  appId: "1:1031986051012:web:9e8c3370202bb48993d691"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dummyOrders = [
  {
    orderId: "104100",
    customerName: "Alice Smith",
    orderType: "Take Away",
    status: "New",
    items: [
      { name: "Double Cheeseburger", quantity: 2, notes: "No pickles" },
      { name: "Large Fries", quantity: 1, notes: "" }
    ],
    itemsSummary: "Double Cheeseburger x2, Large Fries",
    totalQuantity: 3
  },
  {
    orderId: "104101",
    customerName: "Bob Jones",
    orderType: "Delivery",
    status: "Preparing",
    items: [
      { name: "Pepperoni Pizza (12-inch)", quantity: 1, notes: "Extra cheese" },
      { name: "Garlic Bread", quantity: 1, notes: "Extra crispy" }
    ],
    itemsSummary: "Pepperoni Pizza x1, Garlic Bread x1",
    totalQuantity: 2
  },
  {
    orderId: "104102",
    customerName: "Charlie Brown",
    orderType: "Take Away",
    status: "Ready",
    items: [
      { name: "Vegan Wrap", quantity: 1, notes: "No mayo" },
      { name: "Iced Tea", quantity: 2, notes: "Less ice" }
    ],
    itemsSummary: "Vegan Wrap x1, Iced Tea x2",
    totalQuantity: 3
  },
  {
    orderId: "104103",
    customerName: "Diana Prince",
    orderType: "Take Away",
    status: "New",
    items: [
      { name: "Spicy Chicken Sandwich", quantity: 1, notes: "Extra spicy" }
    ],
    itemsSummary: "Spicy Chicken Sandwich x1",
    totalQuantity: 1
  }
];

async function seed() {
  try {
    for (const order of dummyOrders) {
      await addDoc(collection(db, "orders"), {
        ...order,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Added order ${order.orderId}`);
    }
    console.log("Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding:", err);
    process.exit(1);
  }
}

seed();
