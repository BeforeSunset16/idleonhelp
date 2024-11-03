/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPictureGuide = /* GraphQL */ `
  mutation CreatePictureGuide(
    $input: CreatePictureGuideInput!
    $condition: ModelPictureGuideConditionInput
  ) {
    createPictureGuide(input: $input, condition: $condition) {
      id
      title
      active
      imgURL
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const updatePictureGuide = /* GraphQL */ `
  mutation UpdatePictureGuide(
    $input: UpdatePictureGuideInput!
    $condition: ModelPictureGuideConditionInput
  ) {
    updatePictureGuide(input: $input, condition: $condition) {
      id
      title
      active
      imgURL
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const deletePictureGuide = /* GraphQL */ `
  mutation DeletePictureGuide(
    $input: DeletePictureGuideInput!
    $condition: ModelPictureGuideConditionInput
  ) {
    deletePictureGuide(input: $input, condition: $condition) {
      id
      title
      active
      imgURL
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
