const productModel = require('../models/products');

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFields } = req.query;
  const queryObj = {};

  if (featured) {
    queryObj['featured'] = featured === 'true' ? true : false;
  }

  if (company) {
    queryObj['company'] = company;
  }

  if (name) {
    queryObj.name = { $regex: new RegExp(`${name}`) };
  }

  const allProducts = productModel.find(queryObj);

  if (sort) {
    const sortList = sort.replace(/,/g, ' ');
    allProducts.sort(sortList);
  }

  if (fields) {
    const fieldsList = fields.replace(/,/g, ' ');
    allProducts.select(fieldsList);
  }

  if (numericFields) {
    const options = ['price', 'rating'];
    const numericFieldsArray = numericFields.split(',');
    const regex = /^(\w+)(<|>|<=|>=|=)(\d+(?:\.\d+)?)$/;

    for (let current of numericFieldsArray) {
      const regexSearch = regex.exec(current);

      if (regexSearch) {
        const key = regexSearch[1];
        const op = regexSearch[2];
        const value = regexSearch[3];

        let mongooseOp;

        switch (op) {
          case '>':
            mongooseOp = '$gt';
            break;
          case '<':
            mongooseOp = '$lt';
            break;
          case '>=':
            mongooseOp = '$gte';
            break;
          case '<=':
            mongooseOp = '$lte';
            break;
          case '=':
            mongooseOp = '$eq';
            break;
          default:
            mongooseOp = null;
            break;
        }

        if (mongooseOp && options.includes(key)) {
          allProducts.find({ [key]: { [mongooseOp]: value } });
        }
      }
    }
  }

  //pagination
  const limit = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;

  allProducts.skip(skip).limit(limit);

  const result = await allProducts;

  res.status(200).json({ nHits: result.length, data: result });
};

const getProduct = async (req, res) => {
  const product = await productModel.findById(req.params.id);
  res.status(200).json(product);
};

const createProduct = async (req, res) => {
  const product = await productModel.create(req.body);
  res.status(200).json(product);
};

const patchProduct = async (req, res) => {
  const product = await productModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );

  res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const product = await productModel.findByIdAndDelete(req.params.id);

  res.status(200).json(product);
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  patchProduct,
  deleteProduct,
};
