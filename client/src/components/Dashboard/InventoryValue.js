// client/src/components/Dashboard/InventoryValue.js
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { FaBoxes, FaBox, FaDollarSign } from 'react-icons/fa';
import { formatCurrency } from '../../utils/helpers';

const InventoryValue = ({ loading, data }) => {
  // ✅ Add a fallback to prevent destructuring from failing
  const { totalValue = 0, totalProducts = 0, totalItems = 0 } = data || {};

  // Cards with inventory summary information
  const infoCards = [
    {
      title: 'Total Inventory Value',
      value: formatCurrency(totalValue),
      icon: <FaDollarSign className="text-primary" />,
      color: 'primary'
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: <FaBox className="text-success" />,
      color: 'success'
    },
    {
      title: 'Total Items in Stock',
      value: totalItems,
      icon: <FaBoxes className="text-info" />,
      color: 'info'
    }
  ];

  return (
    <Row className="mb-4">
      {infoCards.map((card, index) => (
        <Col key={index} md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Row>
                <Col>
                  <div className={`text-${card.color} text-uppercase font-weight-bold text-xs mb-1`}>
                    {card.title}
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      card.value
                    )}
                  </div>
                </Col>
                <Col xs="auto">
                  <div className="icon-circle bg-light">
                    {card.icon}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default InventoryValue;
