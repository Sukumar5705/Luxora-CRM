require('dotenv').config();
const mongoose = require('mongoose');
const Property = require('./models/Property');
const User     = require('./models/User');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Property.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Admin user
    const admin = await User.create({
      name: 'Admin User', email: 'admin@luxestate.com',
      password: 'admin123', phone: '+91 98765 43210', role: 'admin',
    });
    console.log('👤 Admin: admin@luxestate.com / admin123');

    // Sample user
    await User.create({
      name: 'John Doe', email: 'user@estatex.com',
      password: 'user1234', phone: '+91 90000 11111', role: 'user',
    });
    console.log('👤 User: user@estatex.com / user1234');

    const properties = [
      {
        title: 'Luxury 4BHK Villa with Private Pool',
        description: 'An exquisite villa nestled in the heart of Jubilee Hills, featuring premium marble flooring, designer kitchen, private pool, and breathtaking panoramic views of the city. This is the epitome of luxury living with every amenity you could imagine.',
        price: 25000000, type: 'sale', category: 'villa', status: 'available',
        location: { address: '45, Road No. 12, Jubilee Hills', city: 'Hyderabad', state: 'Telangana', zipCode: '500033' },
        features: { bedrooms: 4, bathrooms: 4, area: 4500, parking: true, furnished: true, pool: true, gym: true, balcony: true },
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
        ],
        amenities: ['24/7 Security', 'CCTV Surveillance', 'Power Backup', 'Landscaped Garden', 'Home Theatre'],
        featured: true, postedBy: admin._id,
      },
      {
        title: 'Modern 3BHK Apartment in Banjara Hills',
        description: 'Stylishly designed apartment in the premium locality of Banjara Hills. Fully furnished with top-of-the-line appliances, wooden flooring, and a spacious balcony with garden view.',
        price: 55000, type: 'rent', category: 'apartment', status: 'available',
        location: { address: '12, Road No. 3, Banjara Hills', city: 'Hyderabad', state: 'Telangana', zipCode: '500034' },
        features: { bedrooms: 3, bathrooms: 2, area: 1800, parking: true, furnished: true, balcony: true },
        images: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
        ],
        amenities: ['Gym', 'Club House', 'Power Backup', 'Visitor Parking', 'Children Play Area'],
        featured: true, postedBy: admin._id,
      },
      {
        title: 'Premium Commercial Office Space in HITEC City',
        description: 'Grade A commercial office space in the thriving HITEC City business district. Modern open-plan layout with dedicated server room, conference halls, and stunning skyline views.',
        price: 120000, type: 'rent', category: 'commercial', status: 'available',
        location: { address: 'Block C, Cyber Towers, HITEC City', city: 'Hyderabad', state: 'Telangana', zipCode: '500081' },
        features: { bedrooms: 0, bathrooms: 4, area: 5000, parking: true, furnished: false },
        images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
        amenities: ['24/7 Security', 'Power Backup', 'CCTV', 'Cafeteria', 'Conference Room'],
        featured: false, postedBy: admin._id,
      },
      {
        title: 'Elegant 2BHK in Gachibowli IT Hub',
        description: 'Tastefully designed 2BHK apartment in the IT hub of Hyderabad. Easy access to major tech parks. Semi-furnished with modular kitchen and premium bathroom fittings.',
        price: 7500000, type: 'sale', category: 'apartment', status: 'available',
        location: { address: '5, Silicon Valley Layout', city: 'Hyderabad', state: 'Telangana', zipCode: '500032' },
        features: { bedrooms: 2, bathrooms: 2, area: 1250, parking: true, furnished: false, balcony: true },
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
        amenities: ['Power Backup', 'Lift', 'Intercom', 'Fire Safety'],
        featured: true, postedBy: admin._id,
      },
      {
        title: '5 Acres Agricultural Land near Shamshabad',
        description: 'Fertile agricultural land with proper road connectivity and water supply. Clear title documents, adjacent to highway. Suitable for farming or future development.',
        price: 8000000, type: 'sale', category: 'land', status: 'available',
        location: { address: 'Survey No. 45, Shamshabad Mandal', city: 'Hyderabad', state: 'Telangana', zipCode: '501218' },
        features: { bedrooms: 0, bathrooms: 0, area: 217800, parking: false, furnished: false },
        images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
        amenities: ['Clear Title', 'Road Access', 'Water Available'],
        featured: false, postedBy: admin._id,
      },
      {
        title: 'Studio Condo in Kondapur with Rooftop Garden',
        description: 'Compact and modern studio condo perfect for working professionals. Fully equipped kitchen, smart home features, high-speed internet infrastructure, and great views from the 14th floor.',
        price: 22000, type: 'rent', category: 'condo', status: 'available',
        location: { address: '8th Floor, Pearl Tower, Kondapur', city: 'Hyderabad', state: 'Telangana', zipCode: '500084' },
        features: { bedrooms: 1, bathrooms: 1, area: 550, parking: false, furnished: true, balcony: false },
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
        amenities: ['Gym', 'Rooftop Garden', '24/7 Security', 'Housekeeping'],
        featured: false, postedBy: admin._id,
      },
      {
        title: 'Spacious 3BHK Independent House in Miyapur',
        description: 'Independent house with private garden, two-car parking, and excellent connectivity. Perfect for families looking for privacy and space in a serene neighbourhood.',
        price: 12500000, type: 'sale', category: 'house', status: 'available',
        location: { address: '23, Green Valley Colony, Miyapur', city: 'Hyderabad', state: 'Telangana', zipCode: '500049' },
        features: { bedrooms: 3, bathrooms: 3, area: 2800, parking: true, furnished: false, balcony: true },
        images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80'],
        amenities: ['Private Garden', 'Security', 'Solar Power', 'Rain Water Harvesting'],
        featured: false, postedBy: admin._id,
      },
      {
        title: 'Penthouse Apartment in Madhapur',
        description: 'Exquisite penthouse with 360-degree city views, private terrace, premium interiors. An ultra-luxury residence above Hyderabad\'s most vibrant district.',
        price: 45000000, type: 'sale', category: 'apartment', status: 'available',
        location: { address: 'Sky Tower, Madhapur Main Road', city: 'Hyderabad', state: 'Telangana', zipCode: '500081' },
        features: { bedrooms: 5, bathrooms: 5, area: 6500, parking: true, furnished: true, pool: true, gym: true, balcony: true },
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'],
        amenities: ['Private Terrace', 'Concierge', 'Valet Parking', 'Spa', 'Home Automation'],
        featured: true, postedBy: admin._id,
      },
      {
        title: '1BHK Affordable Apartment in Kukatpally',
        description: 'Budget-friendly 1BHK apartment ideal for young professionals and couples. Well-connected to major IT corridors, metro station within walking distance.',
        price: 18000, type: 'rent', category: 'apartment', status: 'available',
        location: { address: 'KPHB Phase 7, Kukatpally', city: 'Hyderabad', state: 'Telangana', zipCode: '500072' },
        features: { bedrooms: 1, bathrooms: 1, area: 680, parking: false, furnished: false, balcony: true },
        images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'],
        amenities: ['Power Backup', 'Security', 'Water Supply'],
        featured: false, postedBy: admin._id,
      },
    ];

    await Property.insertMany(properties);
    console.log(`🏠 Created ${properties.length} sample properties`);

    console.log('\n✨ Seed complete!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 Login Credentials:');
    console.log('   Admin: admin@luxestate.com / admin123');
    console.log('   User:  user@estatex.com / user1234');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 Frontend: http://localhost:5173');
    console.log('🔌 Backend:  http://localhost:5000');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
};

seedData();
