

import * as XLSX from 'xlsx';

const mediaFolder = process.env.REACT_APP_MEDIA_URL;


const exportToExcel = (products, categories) => {
  const data = [];

  products.forEach(product => {
    const categorySlugs = product.categories.map(catId => categories.find(cat => cat.id === catId)?.slug || catId).join(', ');

    // Push main product row with the first media, first variant, and first additional description
    data.push({
      'Slug': product.slug,
      'Name': product.name,
      'SKU': product.sku,
      'Short Description': product.description_short,
      'Description': product.description,
      'Weight': product.weight,
      'Length': product.length,
      'Width': product.width,
      'Height': product.height,
      'Minimum Quantity': product.quantity_min,
      'Stock': product.stock,
      'Price': product.price,
      'Discounted Price': product.discounted_price,
      'Cost': product.cost,
      'Media': product.media.length > 0 ? `${mediaFolder}${product.media[0]}` : '',
      'Published': product.published,
      'Upselling': product.is_upsell,
      'Categories': categorySlugs,
      'Variant Name': product.product_variants.length > 0 ? product.product_variants[0].name : '',
      'Variant SKU': product.product_variants.length > 0 ? product.product_variants[0].sku : '',
      'Variant Price': product.product_variants.length > 0 ? product.product_variants[0].price : '',
      'Variant Discounted Price': product.product_variants.length > 0 ? product.product_variants[0].discounted_price : '',
      'Variant Stock': product.product_variants.length > 0 ? product.product_variants[0].stock : '',
      'Variant Image': product.product_variants.length > 0 ? `${mediaFolder}${product.product_variants[0].image}` : '',
      'Additional Description Label': product.additional_descriptions.length > 0 ? product.additional_descriptions[0].label : '',
      'Additional Description Value': product.additional_descriptions.length > 0 ? product.additional_descriptions[0].value : ''
    });

    // Push additional media, variants, and additional descriptions in subsequent rows
    const maxLength = Math.max(product.media.length, product.product_variants.length, product.additional_descriptions.length);

    for (let i = 1; i < maxLength; i++) {
      data.push({
        'Slug': product.slug,
        'Name': '',
        'SKU': '',
        'Short Description': '',
        'Description': '',
        'Weight': '',
        'Length': '',
        'Width': '',
        'Height': '',
        'Minimum Quantity': '',
        'Stock': '',
        'Price': '',
        'Discounted Price': '',
        'Cost': '',
        'Media': product.media[i] ? `${mediaFolder}${product.media[i]}` : '',
        'Published': '',
        'Upselling': '',
        'Categories': '',
        'Variant Name': product.product_variants[i] ? product.product_variants[i].name : '',
        'Variant SKU': product.product_variants[i] ? product.product_variants[i].sku : '',
        'Variant Price': product.product_variants[i] ? product.product_variants[i].price : '',
        'Variant Discounted Price': product.product_variants[i] ? product.product_variants[i].discounted_price : '',
        'Variant Stock': product.product_variants[i] ? product.product_variants[i].stock : '',
        'Variant Image': product.product_variants[i] ? `${mediaFolder}${product.product_variants[i].image}` : '',
        'Additional Description Label': product.additional_descriptions[i] ? product.additional_descriptions[i].label : '',
        'Additional Description Value': product.additional_descriptions[i] ? product.additional_descriptions[i].value : ''
      });
    }
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

  XLSX.writeFile(workbook, 'products.xlsx');
};

export default exportToExcel;
