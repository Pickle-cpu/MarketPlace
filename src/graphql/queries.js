/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getOrdersByBuyer = /* GraphQL */ `
  query GetOrdersByBuyer($buyerid: String!) {
    getOrdersByBuyer(buyerid: $buyerid) {
      orderList {
        PK
        SK
        OrderCreatedDate
        OrderPrice
        OrderQuantity
        OrderStatus
        OrderSellerid
        OrderBuyerid
        OrderOfList
        OrderCheckoutSessionID
        OrderCheckoutSessionURL
        OrderCheckoutSessionPaymentIntent
        __typename
      }
      __typename
    }
  }
`;
export const getOrdersBySeller = /* GraphQL */ `
  query GetOrdersBySeller($sellerid: String!) {
    getOrdersBySeller(sellerid: $sellerid) {
      orderList {
        PK
        SK
        OrderCreatedDate
        OrderPrice
        OrderQuantity
        OrderStatus
        OrderSellerid
        OrderBuyerid
        OrderOfList
        OrderCheckoutSessionID
        OrderCheckoutSessionURL
        OrderCheckoutSessionPaymentIntent
        __typename
      }
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($pkid: String!) {
    getUser(pkid: $pkid) {
      PK
      SK
      UserEmail
      UserSubscriptionStatus
      UserConnectedAccountID
      UserConnectedAccountUrl
      UserConnectedAccountExpiresTime
      UserConnectedAccountStatus
      __typename
    }
  }
`;
export const getUserCertainNote = /* GraphQL */ `
  query GetUserCertainNote($pkid: String!, $skid: String!) {
    getUserCertainNote(pkid: $pkid, skid: $skid) {
      PK
      SK
      GSI1PK
      GSI1SK
      ListCreatedDate
      ListDescription
      ListImage
      ListStatus
      ListTitle
      ListPrice
      __typename
    }
  }
`;
export const getUserNotes = /* GraphQL */ `
  query GetUserNotes($id: String!) {
    getUserNotes(id: $id) {
      todoList {
        PK
        SK
        GSI1PK
        GSI1SK
        ListCreatedDate
        ListDescription
        ListImage
        ListStatus
        ListTitle
        ListPrice
        __typename
      }
      __typename
    }
  }
`;
export const getNotesByStatus = /* GraphQL */ `
  query GetNotesByStatus($status: String!) {
    getNotesByStatus(status: $status) {
      todoList {
        PK
        SK
        GSI1PK
        GSI1SK
        ListCreatedDate
        ListDescription
        ListImage
        ListStatus
        ListTitle
        ListPrice
        __typename
      }
      __typename
    }
  }
`;
export const getNote = /* GraphQL */ `
  query GetNote($id: ID!) {
    getNote(id: $id) {
      id
      name
      description
      image
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listNotes = /* GraphQL */ `
  query ListNotes(
    $filter: ModelNoteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listNotes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
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
