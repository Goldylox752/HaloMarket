// ========================================
// Halo Marketplace
// utils/email.js
// Email Service
// ========================================

const nodemailer = require("nodemailer");

// ========================================
// Email Transport
// ========================================

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// ========================================
// Send Email
// ========================================

const sendEmail = async ({
    to,
    subject,
    html,
    text
}) => {

    const mailOptions = {
        from: `"Halo Marketplace" <${process.env.SMTP_FROM}>`,
        to,
        subject,
        text,
        html
    };

    return transporter.sendMail(mailOptions);
};

// ========================================
// Email Verification
// ========================================

const sendVerificationEmail = async (
    user,
    verificationUrl
) => {

    return sendEmail({
        to: user.email,
        subject: "Verify Your Email",
        text: `Verify your account: ${verificationUrl}`,
        html: `
            <h2>Welcome to Halo Marketplace</h2>

            <p>Hello ${user.firstName},</p>

            <p>Thanks for creating an account.</p>

            <p>Please verify your email address by clicking below.</p>

            <p>
                <a href="${verificationUrl}">
                    Verify My Email
                </a>
            </p>

            <p>If you didn't create this account, you can ignore this email.</p>
        `
    });

};

// ========================================
// Password Reset
// ========================================

const sendPasswordResetEmail = async (
    user,
    resetUrl
) => {

    return sendEmail({
        to: user.email,
        subject: "Reset Your Password",
        text: `Reset your password here: ${resetUrl}`,
        html: `
            <h2>Password Reset</h2>

            <p>Hello ${user.firstName},</p>

            <p>Click the button below to reset your password.</p>

            <p>
                <a href="${resetUrl}">
                    Reset Password
                </a>
            </p>

            <p>This link expires shortly for your security.</p>
        `
    });

};

// ========================================
// Order Confirmation
// ========================================

const sendOrderConfirmation = async (
    user,
    order
) => {

    return sendEmail({
        to: user.email,
        subject: `Order #${order.orderNumber} Confirmed`,
        text: `Your order has been received.`,
        html: `
            <h2>Order Confirmed</h2>

            <p>Hello ${user.firstName},</p>

            <p>Thanks for shopping with Halo Marketplace.</p>

            <p><strong>Order Number:</strong> ${order.orderNumber}</p>

            <p><strong>Total:</strong> $${order.total}</p>

            <p>We'll notify you when your order ships.</p>
        `
    });

};

// ========================================
// Order Shipped
// ========================================

const sendShippingNotification = async (
    user,
    order,
    trackingNumber
) => {

    return sendEmail({
        to: user.email,
        subject: `Your Order Has Shipped`,
        text: `Tracking Number: ${trackingNumber}`,
        html: `
            <h2>Your Order Is On The Way</h2>

            <p>Hello ${user.firstName},</p>

            <p>Your order <strong>#${order.orderNumber}</strong> has shipped.</p>

            <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        `
    });

};

// ========================================
// Welcome Email
// ========================================

const sendWelcomeEmail = async (user) => {

    return sendEmail({
        to: user.email,
        subject: "Welcome to Halo Marketplace",
        text: "Welcome!",
        html: `
            <h2>Welcome ${user.firstName}!</h2>

            <p>Your account has been created successfully.</p>

            <p>Start buying and selling today.</p>
        `
    });

};

// ========================================
// Contact Form
// ========================================

const sendContactMessage = async ({
    name,
    email,
    subject,
    message
}) => {

    return sendEmail({
        to: process.env.CONTACT_EMAIL,
        subject: `[Contact] ${subject}`,
        text: message,
        html: `
            <h2>New Contact Form Submission</h2>

            <p><strong>Name:</strong> ${name}</p>

            <p><strong>Email:</strong> ${email}</p>

            <p><strong>Subject:</strong> ${subject}</p>

            <hr>

            <p>${message}</p>
        `
    });

};

// ========================================
// Verify SMTP Connection
// ========================================

const verifyConnection = async () => {
    return transporter.verify();
};

// ========================================
// Exports
// ========================================

module.exports = {

    transporter,

    sendEmail,

    sendVerificationEmail,

    sendPasswordResetEmail,

    sendOrderConfirmation,

    sendShippingNotification,

    sendWelcomeEmail,

    sendContactMessage,

    verifyConnection

};
