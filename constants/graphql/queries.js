// query variables: profHex
export const fetchUserProfile = "query userProfile($profHex: [ProfileId!]) { profiles(request: { profileIds: $profHex }) { items { id ownedBy handle metadata dispatcher { address canUseRelay } followNftAddress stats { totalFollowers totalFollowing totalPosts totalComments totalMirrors totalPublications totalCollects } } } }"

// query variables: accHex
export const fetchOrganisationDetails = "query GetOrg($accHex: String){ account(id: $accHex){ id name metaURI members { id } projects { id name releases { id name metaURI } } } }"

export const fetchProjectDetails = "query GetProj ($projId: String){ project(id: $projId){ id name metaURI members{ id } releases {id name metaURI }}}"

export const ACCOUNTS_SEARCH__QUERY = "\n query AccountSearch($search: String){\n accounts(where:{name_contains: $search}){\n id\n name\n metaURI\n }\n }\n"

export const CHALLENGE_QUERY = `query Challenge ($address: EthereumAddress!) {challenge(request: { address: $address }){text}}`

export const AUTHENTICATE_MUTATION = `mutation Authenticate ($address: EthereumAddress!, $signature:Signature!) {authenticate(request: {address: $address signature: $signature}){accessToken refreshToken}}`

export const CREATE_PROFILE_MUTATION = `mutation CreateProfile($username: CreateHandle!, $img:Url) {createProfile(request:{ handle: $username,profilePictureUri: $img, followModule: {freeFollowModule: true}}) {... on RelayerResult {txHash}... on RelayError {reason}__typename}}`

export const LENS_PROFILE_EXISTS = "query AccountExists ($name:Handle){profile(request: {handle: $name}) {id}}"

export const LENS_PROFILE_DETAILS = `query Profile ($id:ProfileId!) {
  profile(request: { profileId: $id}) {
    id
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          url
          mimeType
        }
      }
      __typename
    }
    handle
    ownedBy
  }
}`