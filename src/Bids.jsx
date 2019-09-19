import React from 'react';
import { Card } from 'semantic-ui-react'

const Bids = ({ bid }) => {
    return (
        <Card>
        <Card.Content>
          <Card.Description>{bid}</Card.Description>
        </Card.Content>
      </Card>
    );
}
 
export default Bids;