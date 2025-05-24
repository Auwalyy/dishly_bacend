import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem', // Changed from 'Product' to 'FoodItem' for consistency
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 20 // Prevent unrealistic quantities
    },
    priceAtOrder: { // Snapshot of price when ordered
        type: Number,
        required: true
    },
    specialInstructions: {
        type: String,
        trim: true,
        maxlength: 200
    }
}, { _id: false }); // Prevents automatic ID for subdocuments

const OrderSchema = new mongoose.Schema({
    customer: { // Changed from 'user' to be more specific
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Faster querying
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Changed from 'Vendor' since vendors are Users with role='vendor'
        required: true,
        index: true
    },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: [ // Ensure at least one item
            val => val.length > 0,
            'Order must have at least one item'
        ]
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    deliveryAddress: { // Important for food delivery
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: { // Track payment separately
        type: String,
        enum: ['pending', 'paid', 'refunded', 'failed'],
        default: 'pending'
    },
    deliveryTime: { // Estimated/actual delivery time
        type: Date
    },
    cancellationReason: { // If order is cancelled
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }, // Include virtuals when converted to JSON
    toObject: { virtuals: true }
});

// Add virtual for order duration (time from creation to delivery)
OrderSchema.virtual('duration').get(function() {
    if (this.status === 'delivered' && this.deliveryTime) {
        return this.deliveryTime - this.createdAt;
    }
    return null;
});

OrderSchema.index({ customer: 1, status: 1 });
OrderSchema.index({ vendor: 1, status: 1 });
OrderSchema.index({ createdAt: -1 }); // Sort by newest first

const Order = mongoose.model('Order', OrderSchema);