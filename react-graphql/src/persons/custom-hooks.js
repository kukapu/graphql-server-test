import { useQuery } from "@apollo/client"
import { ALL_PERSON } from "./graphql-queries"

export const usePersons = () => {
  const result = useQuery(ALL_PERSON)
  return result
}