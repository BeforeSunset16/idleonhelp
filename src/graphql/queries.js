/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPictureGuide = /* GraphQL */ `
  query GetPictureGuide($id: ID!) {
    getPictureGuide(id: $id) {
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
export const listPictureGuides = /* GraphQL */ `
  query ListPictureGuides(
    $filter: ModelPictureGuideFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPictureGuides(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        active
        imgURL
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const pictureGuideSortByCreatedAt = /* GraphQL */ `
  query PictureGuideSortByCreatedAt(
    $active: ActiveType!
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelPictureGuideFilterInput
    $limit: Int
    $nextToken: String
  ) {
    pictureGuideSortByCreatedAt(
      active: $active
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        active
        imgURL
        createdAt
        updatedAt
        owner
        __typename
      }
      nextToken
      __typename
    }
  }
`;
