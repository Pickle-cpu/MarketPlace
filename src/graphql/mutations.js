/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const stripeAddNewConnnectedUser = /* GraphQL */ `
  mutation StripeAddNewConnnectedUser(
    $pkid: String!
    $UserEmail: String!
    $UserSubscriptionStatus: String!
  ) {
    stripeAddNewConnnectedUser(
      pkid: $pkid
      UserEmail: $UserEmail
      UserSubscriptionStatus: $UserSubscriptionStatus
    ) {
      connectedid
      onboardinglink
    }
  }
`;
export const deleteOrder = /* GraphQL */ `
  mutation DeleteOrder(
    $sellerid: String!
    $buyerid: String!
    $createdDate: String!
  ) {
    deleteOrder(
      sellerid: $sellerid
      buyerid: $buyerid
      createdDate: $createdDate
    )
  }
`;
export const addNewOrder = /* GraphQL */ `
  mutation AddNewOrder(
    $sellerid: String!
    $buyerid: String!
    $listid: String!
    $listprice: String!
    $quantity: String!
    $orderstatus: String!
  ) {
    addNewOrder(
      sellerid: $sellerid
      buyerid: $buyerid
      listid: $listid
      listprice: $listprice
      quantity: $quantity
      orderstatus: $orderstatus
    ) {
      PK
      SK
      OrderCreatedDate
      OrderPrice
      OrderQuantity
      OrderStatus
      OrderSellerid
      OrderBuyerid
      OrderOfList
    }
  }
`;
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
    $ListPrice: String
  ) {
    addNewTodo(
      id: $id
      ListDescription: $ListDescription
      ListImage: $ListImage
      ListStatus: $ListStatus
      ListTitle: $ListTitle
      ListPrice: $ListPrice
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
    $ListPrice: String
  ) {
    updateTodo(
      pkid: $pkid
      skid: $skid
      ListDescription: $ListDescription
      ListImage: $ListImage
      ListStatus: $ListStatus
      ListTitle: $ListTitle
      ListPrice: $ListPrice
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
