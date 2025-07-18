/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTeamMember = /* GraphQL */ `
  mutation CreateTeamMember(
    $input: CreateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    createTeamMember(input: $input, condition: $condition) {
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
export const updateTeamMember = /* GraphQL */ `
  mutation UpdateTeamMember(
    $input: UpdateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    updateTeamMember(input: $input, condition: $condition) {
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
export const deleteTeamMember = /* GraphQL */ `
  mutation DeleteTeamMember(
    $input: DeleteTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    deleteTeamMember(input: $input, condition: $condition) {
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
export const createService = /* GraphQL */ `
  mutation CreateService(
    $input: CreateServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    createService(input: $input, condition: $condition) {
      id
      title
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateService = /* GraphQL */ `
  mutation UpdateService(
    $input: UpdateServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    updateService(input: $input, condition: $condition) {
      id
      title
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteService = /* GraphQL */ `
  mutation DeleteService(
    $input: DeleteServiceInput!
    $condition: ModelServiceConditionInput
  ) {
    deleteService(input: $input, condition: $condition) {
      id
      title
      description
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPortfolioItem = /* GraphQL */ `
  mutation CreatePortfolioItem(
    $input: CreatePortfolioItemInput!
    $condition: ModelPortfolioItemConditionInput
  ) {
    createPortfolioItem(input: $input, condition: $condition) {
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
export const updatePortfolioItem = /* GraphQL */ `
  mutation UpdatePortfolioItem(
    $input: UpdatePortfolioItemInput!
    $condition: ModelPortfolioItemConditionInput
  ) {
    updatePortfolioItem(input: $input, condition: $condition) {
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
export const deletePortfolioItem = /* GraphQL */ `
  mutation DeletePortfolioItem(
    $input: DeletePortfolioItemInput!
    $condition: ModelPortfolioItemConditionInput
  ) {
    deletePortfolioItem(input: $input, condition: $condition) {
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
export const createEquipment = /* GraphQL */ `
  mutation CreateEquipment(
    $input: CreateEquipmentInput!
    $condition: ModelEquipmentConditionInput
  ) {
    createEquipment(input: $input, condition: $condition) {
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
export const updateEquipment = /* GraphQL */ `
  mutation UpdateEquipment(
    $input: UpdateEquipmentInput!
    $condition: ModelEquipmentConditionInput
  ) {
    updateEquipment(input: $input, condition: $condition) {
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
export const deleteEquipment = /* GraphQL */ `
  mutation DeleteEquipment(
    $input: DeleteEquipmentInput!
    $condition: ModelEquipmentConditionInput
  ) {
    deleteEquipment(input: $input, condition: $condition) {
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
