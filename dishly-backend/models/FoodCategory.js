import mongoose from "mongoose";

const FoodCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true,
        unique: true,
        w
        maxlength: [50, 'Category name cannot exceed 50 characters'],
        minlength: [3, 'Category name must be at least 3 characters'],
        index: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true,
        validate: {
            validator: function(v) {
                return /\.(jpg|jpeg|png|webp)$/i.test(v);
            },
            message: props => `${props.value} is not a valid image URL!`
        }
    },
    displayOrder: {
        type: Number,
        default: 0,
        min: 0
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    vendorSpecific: { // For categories that might be specific to certain vendors
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    },
    tags: {
        type: [String],
        enum: ['popular', 'seasonal', 'healthy', 'local'],
        default: []
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

FoodCategorySchema.virtual('itemCount', {
    ref: 'FoodItem',
    localField: '_id',
    foreignField: 'category',
    count: true
});

// Indexes
FoodCategorySchema.index({ name: 1, isFeatured: 1 });
FoodCategorySchema.index({ displayOrder: 1 });

FoodCategorySchema.pre('save', function(next) {
    this.name = this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
    next();
});

FoodCategorySchema.pre('remove', async function(next) {
    const count = await mongoose.model('FoodItem').countDocuments({ category: this._id });
    if (count > 0) {
        throw new Error('Cannot delete category with associated food items');
    }
    next();
});

const FoodCategory = mongoose.model('FoodCategory', FoodCategorySchema);