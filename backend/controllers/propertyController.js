const Property = require('../models/Property');

const getProperties = async (req, res) => {
  try {
    const {
      search, type, category, city, minPrice, maxPrice,
      bedrooms, status, featured, page = 1, limit = 9, sort = '-createdAt',
    } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title:              { $regex: search, $options: 'i' } },
        { description:        { $regex: search, $options: 'i' } },
        { 'location.city':    { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }
    if (type)     filter.type     = type;
    if (category) filter.category = category;
    if (status)   filter.status   = status;
    if (featured) filter.featured = featured === 'true';
    if (city)     filter['location.city'] = { $regex: city, $options: 'i' };
    if (bedrooms) filter['features.bedrooms'] = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const total      = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .populate('postedBy', 'name email phone')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ properties, total, pages: Math.ceil(total / limit), currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('postedBy', 'name email phone avatar');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    property.views += 1;
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProperty = async (req, res) => {
  try {
    const { title, description, price, type, category, status, location, features, amenities, featured, images } = req.body;
    const property = await Property.create({
      title, description, price, type, category, status,
      location, features, amenities, featured,
      images: images || [],
      postedBy: req.user._id,
    });
    const populated = await property.populate('postedBy', 'name email phone');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const updated = await Property.findByIdAndUpdate(
      req.params.id, { ...req.body }, { new: true, runValidators: true }
    ).populate('postedBy', 'name email phone');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const [total, forSale, forRent, available, sold, rented, featured] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ type: 'sale' }),
      Property.countDocuments({ type: 'rent' }),
      Property.countDocuments({ status: 'available' }),
      Property.countDocuments({ status: 'sold' }),
      Property.countDocuments({ status: 'rented' }),
      Property.countDocuments({ featured: true }),
    ]);
    res.json({ total, forSale, forRent, available, sold, rented, featured });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getStats };
