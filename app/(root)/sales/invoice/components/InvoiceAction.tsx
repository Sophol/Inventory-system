import React from 'react';

import "../invoice.css";

interface Card20Props {
  title: string;
  children: React.ReactNode;
}

const InvoiceAction: React.FC<Card20Props> = ({ title, children }) => {
  return (
    <div className="card20">
      <h2>{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default InvoiceAction;