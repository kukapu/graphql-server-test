import { gql } from '@apollo/client'


export const FIND_PERSON = gql`
query findPersonByName($nameToSearch: String!) {
  findPerson(name: $nameToSearch) {
    id
    name
    phone
    address {
      street
      city
    }
  }
}
`

export const ALL_PERSON = gql`
query {
  allPersons {
    id
    name
    phone
    address {
      street
      city
    }
  }
}
`