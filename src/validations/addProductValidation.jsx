import * as Yup from "yup";

// Yup.addMethod(Yup.array, "unique", function (message, mapper = (a) => a) {
//     return this.test("unique", message, function (list) {
//       return list.length === new Set(list.map(mapper)).size
//     })
//   })

Yup.addMethod(Yup.array, 'unique', function (message) {
  return this.test('unique', message, function (value) {
      const names = value.map(item => item.name); // Extract names from variants
      const isUnique = names.length === new Set(names).size; // Check if names are unique
      return isUnique;
  });
});

Yup.addMethod(Yup.array, 'uniqueNames', function (message) {
  return this.test('uniqueNames', message, function (value) {
      const names = value.map(item => item.name); // Extract names from variants
      const isUnique = names.length === new Set(names).size; // Check if names are unique
      return isUnique;
  });
});

const productVariantSchema = Yup.object().shape({
  variantName: Yup.string().nullable(),
  variantSKU: Yup.string().required("SKU is a required field"),
  variantPrice: Yup.number().required('Price is a required field').positive("Price field must be a number"),
  variantStock: Yup.number().required("Stock is a required field").positive("Stock field must be a number"),
  variantDiscountedPrice: Yup.number()
    .when('variantPrice', (variantPrice, schema) =>
      variantPrice ? schema
        .positive()
        .lessThan(variantPrice, "Discounted price must be less than price")
        .nullable()
      : schema
    )
});

const transformProductVariant = (value, originalValue) => {
  if (originalValue === null || originalValue === undefined || originalValue.length === 0) {
    return null;
  }
  return value;
};

export const addProductValidation = Yup.object({

  // productVariant: Yup.array().of(
  //   Yup.object().shape({
  //     variantName: Yup.string().nullable(),
  //     variantSKU: Yup.string().required("SKU is a required field"),
  //     variantPrice: Yup.number().required('Price is a required field').positive("Price field must be a number"),
  //     variantStock: Yup.number().required("Stock is a required field").positive("Stock field must be a number"),
  //     variantDiscountedPrice: Yup.number()
  //       .when('variantPrice', (variantPrice, schema) =>
  //         variantPrice ? schema
  //           .positive()
  //           .lessThan(variantPrice, "Discounted price must be less than price")
  //           .nullable()
  //         : schema
  //       )
  //   })
  // ).nullable().default([]) ,
  // productVariant: Yup.array().nullable().transform(transformProductVariant).of(productVariantSchema),
  
  name: Yup.string().required("Please enter product name"),
  sku: Yup.string().required('Please enter this field'),
  // short_description: Yup.string().required("Please enter short description"),
  description: Yup.string().nullable(),
  published: Yup.string(),
  category: Yup.array()
    .min(1, "At least one option is required")
    .required("This field is required"),
  brand_id: Yup.string().required("Please select a brand"),
  weight: Yup.number().required("Please enter weight").positive(),
  price: Yup.number().required("Please enter price").positive(),
  cost: Yup.number()
    .positive()
    .lessThan(Yup.ref("price"), "Cost must be less than price"),
  discounted_price: Yup.number()
    .positive()
    .lessThan(Yup.ref("price"), "Discounted price must be less than price"),

    additional_descriptions: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string().required('Please select a label'),
          value: Yup.string().required('Please enter a value'),
        }))

  // variants: Yup.array()
  //   .of(
  //     Yup.object().shape({
  //       name: Yup.string().required("Variant name is a required field"),
  //       options: Yup.array()
  //         .of(Yup.string().required("Option is a required field")),
  //     })
  //   ).nullable().default([]),

  //   optionName: Yup.string().required('Name is required'),
  // options: Yup.array().of(
  //   Yup.object().shape({
  //     value: Yup.string().required('Option value is required'),
  //   })
  // ),
 
    // .test("is-unique", "Variants must have unique names", function (value) {
      // if (!value) return true; // Skip validation if variants array is empty
      // const names = value.map(variant => variant.name);
      // return names.length === new Set(names).size; // Check if names are unique
    //   console.log("Value:", value);
    //   const names = value.map((item) => item.name);
    //   console.log("Names:", names);
    //   const uniqueNames = new Set(names);
    //   console.log("Unique Names:", uniqueNames);
    //   console.log("Is Unique:", uniqueNames.size === names.length);
        // return value.length === new Set(value.map(mapper)).size
      
       
    // }),
  // banner:  Yup.mixed()
  // .test(
  //   "fileSize",
  //   "File size too large, max file size is 1 Mb",
  //   (file) => file && file.size <= 1100000
  // )
  // .test(
  //   "fileType",
  //   "Incorrect file type",
  //   (file) =>
  //     file && ["image/png", "image/jpg", "image/jpeg"].includes(file.type)
  // ),
});
