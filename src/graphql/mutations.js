/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const addNewUser = /* GraphQL */ `
  mutation AddNewUser(
    $pkid: String!
    $UserEmail: String!
    $UserSubscriptionStatus: String!
  ) {
    addNewUser(
      pkid: $pkid
      UserEmail: $UserEmail
      UserSubscriptionStatus: $UserSubscriptionStatus
    ) {
      PK
      SK
      UserEmail
      UserSubscriptionStatus
    }
  }
`;
export const addNewTodo = /* GraphQL */ `
  mutation AddNewTodo(
    $id: String!
    $ListDescription: String
    $ListImage: String
    $ListStatus: String!
    $ListTitle: String
  ) {
    addNewTodo(
      id: $id
      ListDescription: $ListDescription
      ListImage: $ListImage
      ListStatus: $ListStatus
      ListTitle: $ListTitle
    )
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo($pkid: String!, $skid: String!) {
    deleteTodo(pkid: $pkid, skid: $skid)
  }
`;
export const updateTodo = /* GraphQL */ `
  mutation UpdateTodo(
    $pkid: String!
    $skid: String!
    $ListDescription: String
    $ListImage: String
    $ListStatus: String
    $ListTitle: String
  ) {
    updateTodo(
      pkid: $pkid
      skid: $skid
      ListDescription: $ListDescription
      ListImage: $ListImage
      ListStatus: $ListStatus
      ListTitle: $ListTitle
    )
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($pkid: String!, $UserSubscriptionStatus: String!) {
    updateUser(pkid: $pkid, UserSubscriptionStatus: $UserSubscriptionStatus) {
      PK
      SK
      UserEmail
      UserSubscriptionStatus
    }
  }
`;
export const createNote = /* GraphQL */ `
  mutation CreateNote(
    $input: CreateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    createNote(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const updateNote = /* GraphQL */ `
  mutation UpdateNote(
    $input: UpdateNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    updateNote(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
export const deleteNote = /* GraphQL */ `
  mutation DeleteNote(
    $input: DeleteNoteInput!
    $condition: ModelNoteConditionInput
  ) {
    deleteNote(input: $input, condition: $condition) {
      id
      name
      description
      image
      createdAt
      updatedAt
    }
  }
`;
