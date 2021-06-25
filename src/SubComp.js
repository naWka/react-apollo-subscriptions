import React from 'react';
import { gql, useQuery, useSubscription } from '@apollo/client';


const PROJECT_CONTENT = gql`
  query chat_content($id: ID!) {
    project(id: $id) {
      price
      id
    }
  }
`;

const SUB_TO_PRICE = gql`
  subscription ProjectEventCreatedSubscription($id: ID!) {
    projectEventCreated(id: $id) {
      project {
        id
        price
        campaign {
          id
        }
        priceChangeRequest {
          id
        }
      }
    }
  }
`;

// const SUB_TO_PRICE = gql`
//   subscription ProjectEventCreatedSubscription {
//     projectEventCreated {
//       project {
//         id
//         price
//         campaign {
//           id
//         }
//         priceChangeRequest {
//           id
//         }
//       }
//     }
//   }
// `;





const SubComp = () => {
  const id = '7b62a86a-87c1-46ef-a2c6-b7ce9b0e8c0d' 
  const { data, loading, subscribeToMore } = useQuery(PROJECT_CONTENT, {
    variables: { id },
  });
  //   const { data, loading } = useSubscription(SUB_TO_PRICE, {
  //   variables: { id },
  //   onSubscriptionData: () => console.log('onSubscriptionData'),
  //   onSubscriptionComplete: () => console.log('onSubscriptionComplete'),
  // });

  console.log({data, loading})
  subscribeToMore({
    document: SUB_TO_PRICE,
    variables: { id },
    updateQuery: (prev, { subscriptionData }) => {
      console.log({ prev, subscriptionData });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  return (
    <div>
      <div>sub comp</div>
      <div>{data?.project?.price}</div>
    </div>
    
  )
}

export default SubComp;