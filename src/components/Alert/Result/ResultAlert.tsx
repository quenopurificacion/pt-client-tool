import React from 'react';
import { Alert } from '@/components/ui';

interface ResultAlertProps {
  type: 'error' | 'warning' | 'success';
  message: string;
}

const ResultAlert: React.FC<ResultAlertProps> = ({ type, message }) => {
  const variants = {
    error: "bg-red-100 border-red-300 text-red-800",
    warning: "bg-yellow-100 border-yellow-300 text-yellow-800",
    success: "bg-green-100 border-green-300 text-green-800",
  };

  return (
    <Alert className={`block ${variants[type]}`}>
      <p>{message}</p>
    </Alert>
  );
};

export default ResultAlert;
