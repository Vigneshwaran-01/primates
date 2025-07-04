const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clean up (order matters due to foreign keys)
  // await prisma.orderItem.deleteMany();
  // await prisma.shippingDetail.deleteMany();
  // await prisma.payment.deleteMany();
  // await prisma.order.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.category.deleteMany();
  // await prisma.user.deleteMany();
  // await prisma.admin.deleteMany();



  const clothing = await prisma.category.create({
    data: {
      name: 'Clothing',
      description: 'Men and women clothing',
      isActive: true
    }
  });

 



  // const tshirt = await prisma.product.create({
  //   data: {
  //     name: "Men's Gym Tank Top - Breathable Mesh",
  //     description: 'Breathable and lightweight tank top for maximum ventilation during workouts. Ideal for hot weather or intense training. Quick-drying fabric.',
  //     price: 30,
  //     categoryId: clothing.id,
  //     stockQuantity: 150,
  //     sku: 'CLOTH-TANK-M',
  //     imageUrl: 'https://res.cloudinary.com/dqobnxxos/image/upload/v1749918098/photo-1635105864405-3e75f624d8aa_hsjtc6.jpg',
  //     additionalImages: [
  //       "https://res.cloudinary.com/dqobnxxos/image/upload/v1749917840/photo-1727291332582-2a3ae6214dbe_hzwk9z.jpg",
  //       "https://res.cloudinary.com/dqobnxxos/image/upload/v1749916919/photo-1691916164439-eb672243bdc7_kgbpef.jpg",
  //       "https://res.cloudinary.com/dqobnxxos/image/upload/v1749918098/photo-1635105864405-3e75f624d8aa_hsjtc6.jpg",
  //       "https://res.cloudinary.com/dqobnxxos/image/upload/v1749917840/photo-1727291332582-2a3ae6214dbe_hzwk9z.jpg",
  //     ],
  //     sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  //     colors: ["red", "blue", "green", "black", "white", "gray"],
  //     specifications: {
  //       "Material": "Cotton Blend",
  //       "Fit": "Relaxed",
  //       "Neck": "Crew Neck",
  //       "Sleeve Length": "Sleeveless"
  //     },
  //     deliveryInfo: "Delivery within 5–7 business days. Free shipping on orders over ₹500.",
  //     isFeatured: true,
  //     isActive: true
  //   }
  // });
  
// 🧥 Urban Style Zip Hoodie
await prisma.product.upsert({
  where: { sku: "CLOTH-HOODIE-ZIP" },
  update: {}, // No update, skip if exists
  create: {
    name: "Unisex Urban Zip Hoodie - Soft Fleece",
    description: "Premium zip-up hoodie with fleece lining. Streetwear look with max comfort for travel and training.",
    price: 60,
    categoryId: clothing.id,
    stockQuantity: 80,
    sku: "CLOTH-HOODIE-ZIP",
    imageUrl: 'https://res.cloudinary.com/dqobnxxos/image/upload/v1751390508/photo-1731695603883-804df24274bf_rpnrgy.jpg',
    additionalImages: [
      "https://res.cloudinary.com/dqobnxxos/image/upload/v1751390926/photo-1651469268391-ac0002638663_n9pjwq.jpg",
      "https://res.cloudinary.com/dqobnxxos/image/upload/v1751391008/photo-1576693239181-317efff553bb_ejv4si.jpg"
    ],
    sizes: ["M", "L", "XL", "2XL", "3XL"],
    colors: ["black", "white", "olive", "burgundy"],
    specifications: {
      "Material": "Cotton Fleece",
      "Fit": "Oversized",
      "Closure": "Full Zip",
      "Hood": "Adjustable Drawstring"
    },
    deliveryInfo: "Delivered in 3–5 business days. COD available.",
    isFeatured: false,
    isActive: true,
  }
});

// 🥇 Performance Compression T-Shirt
await prisma.product.upsert({
  where: { sku: "CLOTH-COMPRESSION-M" },
  update: {}, // No update if exists
  create: {
    name: "Men's Compression T-Shirt - DryFit Pro",
    description: "Tight-fit performance shirt with moisture-wicking fabric. Enhances blood circulation and muscle recovery.",
    price: 45,
    categoryId: clothing.id,
    stockQuantity: 120,
    sku: "CLOTH-COMPRESSION-M",
    imageUrl: 'https://res.cloudinary.com/dqobnxxos/image/upload/v1749917840/photo-1727291332582-2a3ae6214dbe_hzwk9z.jpg',
    additionalImages: [
      "https://res.cloudinary.com/dqobnxxos/image/upload/v1749916919/photo-1691916164439-eb672243bdc7_kgbpef.jpg",
      "https://res.cloudinary.com/dqobnxxos/image/upload/v1749918098/photo-1635105864405-3e75f624d8aa_hsjtc6.jpg",
      "https://res.cloudinary.com/dqobnxxos/image/upload/v1751391124/photo-1513269890889-8e4e362e5593_g6vwqi.jpg",
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    colors: ["black", "gray", "navy"],
    specifications: {
      "Material": "Nylon-Spandex Blend",
      "Fit": "Compression",
      "Neck": "Crew Neck",
      "SleeveLength": "Short Sleeve"
    },
    deliveryInfo: "Ships within 4–6 business days. Free shipping above ₹499.",
    isFeatured: true,
    isActive: true,
  }
});






  // Create users
  // const hashedPassword = await hash('password123', 10);
  // const john = await prisma.user.create({
  //   data: {
  //     username: 'john_doe',
  //     email: 'john@example.com',
  //     password_hash: hashedPassword,
  //     firstName: 'John',
  //     lastName: 'Doe',
  //     isActive: true
  //   }
  // });

  // const jane = await prisma.user.create({
  //   data: {
  //     username: 'jane_smith',
  //     email: 'jane@example.com',
  //     password_hash: hashedPassword,
  //     firstName: 'Jane',
  //     lastName: 'Smith',
  //     isActive: true
  //   }
  // });

  // Create admin
  // const adminPassword = await hash('admin123', 10);
  // await prisma.admin.create({
  //   data: {
  //     username: 'admin1',
  //     email: 'admin@example.com',
  //     password_hash: adminPassword,
  //     firstName: 'Admin',
  //     lastName: 'User',
  //     role: 'super_admin',
  //     isActive: true
  //   }
  // });

  // Create order with nested items and shipping details
  // const order = await prisma.order.create({
  //   data: {
  //     userId: john.id,
  //     totalAmount: 629.98,
  //     status: 'processing',
  //     paymentStatus: 'paid',
  //     OrderItems: {
  //       create: [
  //         {
  //           productId: smartphone.id,
  //           quantity: 1,
  //           unitPrice: 599.99
  //         },
  //         {
  //           productId: tshirt.id,
  //           quantity: 1,
  //           unitPrice: 30
  //         }
  //       ]
  //     },
  //     ShippingDetails: {
  //       create: {
  //         firstName: 'John',
  //         lastName: 'Doe',
  //         email: 'john@example.com',
  //         phoneNumber: '1234567890',
  //         addressLine1: '123 Main St',
  //         city: 'New York',
  //         state: 'NY',
  //         country: 'USA',
  //         postalCode: '10001'
  //       }
  //     },
  //     Payments: {
  //       create: {
  //         paymentMethod: 'credit_card',
  //         transactionId: 'txn_123456789',
  //         amount: 629.98,
  //         status: 'paid'
  //       }
  //     }
  //   },
  //   include: {
  //     OrderItems: true,
  //     ShippingDetails: true,
  //     Payments: true
  //   }
  // });

  console.log('Database seeded successfully!');
  console.log('Created order:', order);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });