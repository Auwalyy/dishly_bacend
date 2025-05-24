const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email'],
        index: true // Add index for faster queries
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false // Prevents password from being returned in queries
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[\d\+\-\(\)\s]{10,15}$/, 'Please enter a valid phone number'], // More flexible phone format
    },
    address: {
        type: String,
        required: function() { // Make required only for vendors
            return this.role === 'vendor';
        },
        trim: true
    },
    role: {
        type: String,
        enum: ['vendor', 'user'],
        default: 'user',
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    // Vendor-specific fields (only relevant when role='vendor')
    restaurantName: {
        type: String,
        required: function() {
            return this.role === 'vendor';
        },
        trim: true
    },
    restaurantDescription: {
        type: String,
        trim: true
    },
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

UserSchema.index({ email: 1, role: 1 });

const User = mongoose.model('User', UserSchema);