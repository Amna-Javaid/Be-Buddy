const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://127.0.0.1:27017/beBuddyDB')
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

const products = [
  {
    name: 'Matte Lipstick',
    price: 15.99,
    description: 'Long-lasting matte lipstick with rich pigmentation and smooth finish.',
    image: 'lipstick.jpg',
    category: 'Makeup'
  },
  {
    name: 'Liquid Foundation',
    price: 24.99,
    description: 'Full-coverage liquid foundation suitable for all skin types.',
    image: 'foundation.jpg',
    category: 'Makeup'
  },
  {
    name: 'Mascara',
    price: 12.99,
    description: 'Waterproof mascara for longer, thicker, and voluminous lashes.',
    image: 'mascara.jpg',
    category: 'Eye Makeup'
  },
  {
    name: 'Eyeshadow Palette',
    price: 29.99,
    description: 'Professional eyeshadow palette with 12 highly pigmented shades.',
    image: 'eyeshadow.jpg',
    category: 'Eye Makeup'
  },
  {
    name: 'Makeup Brushes Set',
    price: 19.99,
    description: 'Soft synthetic makeup brushes set for flawless blending.',
    image: 'brushes.jpg',
    category: 'Beauty Tools'
  }
];


async function seedProducts() {
  try {
    //await Product.deleteMany({});
    await Product.insertMany(products);
    console.log('Products seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    mongoose.connection.close();
  }
}

seedProducts();
