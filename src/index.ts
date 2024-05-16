// Define the pricing rules interface
type PricingRules = {
  [key: string]: PricingDiscount;
};

// Define the interface for pricing discount
interface PricingDiscount {
  price: number;
  discount?: {
    quantity: number; // Quantity needed for a discount
    price: number; // Discounted price
  };
  bulkDiscount?: {
    quantity: number; // Quantity needed for bulk discount
    price: number; // Bulk discount price
  };
}

// Define the Checkout class
class Checkout {
  private pricingRules: PricingRules;
  private scannedItems: string[];

  constructor(pricingRules: PricingRules) {
    this.pricingRules = pricingRules;
    this.scannedItems = [];
  }

  // Scan an item and add it to the list of scanned items
  scan(item: string): void {
    this.scannedItems.push(item);
  }

  // Calculate the total price of all scanned items
  total(): number {
    // Initialize an object to store item counts
    const itemCounts: { [key: string]: number } = {};
    let totalPrice = 0;

    // Count items
    this.scannedItems.forEach(item => {
      if (itemCounts[item]) {
        itemCounts[item]++;
      } else {
        itemCounts[item] = 1;
      }
    });

    // Calculate total price based on pricing rules and item counts
    Object.entries(itemCounts).forEach(([sku, count]) => {
      const item = this.pricingRules[sku];
      let itemPrice = item.price * count;

      // Apply discount if applicable
      if (item.discount && count >= item.discount.quantity) {
        const discountTimes = Math.floor(count / item.discount.quantity);
        itemPrice -= discountTimes * item.discount.price;
      }

      // Apply bulk discount if applicable
      if (item.bulkDiscount && count >= item.bulkDiscount.quantity) {
        itemPrice = item.bulkDiscount.price * count;
      }

      // Add item price to total
      totalPrice += itemPrice;
    });

    // Return total price
    console.log(`This is the totalPrice so far ${totalPrice}`)
    return totalPrice;
  }
}

// Example usage and testing
const pricingRules: PricingRules = {
  ipd: { price: 549.99, bulkDiscount: { quantity: 4, price: 499.99 } },
  mbp: { price: 1399.99 },
  atv: { price: 109.50, discount: { quantity: 3, price: 109.50 } },
  vga: { price: 30.00 },
};

const co = new Checkout(pricingRules);
co.scan("atv");
co.scan("atv");
co.scan("atv");

co.total()