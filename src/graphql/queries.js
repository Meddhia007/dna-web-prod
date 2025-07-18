/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTeamMember = /* GraphQL */ `
  query GetTeamMember($id: ID!) {
    getTeamMember(id: $id) {
      id
      name
      role
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listTeamMembers = /* GraphQL */ `
  query ListTeamMembers(
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        role
        description
        image
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getService = /* GraphQL */ `
  query GetService($id: ID!) {
    getService(id: $id) {
      id
      title
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listServices = /* GraphQL */ `
  query ListServices(
    $filter: ModelServiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listServices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPortfolioItem = /* GraphQL */ `
  query GetPortfolioItem($id: ID!) {
    getPortfolioItem(id: $id) {
      id
      title
      category
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listPortfolioItems = /* GraphQL */ `
  query ListPortfolioItems(
    $filter: ModelPortfolioItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPortfolioItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        category
        image
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEquipment = /* GraphQL */ `
  query GetEquipment($id: ID!) {
    getEquipment(id: $id) {
      id
      name
      description
      badge
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listEquipment = /* GraphQL */ `
  query ListEquipment(
    $filter: ModelEquipmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEquipment(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        badge
        image
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
