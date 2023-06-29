/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($pkid: String!) {
    getUser(pkid: $pkid) {
      PK
      SK
      UserEmail
      UserSubscriptionStatus
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
      }
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
      }
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
      }
      nextToken
    }
  }
`;
