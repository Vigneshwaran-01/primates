import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'gangadharanking02@gmail.com',
    pass: process.env.GMAIL_APP_PASS,
  },
});

export async function sendOrderNotification(order: any, user: any) {
  const html = `
    <h2>New Order Received</h2>
    <p><b>Order ID:</b> ${order.id}</p>
    <p><b>User:</b> ${user.email} (${user.username})</p>
    <p><b>Order Total:</b> $${order.totalAmount}</p>
    <h3>Order Items:</h3>
    <ul>
      ${order.OrderItems?.map((item: any) => `<li>${item.quantity} x ${item.product?.name || item.name} ($${item.unitPrice || item.price})</li>`).join('')}
    </ul>
  `;
  await transporter.sendMail({
    from: 'gangadharanking02@gmail.com',
    to: 'primatefitnezclub@gmail.com',
    subject: `New Order #${order.id}`,
    html,
  });
}

export async function sendOrderConfirmationToUser(order: any, user: any) {
  const html = `
    <h2>Thank you for your order!</h2>
    <p>Your payment was successful and your order has been placed.</p>
    <p><b>Order ID:</b> ${order.id}</p>
    <p><b>Status:</b> ${order.status}</p>
    <p><b>Total:</b> $${order.totalAmount}</p>
    <h3>Order Items:</h3>
    <ul>
      ${order.OrderItems?.map((item: any) => `<li>${item.quantity} x ${item.product?.name || item.name} ($${item.unitPrice || item.price})</li>`).join('')}
    </ul>
    <p>You can check your order status and details at any time by visiting your <a href="https://localhost:3000/account/dashboard">account dashboard</a>.</p>
  `;
  await transporter.sendMail({
    from: 'gangadharanking02@gmail.com',
    to: user.email,
    subject: `Order Confirmation - Order #${order.id}`,
    html,
  });
}

export async function sendOrderStatusUpdateToUser(order: any, user: any) {
  const html = `
    <h2>Your Order Status Has Been Updated</h2>
    <p><b>Order ID:</b> ${order.id}</p>
    <p><b>New Status:</b> ${order.status}</p>
    ${order.trackingNumber ? `<p><b>Tracking Number:</b> ${order.trackingNumber}</p>` : ''}
    <p>You can check your order status and details at any time by visiting your <a href="https://localhost:3000/account/dashboard">account dashboard</a>.</p>
  `;
  await transporter.sendMail({
    from: 'gangadharanking02@gmail.com',
    to: user.email,
    subject: `Order Update - Order #${order.id}`,
    html,
  });
} 