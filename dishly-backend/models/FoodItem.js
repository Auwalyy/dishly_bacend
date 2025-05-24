import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Food item name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters'],
        index: true // For faster search
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative'],
        max: [1000, 'Price seems unrealistically high']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['appetizer', 'main course', 'dessert', 'beverage', 'side dish', 'combo meal'],
            message: '{VALUE} is not a valid category'
        },
        index: true
    },
    vendor: { // Changed from vendorId to vendor for consistency
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming vendors are Users with role='vendor'
        required: true,
        index: true
    },
    preparationTime: { // Important for food delivery
        type: Number,
        required: true,
        min: [5, 'Minimum preparation time is 5 minutes'],
        max: [180, 'Maximum preparation time is 3 hours'],
        default: 15
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    imageUrl: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
            },
            message: props => `${props.value} is not a valid URL!`
        }
    },
    ingredients: {
        type: [String],
        required: [true, 'At least one ingredient is required'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'At least one ingredient is required'
        }
    },
    dietaryTags: {
        type: [String],
        enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'spicy']
    },
    popularityScore: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt automatically
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Index for frequently searched fields
FoodItemSchema.index({ name: 'text', description: 'text' });

// Virtual for formatted price
FoodItemSchema.virtual('formattedPrice').get(function() {
    return `$${this.price.toFixed(2)}`;
});

// Pre-save hook for data validation
FoodItemSchema.pre('save', function(next) {
    if (this.price > 100 && this.category === 'beverage') {
        this.isAvailable = false; // Auto-disable unrealistically priced beverages
    }
    next();
});

const FoodItem = mongoose.model('FoodItem', FoodItemSchema);